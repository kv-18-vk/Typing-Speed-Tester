//graphs//
Chart.register({
  id: 'centerTextPlugin',
  beforeDraw(chart) {
    if (chart.config.options.centerText) {
      const ctx = chart.ctx;
      const text = chart.config.options.centerText.text;
      const lines = text.split('\n');
      const fontSize = chart.config.options.centerText.fontSize || '18';
      const color = chart.config.options.centerText.color || '#333';

      ctx.save();
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const weight = chart.config.options.centerText.font?.weight || 'bold';
      ctx.font = `${weight} ${fontSize}px Arial`;

      const lineHeight = parseInt(fontSize) + 4;
      const centerY = chart.height / 2;
      const totalHeight = lineHeight * lines.length;
      const startY = centerY - totalHeight / 3 + lineHeight / 2;

      lines.forEach((line, index) => {
        ctx.fillText(line, chart.width / 2, startY + index * lineHeight);
      });

      ctx.restore();
    }
  }
});

function wpmchart(level){
  if(wpmchartcondition){
    wpmchartcondition.destroy();
  }
  let testDatesArray = [], wpmValuesArray = [];
  const pointcolors = ['blue','blue','blue','blue','white']

  db.collection(`users/${currentUser.uid}/${level} tests`)
  .where("DocType","==","test")
  .orderBy("timestamp","desc")
  .limit(5)
  .get()
  .then(snapshot=>{
    snapshot.forEach(doc=>{
      const userdata = doc.data();
      const dateandtime = userdata.timestamp.toDate();
      testDatesArray.push([dateandtime.toLocaleDateString("en-US", options = { month: 'long', day: 'numeric' }),dateandtime.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })]);
      wpmValuesArray.push(userdata.wpm);
    })
  })
  .then(()=>{
    testDatesArray.reverse();
    wpmValuesArray.reverse();
    if(testDatesArray.length>0 & wpmValuesArray.length>0){
      const wpmCtx = document.getElementById('wpmChart').getContext('2d');
      wpmchartcondition = new Chart(wpmCtx, {
        type: 'line',
        data: {
          labels: testDatesArray,  
          datasets: [{
            label: 'WPM',
            data: wpmValuesArray,  
            borderColor: 'blue',
            fill: true,
            backgroundColor: 'rgba(0, 223, 216, 0.1)',
            tension: 0.3,
            pointBackgroundColor: pointcolors,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          },
          hover: {
            mode: 'index',
            intersect: false
          },
          animation: {
            duration: 0 
          },
          animations: {
            x: {
              type: 'number',
              easing: 'easeOutCubic',
              duration: 200,
              from: NaN,
              delay(ctx) {
                return ctx.index * 100;
              }
            },
            y: {
              type: 'number',
              easing: 'easeOutCubic',
              duration: 200,
              from: NaN,
              delay(ctx) {
                return ctx.index * 100;
              }
            }
          },
          elements: {
            line: {
              tension: 0.4,
              borderWidth: 3,
              borderColor: 'blue',
              fill: false
            },
            point: {
              radius: 4,
              backgroundColor: 'blue'
            }
          },
          plugins: {
            title: {
              display: true,
              text: `Typing Speed (WPM) Last 5 ${level} Tests`,
              color: '#333',
              padding: { bottom: 20 },
              font: { size: 18, weight: 'bold' }
            },
            legend: { display: false },
            tooltip: {
              displayColors: false,
              backgroundColor: '#111',
              titleColor: '#fff',
              bodyColor: '#00dfd8',
              padding: 10,
              borderRadius: 8,
              borderColor: '#00dfd8',
              borderWidth: 1,
              callbacks: {
                beforeLabel: function(context) {
                  const index = context.dataIndex;
                  const data = context.dataset.data;
                  if (index > 0) {
                    const diff = data[index] - data[index - 1];
                    if (diff > 0) return `📈 Increased (+${Math.floor((diff/data[index-1])*100)}%)`;
                    if (diff < 0) return `📉 Decreased (${Math.floor((diff/data[index-1])*100)}%)`;
                    return "➖Constant";
                  }
                  return '';
                },
                label: function(context) {
                  return `WPM: ${context.raw}`;
                }
              }
            }
          },
          layout: {
            padding: { left: 20 }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                color: '#0066cc',
                font: { weight: 'bold' }
              },
              border: { color: '#0066cc',width:2}
            },
            y: {
              grid: { display: false },
              ticks: {
                color: '#0066cc',
                font: { weight: 'bold' }
              },
              border: { color: '#0066cc',width:2}
            }
          }
        }

      });
    }
  })

}

function renderAccuracyChart(accuracy,id) {
  if (accuracyChartcondition) {
    accuracyChartcondition.destroy();
  }
  const ctx = document.getElementById(id).getContext("2d");
  accuracyChartcondition = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [0, 100],
        backgroundColor: ['red', '#e0e0e0'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      cutout: '75%',
      rotation: 0,
      circumference: 360,
      animation: {
        animateRotate: false,
        animateScale: false,
        duration: 0
      },
      centerText: {
        text: `Accuracy\n0%`,
        fontSize: 16,
        color: '#333',
        font:{weight:'900'}
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    }
  });

  let current = 0;
  const steps = 80;
  const delay = 20;
  const stepVal = accuracy / steps;

  const animate = () => {
    if (current <= accuracy) {
      let color = "red";
      if (current > 90) color = "#92f97b";
      else if (current > 70) color = "orange";
      else if (current > 50) color = "yellow";

      accuracyChartcondition.data.datasets[0].data[0] = current;
      accuracyChartcondition.data.datasets[0].data[1] = 100 - current;
      accuracyChartcondition.data.datasets[0].backgroundColor[0] = color;
      accuracyChartcondition.options.centerText.text = `Accuracy\n${Math.floor(current)}%`;
      accuracyChartcondition.options.centerText.color = color;
      accuracyChartcondition.update();
      current += stepVal;
      setTimeout(animate, delay);
    } else {
      let color = "red";
      if (accuracy > 90) color = "#92f97b";
      else if (accuracy > 70) color = "orange";
      else if (accuracy > 50) color = "yellow";

      accuracyChartcondition.data.datasets[0].data[0] = accuracy;
      accuracyChartcondition.data.datasets[0].data[1] = 100 - accuracy;
      accuracyChartcondition.data.datasets[0].backgroundColor[0] = color;
      accuracyChartcondition.options.centerText.text = `Accuracy\n ${Math.floor(accuracy)}%`;
      accuracyChartcondition.options.centerText.color = color;
      accuracyChartcondition.update();
    }
  };
  animate();
}


function displayerrors(wrongwords,list,box,title){
  const wrongListDiv = document.getElementById(list);
  const wrongbox = document.getElementById(box);
  const titlediv = document.getElementById(title);
  wrongListDiv.innerHTML = "";
  titlediv.innerHTML = "";

  if (wrongwords.length === 0) {
    wrongListDiv.innerHTML = "<strong style='color: green; text-align:center;'>All Correct 🎉</strong>";
    wrongbox.style.background = "#92f97b";
  } else {
    wrongbox.style.background = "#fff0f0";
    titlediv.innerHTML = `
      <div><strong>Expected</strong></div>
      <div><strong>Your Input</strong></div>
    `;
    wrongwords.forEach(pair => {
      const [expected, typed] = pair;
      const div = document.createElement("div");
      div.className = "wrongword-item";
      div.innerHTML = `
          <div><strong style="color:green">${expected}</strong></div>
          <div><strong style="color:red">${typed}</strong></div>
      `;
      wrongListDiv.appendChild(div);
    });
  }
}




let allchart = null;

function totalgraphs(level) {
  if (!currentUser?.email) {
    console.error("User not logged in");
    return;
  }
  if (allchart) {allchart.destroy();}

  const canvas = document.getElementById('allwpmchart');

  const ctx = canvas.getContext('2d');
  const labels = [];
  const wpms = [];
  const accuracies = [];
  let index = 1;
  canvas.style.display = 'block';

  db.collection(`users/${currentUser.uid}/${level} tests`)
    .where("DocType", "==", "test")
    .orderBy("timestamp", "asc")
    .get()
    .then(snapshot => {
      if(snapshot.empty){
        return;
      }
      snapshot.forEach((doc) => {
        const testData = doc.data();
        wpms.push(testData.wpm);
        accuracies.push(testData.accuracy);
        const dateandtime = testData.timestamp.toDate();
        labels.push([dateandtime.toLocaleDateString("en-US", { month: 'long', day: 'numeric' }),dateandtime.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })]);
        index++;
      });
  const containerbox = document.querySelector(".containerbox");
  if (index > 7) {
    const newwidth = 700 + ((index - 5) * 140);
    containerbox.style.width = `${newwidth}px`;
  }
  const chartWidth = Math.max(300, labels.length * 140);
  canvas.style.width = `${chartWidth}px`;
  canvas.style.minWidth = '100%';

  const totalDuration = 1500; 
  const delayBetweenPoints = totalDuration / wpms.length;
      
  const animation = {
    x: {
      type: 'number',
      easing: 'linear',
      duration: delayBetweenPoints,
      from: NaN, 
      delay(ctx) {
        if (ctx.type !== 'data' || ctx.xStarted) {
          return 0;
        }
        ctx.xStarted = true;
        return ctx.index * delayBetweenPoints;
      }
    },
    y: {
      type: 'number',
      easing: 'linear',
      duration: delayBetweenPoints,
      from(ctx) {
        return ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(0) : 
                ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
      },
      delay(ctx) {
        if (ctx.type !== 'data' || ctx.yStarted) {
          return 0;
        }
        ctx.yStarted = true;
        return ctx.index * delayBetweenPoints;
      }
    }
  };

  allchart = new Chart(ctx, {
    type: 'line',
    data: {
    labels: labels,
      datasets: [
            {
              data: wpms,
              label: 'WPM',
              borderWidth: 2,
              borderColor: '#007bff',
              backgroundColor: 'rgba(0, 123, 255, 0.1)',
              fill: true,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointStyle: 'triangle',              
            },
            {
              data: accuracies,
              label: 'Accuracy%',
              borderWidth: 2,
              borderColor: '#28a745',
              backgroundColor: 'rgba(40, 167, 69, 0.1)',
              pointRadius: 4,
              pointHoverRadius: 6,
              pointStyle: 'circle',
            }
          ]
        },
        options: {
          animation: animation,
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index',
          },
          plugins: {
            legend: { 
              display: true,
              onClick: (e, legendItem, legend) => {
                const index = legendItem.datasetIndex;
                const ci = legend.chart;
                const meta = ci.getDatasetMeta(index);
                meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
                ci.update();
              }
            },
            tooltip: {
              position: 'nearest',
              usePointStyle: true,
            }
          },
          scales: {
            y: { 
              ticks: {
                color: 'black',
                font: { weight: 'bold' }
              },
              border: { color: 'black',width:2},          
              grid: {
                display: false
              }
            },
            x: {
              ticks: {
                autoSkip: false,
                color: 'black',
                font: {
                  weight: 'bold'
                }
              },
              border: { color: 'black',width:2},  
              grid: {
                display: false
              }
            }
          }
        }
      });
    })
}

document.getElementById('showChartBtn').addEventListener('click', function() {
  const chartContainer = document.querySelector('.chart-container');
  const button = this;
  
  chartContainer.classList.toggle('hidden');
  
  if (chartContainer.classList.contains('hidden')) {
    button.innerHTML = '<i class="fa-solid fa-chart-simple"></i> Show Stats Chart';
  } else {
    button.innerHTML = '<i class="fa-solid fa-times"></i> Hide Chart';
  }
});
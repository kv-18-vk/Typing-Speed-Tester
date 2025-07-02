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
  const options = { month: 'long', day: 'numeric' };
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
      testDatesArray.push([dateandtime.toLocaleDateString("en-US", options),dateandtime.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })]);
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

function renderAccuracyChart(accuracy) {
  if (accuracyChartcondition) {
    accuracyChartcondition.destroy();
  }
  const ctx = document.getElementById("accuracyChart").getContext("2d");
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
  const steps = 120;
  const delay = 15;
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


function displayerrors(wrongwords){
  const wrongListDiv = document.getElementById("wrongwords-list");
  const wrongbox = document.getElementById("wrongwords-box");
  const titlediv = document.getElementById("titlediv");
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
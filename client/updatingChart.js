import Chart from 'chart.js';

let canvas = document.getElementById('updating-chart'),
    ctx = canvas.getContext('2d'),
    data = {
      labels: [],
      datasets: [
          {
              fillColor: "rgba(220,220,220,0.2)",
              strokeColor: "rgba(220,220,220,1)",
              pointColor: "rgba(220,220,220,1)",
              pointStrokeColor: "#fff",
              data: []
          },
      ]
    };

// Reduce the animation steps for demo clarity.
var updatingChart = new Chart(ctx, {
  type: 'line', 
  options: {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      display: false
    },
    animation:{
      duration: 200
    },
    elements:{
      line:{
        tension: 0,
      }
    }
  },
  data
});

var newestLabel = 0;
var dataset = [],
  labels = [];

function addData(data){
  dataset.push(data);
  labels.push(++newestLabel);

  updatingChart.data.datasets[0].data = dataset.slice(-50);
  updatingChart.data.labels = labels.slice(-50);
  updatingChart.update();
  console.log("new chart data", data);
}

export {updatingChart, addData};
const CATEGORIES_CHART = document.getElementById("barChart");
const DOUGHNUT_CHART = document.getElementById("doughnutChart");
const LINE_CHART = document.getElementById("lineChart");

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function generateColors() {
    var coolColors = [];
    numItemsPerCategory.forEach(function() {
        coolColors.push(getRandomColor());
    });
    return coolColors;
}

var colors = generateColors();

let barChart = new Chart(CATEGORIES_CHART, {
    type: 'bar',
    data: {
        labels: labelsArray,
        datasets: [
            {
                label: "Categories By The Numbers",
                fill: false,
                lineTension: 0.1,
                backgroundColor: colors,
                borderColor: "rgba(75, 192, 192, 1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75, 192, 192, 1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75, 192, 192, 1)",
                pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: numItemsPerCategory,
            }
        ]
    },
    options: {
        legend: {
            display: true,
            labels: {
                fontColor: 'rgb(255, 255, 255)',
                fontSize: 25,
                fontFamily: "Segoe UI"
            }
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display: false,
                },
                ticks: {
                  fontColor: "#CCC" // this here
                },
            }],
            yAxes: [{
                display: true,
                gridLines: {
                    display: true,
                },
                ticks: {
                    fontColor: "#CCC",
                    beginAtZero: true,
                    stepSize: 1
                }
            }]
        }
    }
});


let doughnutChart = new Chart(DOUGHNUT_CHART, {
    type: 'doughnut',
    data: {
        labels: labelsArray,
        datasets: [
            {
                label: "Categories By The Numbers",
                fill: false,
                lineTension: 0.1,
                backgroundColor: colors,
                borderColor: "rgba(75, 192, 192, 1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75, 192, 192, 1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75, 192, 192, 1)",
                pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: numItemsPerCategory
            }
        ]
    },
    options: {
        legend: {
            display: true,
            labels: {
                fontColor: 'rgb(255, 255, 255)',
                fontSize: 12,
                fontFamily: "Segoe UI"
            }
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display: false,
                },
                ticks: {
                  fontColor: "#CCC" // this here
                },
            }],
            yAxes: [{
                display: true,
                gridLines: {
                    display: true,
                },
                ticks: {
                    fontColor: "#CCC",
                    beginAtZero: true,
                    stepSize: 1
                }
            }]
        }
    }
});




let lineChart = new Chart(LINE_CHART, {
    type: 'line',
    data: {
        labels: datesArray,
        datasets: [
            {
                label: "Items Added Per Day",
                fill: false,
                lineTension: 0.1,
                backgroundColor: colors,
                borderColor: "rgba(75, 192, 192, 1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75, 192, 192, 1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75, 192, 192, 1)",
                pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: itemsPerDateArray
            }
        ]
    },
    options: {
        legend: {
            display: true,
            labels: {
                fontColor: 'rgb(255, 255, 255)',
                fontSize: 25,
                fontFamily: "Segoe UI"
            }
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display: false,
                },
                ticks: {
                  fontColor: "#CCC" // this here
                },
            }],
            yAxes: [{
                display: true,
                gridLines: {
                    display: true,
                },
                ticks: {
                    fontColor: "#CCC",
                    beginAtZero: true,
                    stepSize: 1
                }
            }]
        }
    }
});

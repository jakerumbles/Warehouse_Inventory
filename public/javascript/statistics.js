const CHART = document.getElementById("lineChart");

let lineChart = new Chart(CHART, {
    type: 'line',
    data: {
        labels: labelsArray,
        datasets: [
            {
                label: "My First dataset",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75, 192, 192, 0.4)",
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
                data: valuesArray,
            }
            // ,
            // {
            //     label: "My Second dataset",
            //     fill: true,
            //     backgroundColor: "rgba(75, 75, 192, 0.4)",
            //     borderColor: "rgba(75, 75, 192, 1)",
            //     borderCapStyle: 'butt',
            //     borderDash: [],
            //     borderDashOffset: 0.0,
            //     borderJoinStyle: 'miter',
            //     pointBorderColor: "rgba(75, 75, 192, 1)",
            //     pointBackgroundColor: "#fff",
            //     pointBorderWidth: 1,
            //     pointHoverRadius: 5,
            //     pointHoverBackgroundColor: "rgba(75, 75, 192, 1)",
            //     pointHoverBorderColor: "rgba(220, 220, 220, 1)",
            //     pointHoverBorderWidth: 2,
            //     pointRadius: 1,
            //     pointHitRadius: 10,
            //     data: [100, 20, 40, 3, 78, 55, 89],
            // }
        ]
    }
});

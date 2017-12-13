var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var tree = [
    {
        text: "Clients",
        state: {
            checked: true,
            expanded: true,
        },
        nodes: [
            {
                text: "House PI",
                state: {
                    checked: true,
                    expanded: true,
                },
                nodes: [
                    {
                        text: "Sensors",
                        state: {
                            checked: true,
                            expanded: true,
                        },
                        nodes: [
                            {
                                text: "Temperature",
                                state: {
                                    checked: true
                                },
                            },
                            {
                                text: "Other"
                            }
                         ]
                    },
                    {
                        text: "System",
                        nodes: [
                            {
                                text: "RAM Usage"
                            }
                        ]
                    }
                ]
            }
        ]
    }
];


var tempConfig = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: "My First dataset",
            backgroundColor: window.chartColors.red,
            borderColor: window.chartColors.red,
            data: [],
            fill: false,
        }]
    },
    options: {
        responsive: true,
        title:{
            display:true,
            text:'Temperature Sensor Data'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Temperature (f)'
                }
            }]
        }
    }
};

var ramConfig = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: "Ram Usage %",
            backgroundColor: window.chartColors.blue,
            borderColor: window.chartColors.blue,
            data: [],
            fill: false,
        }]
    },
    options: {
        responsive: true,
        title:{
            display:true,
            text:'Ram Usage'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Ram Usage (%)'
                }
            }]
        }
    }
};

window.onload = function() {
    var ctx = document.getElementById("tempCanvas").getContext("2d");
    window.myTempLine = new Chart(ctx, tempConfig);
    var ctx2 = document.getElementById("ramCanvas").getContext("2d");
    window.myRamLine = new Chart(ctx2, ramConfig);

    $('#tree').treeview({
        data:  tree,
        showCheckbox: true,

        onNodeSelected: (function(event, data) {
            console.log("selected");
            console.log(event);
            console.log(data);
            $('#tree').treeview('toggleNodeChecked', [ data.nodeId, { silent: false } ]);
        }),

        onNodeChecked: (function(event, data) {
            console.log("chcked");
            console.log(event);
            console.log(data);
        }),

        onNodeUnchecked: (function(event, data) {
            console.log("unchcked");
            console.log(event);
            console.log(data);
        })

    });
};



var socket = io('127.0.0.1:3000');
socket.on('connect', function(){
    console.log("wut");
});

socket.on('addTempData', function(ramUsage, time){
    var datasets = tempConfig.data.datasets;
    var labels = tempConfig.data.labels;
    var maxDataPoints = 29;

    if (datasets.length > 0) {
        labels.push(time);

        datasets.forEach(function(dataset) {
            dataset.data.push(ramUsage);

            if(dataset.data.length > maxDataPoints) {
                labels.splice(0, dataset.data.length - maxDataPoints);
                dataset.data.splice(0, dataset.data.length - maxDataPoints);
            }
        });

        window.myTempLine.update();
    }
});

socket.on('addRamData', function(ramUsage, time){
    var datasets = ramConfig.data.datasets;
    var labels = ramConfig.data.labels;
    var maxDataPoints = 29;

    if (datasets.length > 0) {
        labels.push(time);

        datasets.forEach(function(dataset) {
            dataset.data.push(ramUsage);

            if(dataset.data.length > maxDataPoints) {
                labels.splice(0, dataset.data.length - maxDataPoints);
                dataset.data.splice(0, dataset.data.length - maxDataPoints);
            }
        });

        window.myRamLine.update();
    }
});




socket.on('disconnect', function(){});
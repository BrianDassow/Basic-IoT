var tree = [
    {
        text: "Clients",
        state: {
            checked: true,
            expanded: true
        },
        nodes: [
            {
                text: "House PI",
                state: {
                    checked: true,
                    expanded: true
                },
                nodes: [
                    {
                        text: "Sensors",
                        state: {
                            checked: true,
                            expanded: true
                        },
                        nodes: [
                            {
                                text: "Temperature",
                                state: {
                                    checked: true,
                                    expanded: true
                                }
                            },
                            {
                                text: "Humidity",
                                state: {
                                    checked: true,
                                    expanded: true
                                }
                            }
                         ]
                    },
                    {
                        text: "System",
                        state: {
                            checked: true,
                            expanded: true
                        },
                        nodes: [
                            {
                                text: "RAM Usage",
                                state: {
                                    checked: true,
                                    expanded: true
                                }
                            },
                            {
                                text: "Power Consumption",
                                state: {
                                    checked: true,
                                    expanded: true
                                }
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
            label: "Temp",
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

var humConfig = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: "Humidity",
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
            text:'Humidity Sensor Data'
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
                    labelString: 'Humidity (%)'
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
            label: "Ram Usage",
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
            text:'RAM Usage'
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

var powerConfig = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: "Power Usage",
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
            text:'Power Consumption'
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
                    labelString: 'Power Usage (W)'
                }
            }]
        }
    }
};

window.onload = function() {
    var tempCtx = document.getElementById("tempCanvas").getContext("2d");
    window.myTempLine = new Chart(tempCtx, tempConfig);
    var humCtx = document.getElementById("humCanvas").getContext("2d");
    window.myHumLine = new Chart(humCtx, humConfig);
    var ramCtx = document.getElementById("ramCanvas").getContext("2d");
    window.myRamLine = new Chart(ramCtx, ramConfig);
    var powerCtx = document.getElementById("powerCanvas").getContext("2d");
    window.myPowerLine = new Chart(powerCtx, powerConfig);

    $('#tree').treeview({
        data:  tree,
        showCheckbox: true,

        onNodeSelected: (function(event, data) {
            //$('#tree').treeview('toggleNodeChecked', [ data.nodeId, { silent: false } ]);
        }),

        onNodeChecked: (function(event, data) {
            if (data.text == "Temperature") {
                document.getElementById("tempCanvas").classList.remove("hideGraph");
            }
            else if (data.text == "Humidity") {
                document.getElementById("humCanvas").classList.remove("hideGraph");
            }
            else if (data.text == "RAM Usage") {
                document.getElementById("ramCanvas").classList.remove("hideGraph");
            }
            else if (data.text == "Power Consumption") {
                document.getElementById("powerCanvas").classList.remove("hideGraph");
            }
        }),

        onNodeUnchecked: (function(event, data) {
            if (data.text == "Temperature") {
                document.getElementById("tempCanvas").classList.add("hideGraph");
            }
            else if (data.text == "Humidity") {
                document.getElementById("humCanvas").classList.add("hideGraph");
            }
            else if (data.text == "RAM Usage") {
                document.getElementById("ramCanvas").classList.add("hideGraph");
            }
            else if (data.text == "Power Consumption") {
                document.getElementById("powerCanvas").classList.add("hideGraph");
            }
        })

    });
};



var socket = io('127.0.0.1:3000');
socket.on('connect', function(){
    console.log("Connected");
});

var maxDataPoints = 29;
socket.on('addTempData', function(temp, time){
    var datasets = tempConfig.data.datasets;
    var labels = tempConfig.data.labels;

    if (datasets.length > 0) {
        labels.push(time);

        datasets.forEach(function(dataset) {
            dataset.data.push(temp);

            if(dataset.data.length > maxDataPoints) {
                labels.splice(0, dataset.data.length - maxDataPoints);
                dataset.data.splice(0, dataset.data.length - maxDataPoints);
            }
        });

        window.myTempLine.update();
    }
});

socket.on('addHumData', function(hum, time){
    var datasets = humConfig.data.datasets;
    var labels = humConfig.data.labels;

    if (datasets.length > 0) {
        labels.push(time);

        datasets.forEach(function(dataset) {
            dataset.data.push(hum);

            if(dataset.data.length > maxDataPoints) {
                labels.splice(0, dataset.data.length - maxDataPoints);
                dataset.data.splice(0, dataset.data.length - maxDataPoints);
            }
        });

        window.myHumLine.update();
    }
});

socket.on('addRamData', function(ramUsage, time){
    var datasets = ramConfig.data.datasets;
    var labels = ramConfig.data.labels;

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

socket.on('addPowerData', function(power, time){
    var datasets = powerConfig.data.datasets;
    var labels = powerConfig.data.labels;

    if (datasets.length > 0) {
        labels.push(time);

        datasets.forEach(function(dataset) {
            dataset.data.push(power);

            if(dataset.data.length > maxDataPoints) {
                labels.splice(0, dataset.data.length - maxDataPoints);
                dataset.data.splice(0, dataset.data.length - maxDataPoints);
            }
        });

        window.myPowerLine.update();
    }
});

socket.on('disconnect', function(){});

function openSettings() {
    $('#settingsModal').modal("toggle");
}

function applySettings() {
    $('#settingsModal').modal("toggle");
    maxDataPoints = $('#maximumPoints').val();
    socket.emit("changeTimeInterval", $('#intervalRequest').val());


}
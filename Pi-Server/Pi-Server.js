var socketClient = require('socket.io-client')('http://127.0.0.1:3000');
var os = require('os');



function sendTempData() {
	//console.log(os.cpus());
	//console.log(os.totalmem());
	//console.log(os.freemem())
	//console.log((os.freemem()/os.totalmem())*100)
	var dateFormat = require('dateformat');
    var now = new Date();
    var nowFormatted = dateFormat(now, "hh:MM:ss");
    temp = 30 + Math.random()*(.5);
	socketClient.emit("tempDataFromPi", temp, nowFormatted);
}

function sendRamUsage() {
	var dateFormat = require('dateformat');
    var now = new Date();
    var nowFormatted = dateFormat(now, "hh:MM:ss");
	var ramUsage = Math.abs(1 - (os.freemem()/os.totalmem()))*100;
	socketClient.emit("ramDataFromPi", ramUsage, nowFormatted);
}

function sendCPUUsage() {
	console.log(os.cpus());
	var dateFormat = require('dateformat');
    var now = new Date();
    var nowFormatted = dateFormat(now, "hh:MM:ss");
	var cpus = os.cpus();
	cpus.forEach(function(cpu) {
		console.log(cpu);
	});
	//socketClient.emit("ramDataFromPi", ramUsage, nowFormatted);
}
sendCPUUsage();


// Send current time every 10 secs
setInterval(sendTempData, 1000);
setInterval(sendRamUsage, 1000);

// Emit welcome message on connection
socketClient.on('connect', function(socket) {
	console.log("Connected to main server.");
});

// Emit welcome message on connection
socketClient.on('disconnect', function(socket) {
	console.log("Disconnected from main server.");
});

console.log("Pi Server Listening.");
var socketClient = require('socket.io-client')('http://24.183.22.39:3000');
var os = require('os');
var timeInterval = 1000;

function sendAllData() {
	var dateFormat = require('dateformat');
    var now = new Date();
    var nowFormatted = dateFormat(now, "hh:MM:ss");
	var temp = 30 + Math.random()*(.1);
	socketClient.emit("tempDataFromPi", temp.toFixed(2), nowFormatted);
	
	var hum = 70 + Math.random()*(.1);
	socketClient.emit("humDataFromPi", hum.toFixed(2), nowFormatted);
	
	var ramUsage = Math.abs(1 - (os.freemem()/os.totalmem()))*100;
	socketClient.emit("ramDataFromPi", ramUsage.toFixed(2), nowFormatted);
	
    var power = ramUsage/100*(5) + Math.random()*(.3);
	socketClient.emit("powerDataFromPi", power.toFixed(2), nowFormatted);
}

// Emit welcome message on connection
socketClient.on('connect', function(socket) {
	console.log("Connected to main server.");
});

socketClient.on('changePIInterval', function(interval) {
	timeInterval = interval*1000;
});

// Emit welcome message on connection
socketClient.on('disconnect', function(socket) {
	console.log("Disconnected from main server.");
});

setTimeout(function run() {
	sendAllData();
	setTimeout(run, timeInterval);
}, timeInterval);

function myStopFunction() {
    clearTimeout(myVar);
}

console.log("Pi Server Listening.");
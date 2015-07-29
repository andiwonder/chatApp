var net = require('net');
var port = 2002;
var i = 0;
var currentConnections = 0;
var userArr = [];
var usernameArr = [];
var allChatHistory = [];
var fs = require('fs');





// var server = net.createServer(function(connection){
// 	connection.on("data", function (clientData){
// 		var str = clientData.toString();
// 		var finaldata = str.trim().split(" ");
// 		console.log(finaldata);
// 		connection.write(finaldata.toString());
// 	}) 
// });

// need an object that tracks username , message , time

var identifiers = function identifiers(named){
	this.named = named;
}

var chatHistory = function chatHistory(username , time , message){
	this.username = username;
	this.time = time;
	this.message = message;
}



var server = net.createServer()
server.on("connection",function(connection){
	var firstmsg = 1;
	userArr.push(connection);
	connection.write("Enter your username\n");
	currentConnections +=1 ;
	// console.log(currentConnections);
	connection.on("data", function (clientData){
		var str = clientData.toString();
		var finaldata = str.trim();

		if (firstmsg === 1){
			console.log("Fine ill save ur username");
			for (var i=0; i <allChatHistory.length; i++){
				if (allChatHistory.length > 5){
					console.log(allChatHistory);
					allChatHistory.splice(0,5);
					console.log(allChatHistory);
				}
				connection.write("          "+allChatHistory[i].username+allChatHistory[i].time+allChatHistory[i].message+"\n");
			}
			var newUserName = new identifiers(finaldata);
			// console.log(newUserName);
			firstmsg += 1;
			// console.log(firstmsg);
			usernameArr.push(newUserName);
		} else	{
			for (var i=0; i<userArr.length;i++){
				var d = new Date();
				var month = d.getMonth().toString();
				var day = d.getDay().toString();
				var hour = d.getHours().toString();
				var minutes = d.getMinutes().toString();
				var time = (month+"/"+day+" "+ hour+"."+minutes)
				if (userArr[i] === connection){
					console.log(usernameArr[i].named, time, finaldata.toString());
					var currentmsg = new chatHistory(usernameArr[i].named, time, finaldata.toString());
					allChatHistory.push(currentmsg);
					var msgsJSON = JSON.stringify(allChatHistory);
					fs.writeFileSync('chatdata.json',msgsJSON);
				} else {
					userArr[i].write(usernameArr[i+1].named+finaldata.toString()+"\n");
				}
			}
		} 
	})	
	connection.on("close",function(disconnect){
		console.log(allChatHistory);
		console.log("wow just leave like that")
	})

	//work
})




server.listen(port , function(){
	console.log("server in the port:",port);
})
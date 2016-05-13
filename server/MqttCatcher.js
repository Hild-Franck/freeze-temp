"use strict";

/**
 * Created by Mathieu Fontenille on 29/04/2016.
 * FEATURES :
 * - MQTT Subscriber
 * - Treat MQTT Datas (anti spam + anti useless data)
 * - Push MQTT Datas into database (security for non-conform datas)
 * - Webserver (anti XSS)
 * - Serve database MQTT datas for clients (JSON object via socket)
 *
 * TODO : - Faire la moyenne des 10 valeurs reçues en 10 sec et les pusher en BDD juste après
 */
//1- --------------------------SUPER VARIABLES GLOBALES--------------------------
/* Client MongoDB */
var mongo = require('mongodb').MongoClient;
var serverMongo = 'mongodb://10.31.3.44:27017/ThermoFridge';
var serverMongoMaison = 'mongodb://192.168.0.27:27017/ThermoFridge';
var serverMongo2 = 'mongodb://groupe4:lacalotte@192.168.43.248:27017/ThermoFridge';
var app = require('./express/app');

/* Web Server */
// var fs = require('fs');
// var http = require('http');

/* Mqtt subscriber */
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://messagesight.demos.ibm.com:1883');

//Dans ces buffers nous stockerons les dernières valeurs affin de les comparer avec les nouvelles et ne pas enregistrer 15 valeurs similaires en BDD dans la minute
var correctValueBuffer = {};
var valueBuffer = {"buffer1": {}, "buffer2": {}};
var bufferToUse = true;
var mqttTimer = new Date();
var globalTimer = new Date();

//2- --------------------------CONNEXION MONGO DB--------------------------
mongo.connect(serverMongo, function (err, db) {
	if (err) {
		console.log("Impossible de se connecter ", err);
	}
	else
		console.log("Connection to database:  OK");

//3- --------------------------SOUSCRIPTION AU CANAL MQTT--------------------------
	client.on('connect', function () {
		client.subscribe('ingesupb2/groupe4');
		client.publish('ingesupb2/groupe4', 'Salut, c\'est le serveur node du groupe 4');
	});

//4- --------------------------TRAITEMENT DES INFOS MQTT--------------------------
	client.on('message', function (topic, message) {
		console.log(topic.toString() + " : " + message.toString());

//5- --------------------------VERIFICATION ET TRAITEMENT DES DONNEES AVANT LE PUSH EN BDD--------------------------
		db.collection('sensors', function (err, col) {
			//On cherche à éviter d'enregistrer des valeurs inutiles ou invalides
			//Si il n'y a pas d'erreurs et si la dernière valeur valeur n'est pas similaire à la dernière reçue dans les 9 sec et qu'elle est est correcte
			if (!err && (parseFloat(message.toString())) && (((new Date()) - mqttTimer) >= 9000 
				|| ((correctValueBuffer[topic.toString()]) != message.toString()))) {
				console.log('jai passé le premier if');
				var bufferToUseName;
				if (bufferToUse == true) bufferToUseName = "buffer1";
				else bufferToUseName = "buffer2";

				if(valueBuffer[bufferToUseName][topic.toString()] == undefined)
				 {
					 valueBuffer[bufferToUseName.toString()][topic.toString()] = {"message": 0, "count": 0};
					 valueBuffer[bufferToUseName.toString()][topic.toString()].message = 0;
					 valueBuffer[bufferToUseName.toString()][topic.toString()].count = 0;
					 console.log('jai passé le 2eme if sous buffer ' + bufferToUseName + " " + topic.toString() + ' initialisé');
					 console.log("Voici le contenu de message : " + (valueBuffer[bufferToUseName][topic.toString()]));
				 }
				else if (valueBuffer[bufferToUseName.toString()][topic.toString()] 
					|| valueBuffer[bufferToUseName.toString()][topic.toString()] == 0) {
				console.log('buffer : ' + valueBuffer[bufferToUseName.toString()][topic.toString()].message);
					valueBuffer[bufferToUseName.toString()][topic.toString()].message += (parseFloat(message));
					valueBuffer[bufferToUseName.toString()][topic.toString()].count += 1;

					/*{
						// -TODO : LE PROGRAMME CRASHE ICI : APRES CE COMMENTAIRE AU .message
						"message": valueBuffer[bufferToUseName.toString()][topic.toString()].message + (parseFloat(message)),
						"count": (valueBuffer[bufferToUseName.toString()][topic.toString()].count + 1)
					};*/
					console.log("jai passe le 3eme if compteur de" + topic.toString() + ': ' + valueBuffer[bufferToUseName.toString()][topic.toString()].count);
				}

				if ((new Date()) - globalTimer >= 10000) {
					var actualBuffer = bufferToUseName;
					bufferToUse = !bufferToUse;

					(valueBuffer[actualBuffer][topic.toString()].message =
						(valueBuffer[actualBuffer][topic.toString()].message)
						/ (valueBuffer[actualBuffer][topic.toString()].count)).then(function () {
						for (arrays in valueBuffer[actualBuffer]) {
							col.insert({
								name: arrays.toString(),
								//temperature: parseFloat(message.toString()),  OLD
								temperature: valueBuffer[actualBuffer][arrays].message,
								time: new Date()
							});
						}
					});
					console.log('J\'ai pushé en BDD' + arrays.toString());
				}
				valueBuffer[actualBuffer] = undefined;
				globalTimer = new Date();
				correctValueBuffer[topic.toString()] = message.toString();
				mqttTimer = new Date();
			}

			else
			{
				console.log('Ignored value : probably to much similar data in 9 secs, error : ' + err);
			}
		});

	});


//6- --------------------------W     E       B--------------------------
	// var server = http.createServer(function (request, response) {
	// 	fs.readFile('index.html', 'utf-8', function (err, data) {
	// 		if (err)
	// 			console.log(err);
	// 		response.writeHead(200, {'Content-Type': 'text/html'});
	// 		response.write(data);
	// 		response.end();
	// 	});
	// }).listen(8080);
	var io = require('socket.io').listen(app);
	
	app.listen(4000, '0.0.0.0', err => {
		if (err) throw err;
		console.log('Server listening on :4000');
	});

//7- --------------------------ENVOI DES DONNEES RECENTES--------------------------
	io.sockets.on('connection', function (socket) {
		console.log(socket.request.connection.remoteAddress + " " + socket.id);

		db.collection('sensors').find({"name": "ingesupb2/groupe4"}).sort({"time": -1}).limit(10).toArray().then(
			function (numItems) {
				socket.emit('lastDatas', {datas: numItems.sort({"time": 1})});
				callback(numItems);
		});
	});
});

/**
 * Created by Mathieu Fontenille on 29/04/2016.
 * FEATURES :
 * - MQTT Subscriber
 * - Treat MQTT Datas (anti spam + anti useless data)
 * - Push MQTT Datas into database (security for non-conform datas)
 * - Webserver (anti XSS)
 * - Serve database MQTT datas for clients (JSON object via socket)
 *
 * TODO : - Faire la moyenne des 10 valeurs re�ues en 10 sec et les pusher en BDD juste apr�s
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

//Dans ces buffers nous stockerons les derni�res valeurs affin de les comparer avec les nouvelles et ne pas enregistrer 15 valeurs similaires en BDD dans la minute
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
            //On cherche � �viter d'enregistrer des valeurs inutiles ou invalides
            //Si il n'y a pas d'erreurs et si la derni�re valeur valeur n'est pas similaire � la derni�re re�ue dans les 9 sec et qu'elle est est correcte
            if (!err && (parseFloat(message.toString())) && (((new Date()) - mqttTimer) >= 9000 || ((correctValueBuffer[topic.toString()]) != message.toString()))) {
                var bufferToUseName = "buffer1";
                if (bufferToUse == true) bufferToUseName = "buffer1";
                else bufferToUseName = "buffer2";

                if(valueBuffer[bufferToUseName][topic.toString()] == undefined)
                 {
                     valueBuffer[bufferToUseName.toString()][topic.toString()] = {"message": 0, "count": 0};
                     valueBuffer[bufferToUseName.toString()][topic.toString()].message = 0;
                     valueBuffer[bufferToUseName.toString()][topic.toString()].count = 0;
                     console.log('jai pass� le 2eme if sous buffer ' + bufferToUseName + " " + topic.toString() + ' initialis�');
                 }
                if (valueBuffer[bufferToUseName.toString()][topic.toString()]) {

                    valueBuffer[bufferToUseName.toString()][topic.toString()].message += (parseFloat(message));
                    valueBuffer[bufferToUseName.toString()][topic.toString()].count += 1;
                    console.log('buffer : ' + valueBuffer[bufferToUseName.toString()][topic.toString()].message);
                    console.log("jai passe le 3eme if compteur de" + topic.toString() + ': ' + valueBuffer[bufferToUseName.toString()][topic.toString()].count);
                }

                if ((new Date()) - globalTimer >= 10000) {
                    var actualBuffer = bufferToUseName;
                    bufferToUse = !bufferToUse;
                    console.log('on change de buffer : '+bufferToUseName);

                    (valueBuffer[actualBuffer][topic.toString()].message =
                        ((valueBuffer[actualBuffer][topic.toString()].message)/ (valueBuffer[actualBuffer][topic.toString()].count)));

                    for (arrays in valueBuffer[actualBuffer]) {
                        col.insert({
                            name: arrays.toString(),
                            //temperature: parseFloat(message.toString()),  OLD
                            temperature: parseFloat(valueBuffer[actualBuffer][arrays].message).toFixed(2),
                            time: new Date()
                        });
                        io.sockets.emit('autoUpdate', {datas: {
                            name: arrays.toString(),
                            //temperature: parseFloat(message.toString()),  OLD
                            temperature: parseFloat(valueBuffer[actualBuffer][arrays].message).toFixed(2),
                            time: new Date()
                        }});
                    }
                    console.log('J\'ai push� en BDD');
                    globalTimer = new Date();
                    valueBuffer[actualBuffer]= {};

                }

                correctValueBuffer[topic.toString()] = message.toString();
                mqttTimer = new Date();
            }

            else
            {
                console.log('Ignored message : probably incorrect or to much similar data in 9 secs, error : ' + err);
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

        db.collection('sensors').find({"name": "ingesupb2/groupe4"}).sort({"time": -1}).limit(20).toArray().then(
            function (numItems) {
                socket.emit('lastDatas', {datas: numItems.sort({"time": 1})});
               // callback(numItems);
                return;
            });


    });
});

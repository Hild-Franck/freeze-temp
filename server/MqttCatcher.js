/**
 * Created by Mathieu on 29/04/2016.
 */

/* Client MongoDB */
var mongo = require('mongodb').MongoClient;
var serverMongo = 'mongodb://10.31.3.44:27017/ThermoFridge';
var serverMongoSmartphone = 'mongodb://groupe4:lacalotte@192.168.43.248:27017/ThermoFridge';

/* Web Server */
var fs = require('fs');
var http = require('http');

/* Mqtt subscriber */
var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://messagesight.demos.ibm.com:1883');


mongo.connect(serverMongo, function(err,db){
    if(err){
        console.log("Impossible de se connecter ", err);
    }
    else
        console.log("Connection to database:  OK");


    //Server web
    var server = http.createServer(function(request,response){
        fs.readFile('index.html', 'utf-8', function(err, data)
        {
            console.log(err);
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(data);
            response.end();
        });
    }).listen(8080);
    var io = require('socket.io').listen(server);


    //Mqtt Subscriber
    client.on('connect', function () {
        client.subscribe('ingesupb2/#');
        client.publish('ingesupb2/groupe4', 'Salut, c\'est le serveur node du groupe 4');
    });
    client.on('message', function (topic, message) {
        console.log(topic.toString() + " : " + message.toString());

        db.collection('sensors', function(err, col) {
            if (!err) {
                col.insert({
                    name: topic.toString(),
                    temperature: message.toString(),
                    time: new Date()
                });
            }
            else
                console.log('Unable to insert into database');
            });
    });
});







/*   io.sockets.on('connection', function(socket) {
 socket.on('askForData', function(socket)
 {

 });

 });
 */
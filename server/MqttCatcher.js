/**
 * Created by Mathieu Fontenille on 29/04/2016.
 *
 * TODO : - Faire la moyenne des 10 valeurs reçues en 10 sec et les pusher
 * en BDD juste après
 *
 */

/* Client MongoDB */
var mongo = require('mongodb').MongoClient;
var serverMongo = 'mongodb://10.31.3.44:27017/ThermoFridge';
var serverMongo2 = 'mongodb://groupe4:lacalotte@192.168.43.248:27017/ThermoFridge';

/* Web Server */
var fs = require('fs');
var http = require('http');

/* Mqtt subscriber */
var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://messagesight.demos.ibm.com:1883');

//Dans ce buffer nous stockerons les dernières valeurs affin de les comparer avec les nouvelles et ne pas enregistrer 15 valeurs similaires en BDD dans la minute
var dbBuffer = {};
var timer = new Date();

// On se connecte a notre base de données
mongo.connect(serverMongo, function(err, db){
    if(err){
        console.log("Impossible de se connecter ", err);
    }
    else
        console.log("Connection to database:  OK");
    //Une fois la connexion établie on se connecte au concetrateur MQTT et on s'abonne au canal ingésup
    client.on('connect', function () {
        client.subscribe('ingesupb2/#');
        client.publish('ingesupb2/groupe4', 'Salut, c\'est le serveur node du groupe 4');
    });

    //On récupère toutes les infos de tous les sous cannaux ingésup pour les ranger dans notre MongoDB
    client.on('message', function (topic, message) {
        console.log(topic.toString() + " : " + message.toString());

        db.collection('sensors', function(err, col) {
            //On cherche à éviter d'enregistrer des valeurs inutiles ou invalides
            if (!err && (((new Date()) - timer) >= 9000 || (dbBuffer[topic.toString()] != message.toString()) && parseFloat(message.toString()) )) {
                col.insert({
                    name: topic.toString(),
                    temperature: parseFloat(message.toString()),
                    time: new Date()
                });
                dbBuffer[topic.toString()]= message.toString();
                timer = new Date();
            }
            else
                console.log('Unable to insert into database, probably to much similar data since the last 9 secs');

        });
    });
    
    //Voici le serveur Web qui servira notre appli
    var server = http.createServer(function(request,response){
        fs.readFile('index.html', 'utf-8', function(err, data)
        {
            if (err)
                console.log(err);
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(data);
            response.end();
        });
    }).listen(8080);
    var io = require('socket.io').listen(server);

    //On attends des connexions pour donner les infos des capteurs sockées en base de donnée
    io.sockets.on('connection', function(socket) {
        console.log(socket.request.connection.remoteAddress + " " + socket.id);

        db.collection('sensors').find({"name":"ingesupb2/groupe4"}).sort({"time":-1}).limit(10).toArray().then(
            function(numItems) {
            socket.emit('lastDatas', {datas: numItems});
            callback(numItems);
            });


        });
    });
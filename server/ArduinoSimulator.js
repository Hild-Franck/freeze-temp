/**
 * Created by Mathieu on 04/05/2016.
 * Etant donné que la connexion plante souvent, il sera plus pratique de relancer ce petit serveur
 * plutot que redémarrer l'arduino à chaque fois
 */

var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://messagesight.demos.ibm.com:1883');

client.on('connect', function () {
    client.publish('ingesupb2/groupe4', 'Arduino du groupe 4 connecté');
    setInterval(function() {
                console.log('J\'ai publié une température ' + (new Date()).getHours() + ":" + (new Date()).getMinutes() + " " + (new Date()).getSeconds() + "s");
                client.publish('ingesupb2/groupe4', ((Math.random() * (23 - 21) + 21).toFixed(2)).toString());
    }, 10000);
});


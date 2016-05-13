// var mongo = require('mongodb').MongoClient;
// var serverMongo = 'mongodb://10.31.3.44:27017/ThermoFridge';
// var serverMongoMaison = 'mongodb://192.168.0.27:27017/ThermoFridge';
// var serverMongo2 = 'mongodb://groupe4:lacalotte@192.168.43.248:27017/ThermoFridge';

// mongo.connect(serverMongo, function (err, db) {
//   db.collection('sensors').find({"name": "ingesupb2/groupe4"}).sort({"time": -1}).limit(10).toArray()
//     .then(function (numItems) {
//       res.json({datas: numItems.sort({"time": 1})});
// 		});
// });
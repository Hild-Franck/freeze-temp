/**
 * Created by Knarfux on 10/05/2016.
 */

myApp.factory('dataHandler', ['socket', function(socket){
    var data = {};

    socket.on('connect', function(){
        console.log('Connected to server');
    });

    socket.on('askData', function(serverData){
        console.log(serverData);
        for(var value in serverData){
            var dataToProcess = serverData[value];
            if(data[dataToProcess.name] === undefined)
                data[dataToProcess.name] = {};
            else
                data[dataToProcess.name] = [dataToProcess.time, dataToProcess.temp]
        }
    });

    return {
        getData: function(){
            return data;
        },
        resetData: function(){
            data = {};
        },
        addData: function(index, data){
            data[index].push(data);
        },
        setData: function(index, data){
            data[index] = data;
        }
    }
}]);
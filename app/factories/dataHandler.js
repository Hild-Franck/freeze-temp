/**
 * Created by Knarfux on 10/05/2016.
 */

myApp.factory('dataHandler', ['socket', function(socket){

    /**
     * @var data
     * @type {{labels: Array, data: Array, series: Array}}
     * Local temp data
     */
    var data = {
        labels: [],
        data: [],
        series: []
    };

    function processData(tempData){
        var index;

        for(var value in tempData.datas){
            var dataToProcess = tempData.datas.name === undefined ? tempData.datas[value] : tempData.datas;

            // Manage chart labels
            console.log(dataToProcess);
            if(dataToProcess.time != data.labels[data.labels.length - 1])
                data.labels.push(dataToProcess.time);

            // Manage chart series
            index = data.series.indexOf(dataToProcess.name);

            if(index == -1) {
                index = data.series.length;
                data.series.push(dataToProcess.name);
                data.data[index] = [];
            }

            // Manage chart data
            data.data[index].push(dataToProcess.temperature);

            if(data.data[index].length >= 30){
                data.data[index].splice(0, 1);
                if(data.labels.length >= 30)
                    data.labels.splice(0,1)
            }
        }
    }

    /**
     * @event connect
     * Warn user that client is connected to server
     */

    socket.on('connect', function(){
        console.log('Connected to server');
    });

    /**
     * @event lastDatas
     * Get data from server and put them in local data array
     */

    socket.on('autoUpdate', function(serverData){
        processData(serverData);
    });

    socket.on('lastDatas', function(serverData){
        processData(serverData);
    });

    /**
     * @return Object
     * Return get/set and managing methods to data
     */
    return {
        getData: function(){
            return data;
        },
        getTemp: function(grp){
            var index = data.series.indexOf(grp);
            if(index == -1){
                console.log("No such group exist, sorry !");
                return undefined;
            }

            return data.data[index];
        },
        resetData: function(){
            data = {};
        },
        resetTemp: function(grp){
            var index = data.series.indexOf(grp);
            if(index == -1){
                console.log("No such group exist, sorry !");
            }
            else
                data.data[index] = [];
        },
        addData: function(grp, temp){
            var index = data.series.indexOf(grp);
            if(index == -1){
                console.log("No such group exist, sorry !");
            }
            else
                data.data[grp].push(temp);
        },
        setData: function(grp, data){
            var index = data.series.indexOf(grp);
            if(index == -1){
                console.log("No such group exist, sorry !");
            }
            else
                data.data[grp] = data;
        }
    }
}]);
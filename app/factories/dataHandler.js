/**
 * Created by Knarfux on 10/05/2016.
 */

myApp.factory('dataHandler', ['socket', function(socket){

    /**
     * @var data
     * @type {{labels: {}, data: Array, series: {}}}
     * Local temp data
     */
    var data = {
        labels: {},
        data: [],
        series: []
    };

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

    socket.on('lastDatas', function(serverData){
        console.log(serverData.datas);
        var index;

        for(var value in serverData.datas){
            var dataToProcess = serverData.datas[value];

            // Manage chart labels
            if(dataToProcess.time != data.labels[data.labels.length - 1])
                data.labels.push(dataToProcess.time);

            // Manage chart series
            index = data.series.indexOf(dataToProcess.name);

            if(index == -1) {
                index = data.series.length;
                data.series.push(dataToProcess.name)
            }

            // Manage chart data
            data.data[index].push(dataToProcess.temperature);
        }
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
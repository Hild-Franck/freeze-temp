appControllers.controller('charts', ['$scope', '$http', '$interval', 'dataHandler', function ($scope, $http, $interval, dataHandler)
{
    $scope.labels = dataHandler.getData().labels;
    $scope.series = ["capteur1"];
    $scope.data = [dataHandler.getData().temp["capteur1"]];

    console.log($scope.labels, $scope.series, $scope.data);


    $scope.checkbox = function (sensorName, etat)
    {
        if (!etat)
        {
            removeSensor(sensorName);
        }

        else
        {
            var thenum = sensorName.replace( /^\D+/g, '');
            console.log(thenum);
            addSensor(sensorName);
        }
    };


    function addSensor(serieName, dataSensor)
    {
        addSerie(serieName);
        addData(dataSensor);
    }

    function removeSensor(serieName)
    {
        var index = $scope.series.indexOf(serieName);
        removeData(index);
        //removeSerie(index);
        console.log($scope.data);
    }


    function addSerie(serieName)
    {
        $scope.series.push(serieName);
    }

    function removeSerie(index)
    {
        $scope.series.splice(index, 1);
    }
}]);
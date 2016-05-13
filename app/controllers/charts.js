appControllers.controller('charts', ['$scope', '$http', 'dataHandler', function ($scope, $http, dataHandler)
{
    $scope.labels = dataHandler.getData().labels;
    $scope.series = dataHandler.getData().series;
    $scope.data = dataHandler.getData().data;

    /*
    addSensor("Capteur 1", capteur1);
    addSensor("Capteur 2", capteur2);
*/

    $scope.checkbox = function (sensorName, etat)
    {
        if (!etat)
        {
            removeSensor(sensorName);
        }

        else
        {
            var thenum = sensorName.replace( /^\D+/g, '');
            thenum--;
            //addSensor(sensorName, allSensors[thenum]);
            displaySensor(sensorName);
        }
    };


    function addSensor(serieName, dataSensor)
    {
        addSerie(serieName);
        addData(dataSensor);  
    };
    
    function removeSensor(serieName)
    {
        var index = $scope.series.indexOf(serieName);
        removeData(index);
        //removeSerie(index);
    };

    function displaySensor(serieName)
    {
        var index = $scope.series.indexOf(serieName);
        console.log(index);
        $scope.data[index] = allSensors[index];
        console.log(allSensors);
        console.log($scope.data);
    };


    function addSerie(serieName)
    {
        $scope.series.push(serieName);
    };

    function addData(dataSensor)
    {
        $scope.data.push(dataSensor);
    };

    function removeSerie(index)
    {
        $scope.series.splice(index, 1);
    };

    function removeData(index)
    {
        $scope.data.splice(index, 1);
    };


}]);
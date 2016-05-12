appControllers.controller('charts', ['$scope', '$http', function ($scope, $http)
{
    function getRandomInt(min, max)
    {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    var heures = [];
    var allSensors = []
    var capteur1 = [];
    var capteur2 = [];
    allSensors.push(capteur1, capteur2);

    for (var i = 0; i < 24; i++)
    {
        heures.push(i+"h");
        capteur1.push(getRandomInt(0, 20));
        capteur2.push(getRandomInt(0, 20));
    }

    $scope.labels = heures;
    $scope.series = [];
    $scope.data = [];

    addSensor("Capteur 1", capteur1);
    addSensor("Capteur 2", capteur2);


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
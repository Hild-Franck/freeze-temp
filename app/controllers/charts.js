appControllers.controller('charts', ['$scope', '$http', function ($scope, $http)
{
    function getRandomInt(min, max)
    {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    var heures = [];
    var capteur1 = [];
    var capteur2 = [];

    for (var i = 0; i < 24; i++)
    {
        heures.push(i+"h");
        capteur1.push(getRandomInt(0, 20));
        capteur2.push(getRandomInt(0, 20));
    }

    $scope.labels = heures;
    $scope.series = ['Capteur 1', 'Capteur 2'];
    $scope.data = [
        capteur1,
       capteur2
    ];
}]);
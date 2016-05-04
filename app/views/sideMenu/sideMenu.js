/**
 * Created by Knarfux on 04/05/2016.
 */
angular.module('includeExample', ['ngAnimate'])
    .controller('ExampleController', ['$scope', function($scope) {
        $scope.templates =
            [ { name: 'sideMenu.html', url: 'views/sideMenu/sideMenu.html'}
               ];
        $scope.template = $scope.templates[0];
    }]);
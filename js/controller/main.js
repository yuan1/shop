angular.module('mainModule', []).controller('mainCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $rootScope.main = true;
    $scope.word='';
    $scope.search=function () {
        if($scope.word===''){
            return;
        }
        location.href='#!/search/'+$scope.word
    }
}]);
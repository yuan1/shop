angular.module('searchModule', []).controller('searchCtrl', ['$scope', '$rootScope', '$http', '$routeParams', function ($scope, $rootScope, $http, $routeParams) {
    $rootScope.main = false;
    $rootScope.active = 12;
    $scope.shops = [];
    $scope.page = 1;
    loadShops();
    $scope.pageNext = function () {
        $scope.page++;
        loadShops();
    };
    function loadShops() {
        $http({
            url: 'api/checkWhole',
            method: 'GET',
            params: {
                appkey: $rootScope.appkey,
                k: $routeParams.word,
                page: $scope.page
            }
        }).then(function (res) {
            //为实现继续加载所以循环遍历push进去
            for (var i = 0; i < res.data.data.data.length; i++) {
                $scope.shops.push(res.data.data.data[i]);
            }
        })
    }
}]);
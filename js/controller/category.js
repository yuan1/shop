angular.module('categoryModule', []).controller('categoryCtrl', ['$scope', '$rootScope', '$http', '$routeParams',function ($scope, $rootScope, $http, $routeParams) {
    $rootScope.main = false;
    $rootScope.active = $routeParams.id;
    $scope.shops = [];
    $scope.page = 1;
    loadShops();
    $scope.pageNext = function () {
        $scope.page++;
        loadShops();
    };

    //加载商品信息
    function loadShops() {
        $http({
            url: 'api/getGoodsLink',
            method: 'GET',
            params: {
                appkey: $rootScope.appkey,
                type: 'classify',
                cid: $routeParams.id,
                page: $scope.page
            }
        }).then(function (res) {
            //为实现继续加载所以循环遍历push进去
            for (var i = 0; i < res.data.data.length; i++) {
                res.data.data[i].type=checkType(res.data.data[i]);
                $scope.shops.push(res.data.data[i]);
            }

        })
    }
    function checkType(shop) {
        var type='淘宝';
        if(shop.src==='1'){
            type='天猫';
        }
        if(shop.jhs==='1'){
            type='聚划算';
        }
        if(shop.tqg==='1'){
            type='淘抢购';
        }
        return type;
    }
}]);
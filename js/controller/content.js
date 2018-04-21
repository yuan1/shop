angular.module('contentModule', []).controller('contentCtrl', ['$scope', '$rootScope', '$http', '$routeParams', function ($scope, $rootScope, $http, $routeParams) {
    $rootScope.main = false;
    var id = $routeParams.id;
    $scope.shopTops = [];
    $scope.shop = {};
    //获取商品信息
    $http({
        url: 'api/getGoodInfo',
        method: 'GET',
        params: {
            appkey: $rootScope.appkey,
            id: id
        }
    }).then(function (res) {
        res.data.data.type = checkType(res.data.data);
        $scope.shop = res.data.data;
        //记录浏览记录
        saveLog(res.data.data)
    });
    //获取top100
    $http({
        url: 'api/getGoodsLink',
        method: 'GET',
        params: {
            appkey: $rootScope.appkey,
            type: 'top100'
        }
    }).then(function (res) {
        for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].type = checkType(res.data.data[i]);
            $scope.shopTops.push(res.data.data[i]);
        }
    });

    function checkType(shop) {
        var type = '淘宝';
        if (shop.tmall === '1') {
            type = '天猫';
        }
        if (shop.src === '1') {
            type = '天猫';
        }
        if (shop.jhs === '1') {
            type = '聚划算';
        }
        if (shop.tqg === '1') {
            type = '淘抢购';
        }
        return type;
    }

    function saveLog(shop) {
        //保存浏览记录
        //判断是否登录
        if ($rootScope.user.login) {
            //判断是否已经存在
            $http({
                url: 'rest/dynamic',
                method: 'POST',
                data: {
                    query: 'select count(*) as count from coupon_log where userId=? and couponId=? ',
                    params: [$rootScope.user.data.id, shop.id]
                }
            }).then(function (res) {
                if (res.data[0].count === 0) {
                    //保存操作
                    $http({
                        url: 'rest/api/coupon_log',
                        method: 'POST',
                        data: {
                            couponUrl: shop.quan_link,
                            couponId: shop.id,
                            couponTitle: shop.goods_name,
                            couponType: shop.type,
                            couponPrice: shop.price,
                            couponPriceAfter: shop.price_after_coupons,
                            couponCount: shop.quan_zong,
                            couponSales: shop.sales,
                            couponDate: shop.quan_expired_time,
                            timestamp: new Date(),
                            userId: $rootScope.user.data.id
                        }
                    }).then(function (res) {
                        console.log(res.data);
                    });
                }
            });

        }
    }


}]);
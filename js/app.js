var shopApp = angular.module('shopApp', ['ngRoute', 'categoryModule', 'contentModule', 'mainModule', 'searchModule', 'loginModule', 'registerModule', 'userModule']);
shopApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/category/:id', {templateUrl: 'tpls/category.html'})
        .when('/content/:id', {templateUrl: 'tpls/content.html'})
        .when('/main', {templateUrl: 'tpls/main.html'})
        .when('/login', {templateUrl: 'tpls/login.html'})
        .when('/register', {templateUrl: 'tpls/register.html'})
        .when('/user', {templateUrl: 'tpls/user.html'})
        .when('/search/:word', {templateUrl: 'tpls/search.html'})
        .otherwise({redirectTo: '/main'});
}]);
shopApp.run(function ($rootScope, $http) {
    $rootScope.mobile = false;
    var browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1,//火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') === -1, //是否web应该程序，没有头部与底部
                weixin: u.indexOf('MicroMessenger') > -1, //是否微信
                qq: u.match(/\sQQ/i) === " qq" //是否QQ
            };
        }()
    };
    //判断是否移动端
    if (browser.versions.mobile || browser.versions.android
        || browser.versions.ios || browser.versions.iPhone
        || browser.versions.iPad || browser.versions.weixin
        || browser.versions.qq) {
        $rootScope.mobile = true;
    }
    $rootScope.user = {
        login: false,
        data: {}
    };
    if(sessionStorage.getItem('user')){
        //转换为JSON对象后设置
        $rootScope.user.data=JSON.parse(sessionStorage.getItem('user'));
        $rootScope.user.login=true;
    }
    $rootScope.classList = [{
        "id": "1",
        "classname": "女装"
    }, {
        "id": "2",
        "classname": "男装"
    }, {
        "id": "3",
        "classname": "内衣"
    }, {
        "id": "4",
        "classname": "母婴"
    }, {
        "id": "5",
        "classname": "美妆"
    }, {
        "id": "6",
        "classname": "居家"
    }, {
        "id": "7",
        "classname": "鞋包配饰"
    }, {
        "id": "8",
        "classname": "美食"
    }, {
        "id": "9",
        "classname": "文体车品"
    }, {
        "id": "10",
        "classname": "数码家电"
    }, {
        "id": "11",
        "classname": "运动户外"
    }, {
        "id": "12",
        "classname": "其他"
    }];
    $rootScope.main = false;
    $rootScope.notice = '';
    $rootScope.appkey = 'e6c51a2c806eb04c8db949602cdd4898';
    //从数据库中获取系统信息
    $http({
        url: 'rest/api/system',
        method: 'GET',
        params: {
            id: 1
        }
    }).then(function (res) {
        var system = res.data[0];
        $rootScope.notice = system.notice;
        $rootScope.appkey = system.appkey;
    });
});
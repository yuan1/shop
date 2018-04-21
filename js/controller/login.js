angular.module('loginModule', []).controller('loginCtrl', ['$scope', '$rootScope', '$http', '$routeParams', function ($scope, $rootScope, $http, $routeParams) {
    $rootScope.main = false;
    $rootScope.user.login = false;
    $rootScope.user.data = {};
    $scope.code = GetRandomCode(4);
    //清楚session中的数据
    sessionStorage.removeItem('user');

    $scope.errorCode = false;
    $scope.errorLogin = false;
    $scope.successLogin = false;

    $scope.user = {
        username: '',
        password: '',
        code: ''
    };
    $scope.login = function () {
        if ($scope.user.username && $scope.user.password && $scope.user.code) {
            if ($scope.user.code === $scope.code) {

                $scope.errorCode = false;
                $http({
                    url: 'rest/dynamic',
                    method: 'POST',
                    data: {
                        query: 'select * from user where username=? and password=? ',
                        params: [$scope.user.username, $scope.user.password]
                    }
                }).then(function (res) {
                    var result;
                    result = res.data;
                    if (result.length > 0) {
                        $scope.errorLogin = false;
                        $rootScope.user.login = true;
                        $rootScope.user.data = result[0];
                        $scope.successLogin = true;
                        //转换为json String 后存储 刷新页面后不丢失
                        sessionStorage.setItem('user',JSON.stringify(result[0]));

                        setTimeout(function () {
                            location.href = '#!/main';
                        }, 1000)
                    } else {
                        $rootScope.user.login = false;
                        $scope.errorLogin = true;
                        $scope.successLogin = false;
                    }

                })
            } else {
                //显示验证码不一致提示
                $scope.errorCode = true;
            }

        }
        return false;
    };

    /**n表示生成随机码的位数
     * @return {string}
     */
    function GetRandomCode(n) {
        chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        var res = "";
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * 35);
            res += chars[id];
        }
        return res;
    }
}]);
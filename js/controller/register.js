angular.module('registerModule', []).controller('registerCtrl', ['$scope', '$rootScope', '$http', '$routeParams', function ($scope, $rootScope, $http, $routeParams) {
    $rootScope.main = false;
    $scope.code = GetRandomCode(4);

    $scope.errorPassword = false;
    $scope.errorCode = false;
    $scope.successRegister = false;
    $scope.errorRegister = false;

    $scope.user = {
        username: '',
        password: '',
        repeatPassword: '',
        code: ''
    };
    $scope.register = function () {
        if ($scope.user.username && $scope.user.password && $scope.user.repeatPassword && $scope.user.code) {
            //判断两次输入密码是否一致
            if ($scope.user.password === $scope.user.repeatPassword) {
                //是否显示密码不一致提示框
                $scope.errorPassword = false;
                if ($scope.user.code === $scope.code) {
                    //是否显示验证码不一致提示
                    $scope.errorCode = false;
                    $http({
                        url: 'rest/dynamic',
                        method: 'POST',
                        data: {
                            query: 'select count(*) as count from user where username=? ',
                            params: [$scope.user.username]
                        }
                    }).then(function (res) {
                        if (res.data[0].count === 0) {
                            $http({
                                url: 'rest/api/user',
                                method: 'POST',
                                data: {
                                    username: $scope.user.username,
                                    password: $scope.user.password
                                }
                            }).then(function (res) {
                                if (res.data.protocol41) {
                                    $scope.errorRegister = false;
                                    $scope.successRegister = true;
                                    setTimeout(function () {
                                        location.href = '#!/login';
                                    }, 1000)
                                } else {
                                    $scope.errorRegister = true;
                                    $scope.successRegister = false;
                                }
                            })
                        }else {
                            $scope.errorRegister = true;
                        }
                    });


                } else {
                    $scope.errorCode = true;
                }

            } else {
                $scope.errorPassword = true;
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
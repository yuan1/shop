angular.module('userModule', []).controller('userCtrl', ['$scope', '$rootScope', '$http', '$routeParams', function ($scope, $rootScope, $http, $routeParams) {
    $rootScope.main = false;
    //用户信息
    $scope.user = $rootScope.user.data;

    $scope.successSave = false;
    $scope.errorSave = false;

    $scope.errorPassword = false;
    $scope.errorRePassword = false;
    $scope.successSaveRePassword = false;
    $scope.errorSaveRePassword = false;
    $scope.passwordUser = {};
    //日志
    $scope.couponLogs = [];
    //验证码
    $scope.code = GetRandomCode(4);
    //加载日志
    loadLogs();
    //保存操作
    $scope.save = function () {
        $http({
            url: 'rest/dynamic',
            method: 'POST',
            data: {
                query: 'update user set nickName=?, sex=?, birthDay=?, age=?, email=? where id = ?',
                params: [$scope.user.nickName,$scope.user.sex, $scope.user.birthDay,$scope.user.age,$scope.user.email,$scope.user.id]
            }
        }).then(function (res) {
            if (res.data.protocol41) {
                $scope.successSave = true;
                $scope.errorSave = false;
                $rootScope.user.data = $scope.user;
                //转换为json String 后存储 刷新页面后不丢失
                sessionStorage.setItem('user', JSON.stringify($scope.user));
            } else {
                $scope.successSave = false;
                $scope.errorSave = true;
            }
        })
    };
    //修改密码操作
    $scope.rePassword = function () {

        if ($scope.passwordUser.old && $scope.passwordUser.password && $scope.passwordUser.repeat) {
            //判断两次输入密码是否一致
            if ($scope.passwordUser.password === $scope.passwordUser.repeat) {
                //是否显示密码不一致提示框
                $scope.errorRePassword = false;
                $http({
                    url: 'rest/dynamic',
                    method: 'POST',
                    data: {
                        query: 'select * from user where id=? and password=? ',
                        params: [$scope.user.id, $scope.passwordUser.old]
                    }
                }).then(function (res) {
                    if (res.data.length !== 0) {
                        $scope.errorPassword = false;
                        $http({
                            url: 'rest/dynamic',
                            method: 'POST',
                            data: {
                                query: 'update user set password = ? where id = ?',
                                params: [$scope.passwordUser.password, $scope.user.id]
                            }
                        }).then(function (res) {
                            if (res.data.protocol41) {
                                $scope.successSaveRePassword = true;
                                $scope.errorSaveRePassword = false;
                            } else {
                                $scope.successSaveRePassword = false;
                                $scope.errorSaveRePassword = true;
                            }
                        })
                    } else {
                        $scope.errorPassword = true;
                    }

                });
            } else {
                $scope.errorRePassword = true;
            }
        }
    };

    //获取浏览记录
    function loadLogs() {
        $http({
            url: 'rest/dynamic',
            method: 'POST',
            data: {
                query: 'select * from coupon_log where userId=? ',
                params: [$scope.user.id]
            }
        }).then(function (res) {
            $scope.couponLogs = res.data;
        });
    }

    //删除记录
    $scope.delete = function (id) {
        $http({
            url: 'rest/api/coupon_log/' + id,
            method: 'DELETE'
        }).then(function (res) {
            if (res.data.protocol41) {
                loadLogs();
            }
        })
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
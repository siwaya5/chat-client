app.controller('loginController', loginController);
loginController.$inject = ['$scope', 'loginService', 'appConstant', 'utilServices', '$location', 'profileService', 'groupChatService'];
function loginController($scope, loginService, appConstant, utilServices, $location, profileService, groupChatService) {
    var gestionCtrl = this;
    gestionCtrl.sing = {};
    gestionCtrl.log = {};

    gestionCtrl.StatusUser = localStorage.usuario ? true : false;
    if (localStorage.usuario !== undefined && localStorage.usuario !== "") {
        gestionCtrl.user = JSON.parse(localStorage.usuario);
    }

    $('#myModal').css({"padding-top": $(window).height() / 5});
    $('#myModalLogin').css({"padding-top": $(window).height() / 5});

    var socket = utilServices.SOCKET_SERVER;

    gestionCtrl.onSingUp = function () {

        if (!$scope.singForm.$valid) {

            if (!$scope.singForm.inputUsername.$valid) {
                appConstant.SHOW_MSG_WARNING("You need to complete username text");
            }
            if (!$scope.singForm.inputPassword.$valid) {
                appConstant.SHOW_MSG_WARNING("You need to complete password text");
            }
            if (!$scope.singForm.inputFullName.$valid) {
                appConstant.SHOW_MSG_WARNING("You need to complete full name text");
            }
            return;
        }

        socket.emit('signUp', gestionCtrl.sing);
    };

    gestionCtrl.onSingIn = function () {
        if (!$scope.singInForm.$valid) {
            appConstant.SHOW_MSG_WARNING("You need to complete form");
            return;
        }
        socket.emit('signIn', gestionCtrl.log);

    };

    socket.on('signUpResponse', function (data) {
        if (!data.success) {
            appConstant.SHOW_MSG_WARNING(data.message);
            return;
        }
        appConstant.SHOW_MSG_SUCCESS(data.message);
        $('#myModal').modal('hide');
        $scope.$digest();
    });

    socket.on('signInResponse', function (data) {
        if (data.success) {
            localStorage.usuario = JSON.stringify(data.data);
            gestionCtrl.StatusUser = true;
            $location.path('/');
            $scope.$digest();

            profileService.getProfilePicture(data.data._id).then(function (data) {
                localStorage.photo = JSON.stringify(data);
                $scope.$digest();
            }).catch(function (e) {
                return;
            });

        } else
            appConstant.SHOW_MSG_WARNING(data.message);
    });

    gestionCtrl.logOut = function () {
        gestionCtrl.user = JSON.parse(localStorage.usuario);
        var json = {id: gestionCtrl.user._id};

        gestionCtrl.sing = {};
        gestionCtrl.log = {};
        $location.path("/");
        gestionCtrl.StatusUser = false;
        localStorage.usuario = "";
    };

    gestionCtrl.findGroupChatByAccountId = function (id, groupResponse) {
        gestionCtrl.listGroup = [];
        groupChatService.findGroupChatByAccountId(id).then(function (data) {
            gestionCtrl.listGroup = data;

            var a = gestionCtrl.listGroup.filter(function (elem) {
                if (elem.groupId === groupResponse.objectIdGroup) {
                    groupResponse.username === gestionCtrl.user.username ? '' : appConstant.SHOW_MSG_INFO("New Message Group from: " + elem.groupName);
                }
            }).length > 0;

            $scope.$digest();
        }).catch(function (e) {
            return;
        });
    };

    socket.on('chatMessageResponse', function (data) {
        if (localStorage.usuario !== undefined && localStorage.usuario !== "") {
            data.data.usernameReceiver === JSON.parse(localStorage.usuario).username ? appConstant.SHOW_MSG_INFO("New Message from: " + data.data.username) : '';
            $scope.$digest();
        }
    });

    socket.on('sendGroupMessageResponse', function (data) {
        if (localStorage.usuario !== undefined && localStorage.usuario !== "") {
            gestionCtrl.findGroupChatByAccountId(JSON.parse(localStorage.usuario)._id, data.data);
        }
    });
}
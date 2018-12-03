app.controller('loginController', loginController);
loginController.$inject = ['$scope', 'loginService', 'appGenericConstant', 'appConstant', 'utilServices', '$location', 'profileService'];
function loginController($scope, loginService, appGenericConstant, appConstant, utilServices, $location, profileService) {
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
        socket.emit('signIn', gestionCtrl.log);
    };

    socket.on('signUpResponse', function (data) {
        if (!data.success) {
            appConstant.SHOW_MSG_WARNING(data.message);
			return
        }
		appConstant.SHOW_MSG_SUCCESS(data.message);
		$('#myModal').modal('hide')
		$scope.$digest();
    });

    socket.on('signInResponse', function (data) {
        if (data.success) {
            localStorage.usuario = JSON.stringify(data.data);
            gestionCtrl.StatusUser = true;
            $location.path('/');
            $scope.$digest();

            profileService.getProfilePicture(data.data._id).then(function (data) {
                localStorage.photo = JSON.stringify(data);;
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


}
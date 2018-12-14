angular.module('app').controller('profileController', profileController);
profileController.$inject = ['utilServices', 'appGenericConstant', '$location', '$scope'];
function profileController(utilServices, appGenericConstant, $location, $scope) {
    var gestionCtrl = this;
    var socket = utilServices.SOCKET_SERVER;

    if (localStorage.usuario !== undefined) {
        gestionCtrl.profile = JSON.parse(localStorage.usuario);
//        gestionCtrl.profile.photo = JSON.parse(localStorage.photo);
    }

    function init() {
        var height = $(window).height();
        var width = $(window).width();

        $('.content').css({"height": height});
        $('html').css({"max-height": height});
        $('#cardBodyPerfil').css({"height": height - 62});
    }


    socket.on('uploadFileResponse', function (data) {
        location.reload();
        $scope.$digest();
    });

    init();

}
angular.module('app').controller('infinitoController', infinitoController);
infinitoController.$inject = ['$scope', '$compile', '$http', 'utilServices', 'infinitoService'];
function infinitoController($scope, $compile, $http, utilServices, infinitoService) {
    var gestionCtrl = this;
    var socket = utilServices.SOCKET_SERVER;

    gestionCtrl.init = function () {
        var altura = $(window).height();
        var ancho = $(window).width();
        gestionCtrl.user = JSON.parse(localStorage.usuario);
        gestionCtrl.message = "";
        $('.content').css({"height": altura});
        $('html').css({"max-height": altura});
//        $('html').css({"max-width": ancho});

        $('#cardBodyInfinito').css({"height": altura - 62});
        $('#cardBodyInfinito').css({"max-height": altura - 62});

        $('.cardBodyChat').css({"height": altura - 163});
        $('#cardBodyChat2').css({"height": altura - 163});
        $('#cardBodyChat2').css({"max-height": altura - 163});

        $('#cardBodyInfinito').css({"display": "initial"});
        $('.cardBodyChat').css({"display": "none"});

        $('.speech-wrapper').css({"height": altura - 170});
        $('.speech-wrapper').css({"max-height": altura - 170});

//        $('#divMessage').css({"top": altura - 660});

        $("div").removeClass("modal-backdrop in");
    };

    gestionCtrl.changeToChat = function (item) {
        var json = {
            usernameOne: gestionCtrl.user.username,
            usernameTwo: item.username,
            time: Date()
        };
		
		gestionCtrl.message = "";
		if(item.username !== null && item.username !== undefined){
			gestionCtrl.jsonCopy = json; 
			socket.emit('createChat', gestionCtrl.jsonCopy);
		}else{
			socket.emit('createChat', gestionCtrl.jsonCopy);
		}
		
        $('#cardBodyInfinito').css({"display": "none"});
        $('.cardBodyChat').css({"display": "initial"});
    };

    $(window).resize(function () {
//        var parent = document.getElementById('spech');
//        var parent_width = parent.clientWidth / 2;
//        $('.bubble.alt').css({"margin-left": parent_width});
    });

    gestionCtrl.changeToListOfUsers = function () {
        $('#cardBodyInfinito').css({"display": "initial"});
        $('.cardBodyChat').css({"display": "none"});
    };

    gestionCtrl.findAllUsers = function () {
        gestionCtrl.listUsers = [];
        infinitoService.findAllUsers().then(function (data) {
            gestionCtrl.listUsers = data;
        }).catch(function (e) {
            return;
        });
    };

    socket.on('chatResponse', function (data) {
        if (data) {
            gestionCtrl.chat = data;
            gestionCtrl.findChatMessages(gestionCtrl.chat._id);
        }else{
			gestionCtrl.changeToChat(gestionCtrl.jsonCopy);
		}
    });

    gestionCtrl.findChatMessages = function (id) {
        gestionCtrl.listOfMessages = [];
        var chatbox = document.getElementById('chatbox');
        chatbox.innerHTML = "";
        infinitoService.findChatMessages(id).then(function (data) {
            if (data === null) {
                return;
            }

            angular.forEach(data, function (value) {
                value.divGlobalStyle = value.objectIdAccount === gestionCtrl.user._id ? 'bubble alt' : 'bubble';
                value.divBubblelStyle = value.objectIdAccount === gestionCtrl.user._id ? 'bubble-arrow alt' : 'bubble-arrow';
                var date = new Date(value.time);
                value.time = date.getHours() + ":" + date.getMinutes();

                gestionCtrl.listOfMessages.push(value);
            });

            var parent = document.getElementById('spech');
            var parent_width = parent.clientWidth / 2;
            $('.bubble.alt').css({"margin-left": parent_width});
            scrollBodyChat();

        }).catch(function (e) {
            return;
        });
    };

	gestionCtrl.onPresionarEnter = function (tecla) {
        if (tecla.keyCode === 13) {
            gestionCtrl.sendMessage();
        }
    };
	
    gestionCtrl.sendMessage = function () {
        var json = {
            objectIdChat: gestionCtrl.chat._id,
            objectIdAccount: gestionCtrl.user._id,
            username: gestionCtrl.user.username,
            message: gestionCtrl.message
        };
        socket.emit('sendMessage', json);
        gestionCtrl.message = "";
    };

    socket.on('chatMessageResponse', function (data) {
        refreshChat(data.data);
    });

    function refreshChat(data) {
        data.divGlobalStyle = data.objectIdAccount === gestionCtrl.user._id ? 'bubble alt' : 'bubble';
        data.divBubblelStyle = data.objectIdAccount === gestionCtrl.user._id ? 'bubble-arrow alt' : 'bubble-arrow';
        var date = new Date(data.time);
        data.time = date.getHours() + ":" + date.getMinutes();

        var chatbox = document.getElementById('chatbox');
        var bubble = '<div class="' + data.divGlobalStyle + '">' +
                '<div class="txt">' +
                '<p class="name">' + data.username + '</p>' +
                '<p class="message">' + data.message + '</p>' +
                '<span class="timestamp">' + data.time + '</span>' +
                '</div>' +
                '<div class="' + data.divBubblelStyle + '"></div>' +
                '</div>';

        if (data.objectIdChat === gestionCtrl.chat._id) {
            chatbox.innerHTML += bubble;
        }

        scrollBodyChat();
        $scope.$digest();
    }

    function scrollBodyChat() {
        $(function () {
            var div = $('#spech');
            var height = div[0].scrollHeight;
            div.scrollTop(height);
        });
    }

    function buildInformatioBubble() {

    }

    gestionCtrl.init();
    gestionCtrl.findAllUsers();

}
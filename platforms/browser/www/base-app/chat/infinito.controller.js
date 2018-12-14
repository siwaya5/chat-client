angular.module('app').controller('infinitoController', infinitoController);
infinitoController.$inject = ['$scope', '$compile', '$http', 'utilServices', 'infinitoService', 'appConstant'];
function infinitoController($scope, $compile, $http, utilServices, infinitoService, appConstant) {
    var gestionCtrl = this;
    var socket = utilServices.SOCKET_SERVER;

    gestionCtrl.init = function () {
        var height = $(window).height();
        gestionCtrl.user = JSON.parse(localStorage.usuario);
        gestionCtrl.message = "";
        $('.content').css({"height": height});
        $('html').css({"max-height": height});

        $('#cardBodyInfinito').css({"height": height - 62});
        $('#cardBodyInfinito').css({"max-height": height - 62});

        $('.cardBodyChat').css({"height": height - 163});
        $('#cardBodyChat2').css({"height": height - 163});
        $('#cardBodyChat2').css({"max-height": height - 163});

        $('#cardBodyInfinito').css({"display": "initial"});
        $('.cardBodyChat').css({"display": "none"});

        $('.speech-wrapper').css({"height": height - 170});
        $('.speech-wrapper').css({"max-height": height - 170});

        $("div").removeClass("modal-backdrop in");
    };

    gestionCtrl.changeToChat = function (item) {

        gestionCtrl.message = "";
        gestionCtrl.userToChat = item;
        if (item.username !== undefined && item.username !== null) {
            var json = {
                usernameOne: gestionCtrl.user.username,
                usernameTwo: gestionCtrl.userToChat.username,
                time: Date()
            };
            socket.emit('createChat', json);
        }
    };

    gestionCtrl.changeToListOfUsers = function () {
        $('#cardBodyInfinito').css({"display": "initial"});
        $('.cardBodyChat').css({"display": "none"});
        gestionCtrl.chat = "";
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
            $('#cardBodyInfinito').css({"display": "none"});
            $('.cardBodyChat').css({"display": "initial"});
            gestionCtrl.chat = data;
            gestionCtrl.findChatMessages(gestionCtrl.chat._id);
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

            scrollBodyChat();

        }).catch(function (e) {
            return;
        });
    };

    gestionCtrl.onKeyEnter = function (key) {
        if (key.keyCode === 13) {
            gestionCtrl.sendMessage();
        }
    };

    gestionCtrl.sendMessage = function () {
        var json = {
            objectIdChat: gestionCtrl.chat._id,
            objectIdAccount: gestionCtrl.user._id,
            username: gestionCtrl.user.username,
            usernameReceiver: gestionCtrl.userToChat.username,
            message: gestionCtrl.message
        };
        socket.emit('sendMessage', json);
        gestionCtrl.message = "";
    };

    socket.on('chatMessageResponse', function (data) {
        refreshChat(data.data);
    });

    function refreshChat(data) {

        if (gestionCtrl.chat === undefined || gestionCtrl.chat === null || gestionCtrl.chat === "") {
            return;
        }

        if (data.objectIdChat === gestionCtrl.chat._id) {
            data.divGlobalStyle = data.objectIdAccount === gestionCtrl.user._id ? 'bubble alt' : 'bubble';
            data.divBubblelStyle = data.objectIdAccount === gestionCtrl.user._id ? 'bubble-arrow alt' : 'bubble-arrow';
            var date = new Date(data.time);
            data.time = date.getHours() + ":" + date.getMinutes();

            var chatbox = document.getElementById('chatbox');
            var bubble = appConstant.CREATE_CHAT_BUBBLE(data.divGlobalStyle, data.username, data.message, data.time, data.divBubblelStyle);

            chatbox.innerHTML += bubble;
        }

        scrollBodyChat();
        $scope.$digest();
    }

    function addNotification(data) {
        data.usernameReceiver === gestionCtrl.user.username ? appConstant.SHOW_MSG_INFO("New Message from: " + data.username) : '';
    }

    var bubbleWidth = 260;
    console.log($('.bubble').css("width"));

    function scrollBodyChat() {
        $(function () {
            var div = $('#spech');
            var height = div[0].scrollHeight;
            div.scrollTop(height);
            changePositionBubble();
        });
    }

    $(window).resize(function () {
        changePositionBubble();
    });

    function changePositionBubble() {
        var parent = document.getElementById('spech');
        var parent_width = parent.clientWidth - (bubbleWidth);
        $('.bubble.alt').css({"margin-left": parent_width});
    }

    gestionCtrl.init();
    gestionCtrl.findAllUsers();

}
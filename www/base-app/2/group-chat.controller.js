angular.module('app').controller('groupChatCtrl', groupChatCtrl);

groupChatCtrl.$inject = ['$scope', 'appGenericConstant', 'appConstant', 'utilServices', 'groupChatService', 'infinitoService'];

function groupChatCtrl($scope, appGenericConstant, appConstant, utilServices, groupChatService, infinitoService) {
    var gestionCtrl = this;
    var socket = utilServices.SOCKET_SERVER;

    gestionCtrl.init = function () {
        var altura = $(window).height();
        var ancho = $(window).width();
        gestionCtrl.user = JSON.parse(localStorage.usuario);
        gestionCtrl.message = "";
        gestionCtrl.filterUsersToAdd = "";
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

        gestionCtrl.findGroupChatByAccountId(gestionCtrl.user._id);
        gestionCtrl.findAllUsers();
    };

    gestionCtrl.openModalCreateGroupChat = function () {
        gestionCtrl.groupName = "";
        $('#myModalCreateGroup').modal({backdrop: 'static', keyboard: false});
        $('#myModalCreateGroup').modal('show');
    };

    gestionCtrl.addMember = function (item) {
        $('#myModalUsers').modal({backdrop: 'static', keyboard: false});
        $('#myModalUsers').modal('show');
        gestionCtrl.group = item;
        gestionCtrl.findUsersFromGroup(item.groupId);
    };

    gestionCtrl.findAllUsers = function () {
        gestionCtrl.listUsers = [];
        infinitoService.findAllUsers().then(function (data) {
            gestionCtrl.listUsers = data;
        }).catch(function (e) {
            return;
        });
    };

    gestionCtrl.findUsersFromGroupModal = function (item) {
        gestionCtrl.listUserToShow = [];
        groupChatService.findUsersByGroupId(item.groupId).then(function (data) {
            gestionCtrl.listUserToShow = data;
            $('#myModalUsersInfo').modal({backdrop: 'static', keyboard: false});
            $('#myModalUsersInfo').modal('show');
        });
    };

    gestionCtrl.findUsersFromGroup = function (id) {
        gestionCtrl.listUsersToAdd = [];
        groupChatService.findUsersByGroupId(id).then(function (data) {

            var listUsersInGroup = jQuery.map(data, function (obj) {
                return  obj.accountId;
            });

            angular.forEach(gestionCtrl.listUsers, function (value) {
                if (!listUsersInGroup.includes(value._id)) {
                    value.checked = false;
                    value.groupId = gestionCtrl.group.groupId;
                    value.groupName = gestionCtrl.group.groupName;
                    gestionCtrl.listUsersToAdd.push(value);
                }
            });

            $scope.$digest();
        }).catch(function (e) {
            return;
        });
    };

    gestionCtrl.addUsersToGroup = function () {
        console.log(gestionCtrl.listUsersToAdd);
        socket.emit('addUserToGroup', gestionCtrl.listUsersToAdd);
    };

    socket.on('addUserToGroupResponse', function (data) {
        $('#myModalUsers').modal('hide');
        appConstant.SHOW_MSG_SUCCESS(data.message);
        $scope.$digest();
    });

    gestionCtrl.CreateGroupChat = function () {
        var json = {
            groupName: gestionCtrl.groupName,
            username: gestionCtrl.user.username,
            accountId: gestionCtrl.user._id,
            time: Date()
        };
        $('#myModalCreateGroup').modal('hide');
        appConstant.SHOW_MSG_SUCCESS("Group Created");
        socket.emit('createGroupChat', json);
    };

    socket.on('createGroupChatResponse', function () {
        gestionCtrl.findGroupChatByAccountId(gestionCtrl.user._id);
        $scope.$digest();
    });

    gestionCtrl.changeToGroups = function (item) {
        $('#cardBodyInfinito').css({"display": "none"});
        $('.cardBodyChat').css({"display": "initial"});
        gestionCtrl.chat = item;
        gestionCtrl.findGroupChatMessages(item.groupId);
    };

    gestionCtrl.changeToListOfGroups = function () {
        $('#cardBodyInfinito').css({"display": "initial"});
        $('.cardBodyChat').css({"display": "none"});
        gestionCtrl.chat = "";
    };

    gestionCtrl.openModalUserOfGroup = function (item) {

    };

    gestionCtrl.findGroupChatByAccountId = function (id) {
        gestionCtrl.listGroup = [];
        groupChatService.findGroupChatByAccountId(id).then(function (data) {
            gestionCtrl.listGroup = data;
            $scope.$digest();
        }).catch(function (e) {
            return;
        });
    };

    gestionCtrl.findGroupChatMessages = function (id) {
        gestionCtrl.listOfMessages = [];
        var chatbox = document.getElementById('chatbox');
        chatbox.innerHTML = "";
        groupChatService.findGroupChatMessages(id).then(function (data) {
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

    gestionCtrl.sendMessage = function () {
        var json = {
            objectIdGroup: gestionCtrl.chat.groupId,
            objectIdAccount: gestionCtrl.user._id,
            username: gestionCtrl.user.username,
            message: gestionCtrl.message
        };
        socket.emit('sendGroupMessage', json);
        gestionCtrl.message = "";
    };

    socket.on('sendGroupMessageResponse', function (data) {
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

        if (gestionCtrl.chat !== undefined || gestionCtrl.chat !== null || gestionCtrl.chat !== "") {
            if (data.objectIdGroup === gestionCtrl.chat.groupId) {
                chatbox.innerHTML += bubble;
            }
        } else {
            addNotification(gestionCtrl.chat);
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

    function addNotification() {



    }

    gestionCtrl.init();
//    gestionCtrl.findGroup();

}
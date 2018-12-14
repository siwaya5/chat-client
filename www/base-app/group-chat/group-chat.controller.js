angular.module('app').controller('groupChatCtrl', groupChatCtrl);
groupChatCtrl.$inject = ['$scope', 'appGenericConstant', 'appConstant', 'utilServices', 'groupChatService', 'infinitoService'];
function groupChatCtrl($scope, appGenericConstant, appConstant, utilServices, groupChatService, infinitoService) {

    var gestionCtrl = this;
    var socket = utilServices.SOCKET_SERVER;

    gestionCtrl.init = function () {
        var height = $(window).height();
        gestionCtrl.user = JSON.parse(localStorage.usuario);
        gestionCtrl.message = "";
        gestionCtrl.filterUsersToAdd = "";
        $('.content').css({"height": height});
        $('html').css({"max-height": height});
//        $('html').css({"max-width": ancho});

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

    gestionCtrl.findUsersFromGroupModal = function (item) {
        gestionCtrl.listUserToShow = [];
        groupChatService.findUsersByGroupId(item.groupId).then(function (data) {

            if (data === null) {
                appConstant.SHOW_MSG_WARNING("No data");
                return;
            }

            gestionCtrl.listUserToShow = data;
            gestionCtrl.groupName = data[0].groupName;
            $('#myModalUsersInfo').modal({backdrop: 'static', keyboard: false});
            $('#myModalUsersInfo').modal('show');
        });
    };

    gestionCtrl.findAllUsers = function () {
        gestionCtrl.listUsers = [];
        infinitoService.findAllUsers().then(function (data) {
            gestionCtrl.listUsers = data;
        }).catch(function (e) {
            return;
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

        var listToAdd = jQuery.map(gestionCtrl.listUsersToAdd, function (obj) {
            if (obj.checked)
                return  obj;
        });
        appConstant.SHOW_MSG_SUCCESS("You added users to group");
        $('#myModalUsers').modal('hide');

        socket.emit('addUserToGroup', listToAdd);
    };

    socket.on('addUserToGroupResponse', function (data) {
        if (data.data.username === gestionCtrl.user.username) {
            appConstant.SHOW_MSG_SUCCESS(data.message + " " + data.data.groupName);
            gestionCtrl.findGroupChatByAccountId(gestionCtrl.user._id);
            $scope.$digest();
        }
    });

    gestionCtrl.CreateGroupChat = function () {
        var json = {
            groupName: gestionCtrl.groupName,
            username: gestionCtrl.user.username,
            accountId: gestionCtrl.user._id,
            time: Date()
        };
        socket.emit('createGroupChat', json);
    };

    socket.on('createGroupChatResponse', function (data) {
        gestionCtrl.findGroupChatByAccountId(gestionCtrl.user._id);
        $('#myModalCreateGroup').modal('hide');
        appConstant.SHOW_MSG_SUCCESS("Group Created");
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
        var bubble = appConstant.CREATE_CHAT_BUBBLE(data.divGlobalStyle, data.username, data.message, data.time, data.divBubblelStyle);

        if (gestionCtrl.chat !== undefined && gestionCtrl.chat !== null && gestionCtrl.chat !== "") {
            if (data.objectIdGroup === gestionCtrl.chat.groupId) {
                chatbox.innerHTML += bubble;
            }
        }

        scrollBodyChat();
        $scope.$digest();
    }

    var bubbleWidth = 260;
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

}
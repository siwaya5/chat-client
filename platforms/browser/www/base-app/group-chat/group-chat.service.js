app.service('groupChatService', groupChatService);
groupChatService.$inject = ['utilServices', 'appGenericConstant'];
function groupChatService(utilServices, appGenericConstant) {
    var url = appGenericConstant.URL;

    this.findGroupChatMessages = function (id) {
        var urlRequest = url + 'findGroupChatMessagesById/' + id;
        return utilServices.SERVICE_GET(urlRequest);
    };

    this.findGroupChatByAccountId = function (id) {
        var urlRequest = url + 'findGroupChatByAccountId/' + id;
        return utilServices.SERVICE_GET(urlRequest);
    };

    this.findUsersByGroupId = function (id) {
        var urlRequest = url + 'findUsersByGroupId/' + id;
        return utilServices.SERVICE_GET(urlRequest);
    };

}
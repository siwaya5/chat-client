app.service('groupChatService', groupChatService);
groupChatService.$inject = ['utilServices', 'appGenericConstant'];
function groupChatService(utilServices, appGenericConstant) {
    var url = appGenericConstant.URL;

    this.findGroupChatMessages = function (id) {
        var urlRequest = url + 'findGroupChatMessages/' + id;
        return utilServices.SERVICE_GET(urlRequest);
    };

    this.findGroup = function () {
        var urlRequest = url + 'findGroup';
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
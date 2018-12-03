app.service('infinitoService', infinitoService);
infinitoService.$inject = ['utilServices', 'appGenericConstant'];
function infinitoService(utilServices, appGenericConstant) {
    var url = appGenericConstant.URL;

    this.findAllUsers = function () {
        var urlRequest = url + 'findAllUsers';
        return utilServices.SERVICE_GET(urlRequest);
    };

    this.findChatMessages = function (id) {
        var urlRequest = url + 'findChatMessages/' + id;
        return utilServices.SERVICE_GET(urlRequest);
    };
}
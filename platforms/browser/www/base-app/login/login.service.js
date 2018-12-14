app.service('loginService', loginService);

loginService.$inject = ['utilServices', 'appGenericConstant'];

function loginService(utilServices, appGenericConstant) {
    var url = appGenericConstant.URL + "api/account/";

    this.onSingUp = function (rs) {
        var urlrequest = url;
        return utilServices.SERVICE_POST(urlrequest, rs);
    };
}
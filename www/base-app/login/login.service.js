app.service('loginService', loginService);

loginService.$inject = ['utilServices', 'appGenericConstant'];

function loginService(utilServices, appGenericConstant) {
    var url = appGenericConstant.URL + "api/auth/";

    this.postLogin = function (rs) {
        var urlrequest = url + "login";
        return utilServices.EjecutarServicePost(urlrequest, rs);
    }
}
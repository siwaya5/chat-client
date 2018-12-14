app.service('profileService', profileService);

profileService.$inject = ['utilServices', 'appGenericConstant'];

function profileService(utilServices, appGenericConstant) {
    var url = appGenericConstant.URL;

    this.getProfilePicture = function (id) {
        var urlRequest = url + 'findProfilePhoto/' + id;
        return utilServices.SERVICE_GET(urlRequest);
    };
}
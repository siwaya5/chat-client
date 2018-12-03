app.service('appConstant', ['growl',function (growl) {
    this.SHOW_MSG_ERROR = function (Mensaje) {
        $.notify({
            icon: "add_alert",
            message: Mensaje
        }, {
            type: 'danger',
            timer: 1000,
            z_index: 100000,
            placement: {
                from: 'top',
                align: 'right'
            }
        });
    }

    this.SHOW_MSG_INFO = function (Mensaje) {
        $.notify({
            icon: "add_alert",
            message: Mensaje
        }, {
            type: 'info',
            timer: 1000,
            z_index: 100000,
            placement: {
                from: 'top',
                align: 'right'
            }
        });
    }

    this.SHOW_MSG_WARNING = function (Mensaje) {
        $.notify({
            icon: "add_alert",
            message: Mensaje
        }, {
            type: 'warning',
            timer: 1000,
            z_index: 100000,
            placement: {
                from: 'top',
                align: 'right'
            }
        });
    }

    this.SHOW_MSG_SUCCESS = function (Mensaje) {
        $.notify({
            icon: "done",
            message: Mensaje
        }, {
            type: 'success',
            timer: 1000,
            z_index: 100000,
            placement: {
                from: 'top',
                align: 'right'
            }
        });
    }
    // SWAL
    this.MSG_LOADING = function (titulo) {
        swal({
            title: titulo,
            allowOutsideClick: false,
            allowEscapeKey: false
        });
    };

    this.CARGANDO = function () {
        swal.enableLoading();
    };


    this.CERRAR_SWAL = function () {
        swal.closeModal();
    };

    this.MSG_CONFIRMACION = function () {
        swal({
            title: 'Confirmando datos, espera un momento...',
            allowOutsideClick: false,
            allowEscapeKey: false
        });
    };

}]).constant('appGenericConstant', {
    'URL': 'http://localhost:2000/',
    'URL_FILE': 'C:/chat_images/',
    'ERROR_INESPERADO': 'Ha ocurrido un error inesperado, por favor contactar al administrador'
});
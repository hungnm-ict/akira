var serv = angular.module('akrRestService', []);

serv.service('globalRESTServ', function($http) {
    var BASE_URL = "http://akira.edu.vn/wp-content/plugins/akira-api/";

    /**
     * REST center resolve
     * @param  {[type]} type   [description]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    this.getRESTPromise = function(type, params) {
        switch (type) {
            case "":
                break;
            default:
                return null;
                break;
        }
    }
});

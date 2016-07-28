'use strict';
myApp.factory("changePasswordService",["$http", "$q", "$rootScope", "commonService", "constantValues", function($http, $q, $rootScope, commonService, constantValues) {
    return {
        submitPassword:submitPassword
    };

    function submitPassword(user) {
        var deferred = $q.defer();
        return $http({
            method : 'POST',
            url    : constantValues.SERVER_HOST + '/changePassword',
            data   : user,
            headers : {
                'APP_LOGIN': 'ash', 
                'APPID_LOGIN': '1'
            }			
        }).success(function(respData) {
            deferred.resolve(respData);			
        }).error(function(errorData) {
            commonService.showAlert(errorData ,"Error while changing password.");
        });

        return deferred.promise;
    };
}]);

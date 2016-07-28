'use strict';
myApp.factory("loginService",["$http","$q","$rootScope","commonService","constantValues", function($http, $q, $rootScope, commonService, constantValues) {

    return {
        login: login,
        signup: signup,
        getCreds: getCreds,
        isloggedin: isloggedin,
        verify: verify
    };
    
    function getCreds(user) {
        var deferred = $q.defer();
        var token = new Date().getMilliseconds();
        return $http({
            method: 'POST',
            data: user,
            url: constantValues.SERVER_HOST + '/creds?token=' + token,
        }).success(function(respData) {
            deferred.resolve(respData);
        }).error(function(errorData) {
            deferred.reject("Error while receiving creds details.");
        });

        return deferred.promise;
    };

    function login(user) {
        var deferred = $q.defer();
        var token = new Date().getMilliseconds();
        return $http({
            method: 'POST',
            data: user,
            url: constantValues.SERVER_HOST + '/login?token=' + token,
        }).success(function(respData) {
            deferred.resolve(respData);
        }).error(function(errorData) {
            deferred.reject("Error while receiving project details.");
        });

        return deferred.promise;
    };
    
     function verify(user) {
        var deferred = $q.defer();
        var token = new Date().getMilliseconds();
        return $http({
            method: 'POST',
            data: user,
            url: constantValues.SERVER_HOST + '/verify?token=' + token,
        }).success(function(respData) {
            deferred.resolve(respData);
        }).error(function(errorData) {
            deferred.reject("Error while receiving project details.");
        });

        return deferred.promise;
    };
    
    function signup(user) {
        var deferred = $q.defer();
        var token = new Date().getMilliseconds();
        return $http({
            method: 'POST',
            data: user,
            url: constantValues.SERVER_HOST + '/signup?token=' + token,
        }).success(function(respData) {
            deferred.resolve(respData);
        }).error(function(errorData) {
            deferred.reject("Error while signup.");
        });

        return deferred.promise;
    };
    
    function isloggedin() {
        var deferred = $q.defer();
        var token = new Date().getMilliseconds();
        return $http({
            method: 'GET',
            url: constantValues.SERVER_HOST + '/isUserLoggedIn?token=' + token,
        }).success(function(respData) {
            deferred.resolve(respData);
        }).error(function(errorData) {
            deferred.reject("Error while signup.");
        });

        return deferred.promise;
    };
    
    
}]);

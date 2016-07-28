myApp.factory("notificationsService",
        ['$http', '$q', '$rootScope', 'commonService', 'constantValues',
            function($http, $q, $rootScope, commonService, constantValues) {

                return {
                    getNotificationsCount: getNotificationsCount,
                    getNotifications:getNotifications,
                    readNotifications:readNotifications
                }

                function getNotificationsCount() {
                    var deferred = $q.defer();
                    var token = new Date().getMilliseconds();
                    return $http({
                        method: 'GET',
                        url: constantValues.SERVER_HOST + '/notificationCount?token=' + token,
                        headers: {
                            'APP_LOGIN': 'mambo',
                            'APPID_LOGIN': '1'
                        }
                    }).success(function(respData) {
                        deferred.resolve(respData);
                    }).error(function(errorData) {
                        console.log("Error while getting notifications.");
                    });

                    return deferred.promise;
                }
                ;

                function getNotifications() {
                    var deferred = $q.defer();
                    var token = new Date().getMilliseconds();
                    return $http({
                        method: 'GET',
                        url: constantValues.SERVER_HOST + '/notifications/0/100?token=' + token,
                        headers: {
                            'APP_LOGIN': 'mambo',
                            'APPID_LOGIN': '1'
                        }
                    }).success(function(respData) {
                        deferred.resolve(respData);
                    }).error(function(errorData) {
                        Console.log("Error while getting categorys.");
                    });
                    return deferred.promise;
                }
                ;
                
                 function readNotifications() {
                    var deferred = $q.defer();
                    var token = new Date().getMilliseconds();
                    return $http({
                        method: 'GET',
                        url: constantValues.SERVER_HOST + '/readNotification?token=' + token,
                        headers: {
                            'APP_LOGIN': 'mambo',
                            'APPID_LOGIN': '1'
                        }
                    }).success(function(respData) {
                        deferred.resolve(respData);
                    }).error(function(errorData) {
                        commonService.showAlert(errorData, "Error while getting categorys.");
                    });
                    return deferred.promise;
                }
                ;
            }]);

myApp.factory("userService",
        ['$http', '$q', '$rootScope', 'commonService', 'constantValues',
            function ($http, $q, $rootScope, commonService, constantValues) {

                return{
                    getUserDetails: getUserDetails,
                    edit: edit,
                    getAllUsers: getAllUsers,
                    deActivate: deActivate,
                    activateUser: activateUser,
                    getUsersData: getUsersData
                };

                function getUsersData()
                {
                    var deferred = $q.defer();
                    var token = new Date().getMilliseconds();
                    return $http({
                        method: 'GET',
                        url: constantValues.SERVER_HOST + '/usersData?token=' + token,
                        transformRequest: function (data) {
                            return data;
                        },
                        headers: {
                            'emcloginname': $rootScope.userHeaderName,
                            'Content-Type': undefined
                        }
                    }).success(function (respData) {
                        deferred.resolve(respData);
                    }).error(function (errorData) {
                        commonService.showAlert(errorData, "Error while getting userDashboard data");
                    });
                    return deferred.promise;
                }

                function getUserDetails()
                {
                    var deferred = $q.defer();
                    var token = new Date().getMilliseconds();
                    return $http({
                        method: 'GET',
                        url: constantValues.SERVER_HOST + '/users/0/100?token=' + token,
                        transformRequest: function (data) {
                            return data;
                        },
                        headers: {
                            'emcloginname': $rootScope.userHeaderName,
                            'Content-Type': undefined
                        }
                    }).success(function (respData) {
                        deferred.resolve(respData);
                    }).error(function (errorData) {
                        commonService.showAlert(errorData, "Error while getting userDashboard data");
                    });
                    return deferred.promise;
                }

                function edit(user) {
                    var deferred = $q.defer();
                    var token = new Date().getMilliseconds();
                    return $http({
                        method: 'PUT',
                        url: constantValues.SERVER_HOST + '/edit/' + user.id,
                        data: user,
                        headers: {
                            'APP_LOGIN': 'ash',
                            'APPID_LOGIN': '1'
                        }
                    }).success(function (respData) {
                        deferred.resolve(respData);
                    }).error(function (errorData) {
                        commonService.showAlert(errorData, "Error while changing data.");
                    });
                    return deferred.promise;
                }
                ;

                function getAllUsers() {
                    var deferred = $q.defer();
                    var token = new Date().getMilliseconds();
                    return $http({
                        method: 'GET',
                        url: constantValues.SERVER_HOST + '/allUsers/0/100?token=' + token,
                        transformRequest: function (data) {
                            return data;
                        },
                        headers: {
                            'emcloginname': $rootScope.userHeaderName,
                            'Content-Type': undefined
                        }
                    }).success(function (respData) {
                        deferred.resolve(respData);
                    }).error(function (errorData) {
                        commonService.showAlert(errorData, "Error while changing data.");
                    });
                    return deferred.promise;
                }
                ;

                function deActivate(user) {
                    var deferred = $q.defer();
                    var token = new Date().getMilliseconds();
                    return $http({
                        method: 'PUT',
                        url: constantValues.SERVER_HOST + '/deActivate/' + user.id + '?token=' + token,
                        headers: {
                            'APP_LOGIN': 'mambo',
                            'APPID_LOGIN': '1'
                        }
                    }).success(function (respData) {
                        deferred.resolve(respData);
                    }).error(function (errorData) {
                        commonService.showAlert(errorData, "Error while getting users.");
                    });

                    return deferred.promise;
                }
                ;

                function activateUser(user) {
                    var deferred = $q.defer();
                    var token = new Date().getMilliseconds();
                    return $http({
                        method: 'PUT',
                        url: constantValues.SERVER_HOST + '/activate/' + user.id + '?token=' + token,
                        data: user,
                        headers: {
                            'APP_LOGIN': 'mambo',
                            'APPID_LOGIN': '1'
                        }
                    }).success(function (respData) {
                        deferred.resolve(respData);
                    }).error(function (errorData) {
                        commonService.showAlert(errorData, "Error while getting users.");
                    });

                    return deferred.promise;
                }
                ;
            }]);

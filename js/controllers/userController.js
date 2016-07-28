myApp.controller('userCtrl',
        ['$scope', '$rootScope', '$translate',
            '$location', '$route', '$modal', '$window',
            'commonService', '$routeParams', 'userService', 'userData',
            function($scope, $rootScope, $translate,
                    $location, $route, $modal, $window,
                    commonService, $routeParams, userService, userData) {

                var successUsers = function(respData) {
                    if (respData.data) {
                        $scope.user = respData.data;
                    }

                };
                var failureUsers = function(errorData) {
                    commonService.showNetworkErrorAlert();
                };

                if (userData && 200 <= userData.status && userData.status < 300) {
                    successUsers(userData);
                } else {
                    failureUsers(userData);
                }

                var editSuccess = function(respData) {
                    commonService.toggleProcessing(false);
                    if (respData.data.status && respData.data.status === true) {
                        commonService.showAlert($translate('UPDATE_SUCCESS'));
                    }
                    else if (respData.data.status === false && respData.data.errorcode === 1) {
                        commonService.showAlert($translate('UPDATE_FAIL'));
                    }
                };
                var editFailure = function(errorData) {
                    commonService.showNetworkErrorAlert();
                };

                $scope.editUserDetails = function() {
                    commonService.toggleProcessing(true);
                    userService.edit($scope.user).then(editSuccess, editFailure);
                };
            }]);

myApp.controller('manageUsersCtrl',
        ['$scope', '$rootScope', '$translate',
            '$location', '$route', '$modal', '$window',
            'commonService', '$routeParams', 'userService', 'allUsers','constantValues',
            function($scope, $rootScope, $translate,
                    $location, $route, $modal, $window,
                    commonService, $routeParams, userService, allUsers, constantValues) {

                var successAllUsers = function(respData) {
                    if (respData.data) {
                        $scope.users = respData.data;
                    }

                };
                var failureAllUsers = function(errorData) {
                    commonService.showNetworkErrorAlert();
                };

                if (allUsers && 200 <= allUsers.status && allUsers.status < 300) {
                    successAllUsers(allUsers);
                } else {
                    failureAllUsers(allUsers);
                }

                $scope.deActivate = function(user) {
                    var modalInstance = $modal.open({
                        templateUrl:  constantValues.HTML_LOC + 'angularviews/deActivateUser.html',
                        controller: 'deActivateUserCtrl',
                        keyboard: false,
                        resolve: {user: [function() {
                                return user;
                            }]}
                    });
                };
                
                 $scope.activate = function(user) {
                    var modalInstance = $modal.open({
                        templateUrl:  constantValues.HTML_LOC + 'angularviews/activateUser.html',
                        controller: 'activateUserCtrl',
                        keyboard: false,
                        resolve: {user: [function() {
                                return user;
                            }]}
                    });
                };
            }]);

/**********************************************************************************
 Alert Message Controller
 **********************************************************************************/
myApp.controller('deActivateUserCtrl',
        ['$scope', '$modalInstance', 'user', '$translate', 'userService', 'commonService', '$route',
            function($scope, $modalInstance, user, $translate, userService, commonService, $route) {

                $scope.errorMessage = $translate('DEACTIVATE_USER') + ' ' + user.firstname + ' ' + user.lastname+' ?';

                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };

                $scope.ok = function() {
                    commonService.toggleProcessing(true);
                    userService.deActivate(user);
                    $modalInstance.dismiss('cancel');
                    $route.reload();
                };
            }]);
        
        /**********************************************************************************
 Alert Message Controller
 **********************************************************************************/
myApp.controller('activateUserCtrl',
        ['$scope', '$modalInstance', 'user', '$translate', 'userService', 'commonService', '$route',
            function($scope, $modalInstance, user, $translate, userService, commonService, $route) {

                $scope.errorMessage = $translate('ACTIVATE_USER') + ' ' + user.firstname + ' ' + user.lastname;

                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };

                $scope.ok = function() {
                    commonService.toggleProcessing(true);
                    userService.activateUser(user);
                    $modalInstance.dismiss('cancel');
                    $route.reload();
                };
            }]);

//'use strict';

/**********************************************************************************
 Common Controller
 **********************************************************************************/

myApp.controller('commonCtrl',
        ['$scope', '$rootScope', '$translate', '$modal', '$route',
            '$location', 'constantValues', '$timeout',
            'commonService', '$cookies', '$window', 'homeService', 'notificationsService',
            function ($scope, $rootScope, $translate, $modal, $route, $location, constantValues, $timeout,
                    commonService, $cookies, $window, homeService, notificationsService) {
                $scope.user = {};
                $scope.user.firstName = localStorage.getItem("firstName");
                $scope.user.lastName = localStorage.getItem("lastName");
                $scope.user.gender = localStorage.getItem("gender");
                $scope.notificationInterval;
				$scope.loggedOut = true;
				
				
				var loggedOut = localStorage.getItem("loggedOut");
				
				if(!loggedOut){
					$scope.loggedOut = false;
				}

                $scope.notifications = 0

                var notificationSuccess = function (respData) {
                    $scope.userNameHeader = respData.config.headers.topicloginname;
                    $rootScope.userHeaderName = respData.config.headers.topicloginname;
					$scope.loggedOut = false;
					localStorage.setItem('loggedOut', false);
                    if (respData.data.errorcode && respData.data.errorcode === 1 && !respData.data.status) {
                        $scope.noDataFound = true;
                    } else {
                        $scope.notifications = respData.data[0];
                        if ($scope.notifications < 5) {
                            $('#notibell').css("background-color", "rgb(155, 153, 153)");
                            $('#notibell').css("color", "#000");

                        } else {
                            $('#notibell').css("background-color", "rgb(247, 167, 176)");
                            $('#notibell').css("color", "#000");
                        }

                    }
                    commonService.toggleProcessing(false);
                };

                var notificationFailure = function (errorData) {
                    console.log("Error in getting topic list");
                    commonService.toggleProcessing(false);
                    if (errorData.status === 401) {
                        localStorage.clear();
                        localStorage.clear();
                        homeService.logout().then(logoutSuccess, logoutFailure);
                    }
                    //commonService.showAlert($translate('NETWORK_ERROR'));
                };
                notificationsService.getNotificationsCount().then(notificationSuccess, notificationFailure);

                $scope.notificationInterval = setInterval(function () {

                    notificationsService.getNotificationsCount().then(notificationSuccess, notificationFailure);
                }, 60000);

                $scope.showNotifications = function () {
                    $location.path('/notifications');
                };

                //About mambo
                $scope.aboutmambo = function () {

                    var modalInstance = $modal.open({
                        templateUrl: constantValues.HTML_LOC + 'angularviews/aboutmamboModal.html',
                        controller: 'aboutmamboController',
                        backdrop: 'static',
                        keyboard: false
                    });
                };

                //Settings
                $scope.settings = function () {
                    var modalInstance = $modal.open({
                        templateUrl: constantValues.HTML_LOC + 'angularviews/changePassword.html',
                        controller: 'changePasswordCtrl',
                        keyboard: false
                    });
                };


                setTimeout(function () {
                    $('.current-page').parent().prev().click();
                }, 500);

                $scope.changeRoute = function (nextLocation) {
                    $location.path(nextLocation);
					$BODY = $('body');
                    setTimeout(function () {
						if ($BODY.hasClass('nav-md')) {
            $BODY.removeClass('nav-md').addClass('nav-sm');
            $LEFT_COL.removeClass('scroll-view').removeAttr('style');

            if ($SIDEBAR_MENU.find('li').hasClass('active')) {
                $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
            }
        } else {
            $BODY.removeClass('nav-sm').addClass('nav-md');

            if ($SIDEBAR_MENU.find('li').hasClass('active-sm')) {
                $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
            }
        }
                        $('.nav-sm .current-page').parent().hide();
                        $('.nav-sm #sidebar-menu ul li').removeClass('active');
                        $('.side-menu ul li').removeClass('active');
                        $('.nav-sm #sidebar-menu ul li').removeClass('active-sm');
                        $('.current-page').parent().parent().addClass('active-sm');
                    }, 200);
                };


                $('#searchDropdown .dropdown-menu').on({
                    "click": function (e) {
                        e.stopPropagation();
                    }
                });


                $scope.activePath = "/home";
                $scope.$on('$routeChangeSuccess', function () {
                    $scope.activePath = $location.url().substring($location.url().indexOf('#'), $location.url().length);
                });

                var systemAttributesSuccess = function (respData) {
                    commonService.clearStoredVal('MAX_FILE_UPLOAD');
                    commonService.storeVal('MAX_FILE_UPLOAD', respData.data.fileupload_maxnumber);

                    commonService.clearStoredVal('MAX_FILE_SIZE');
                    commonService.storeVal('MAX_FILE_SIZE', respData.data.fileupload_maxsizeperfile);

                    commonService.clearStoredVal('APP_VERSION');
                    commonService.storeVal('APP_VERSION', respData.data.appversion);

                    commonService.clearStoredVal('BUILD_NUMBER');
                    commonService.storeVal('BUILD_NUMBER', respData.data.buildnumber);

                    commonService.clearStoredVal('POLICY_SERVER');
                    commonService.storeVal('POLICY_SERVER', respData.data.policyServer);

                    commonService.clearStoredVal('DB_VERSION');
                    commonService.storeVal('DB_VERSION', respData.data.dbversion);

                    angular.forEach(respData.data, function (value, key) {
                        if (key == '3.5 disks in DAE') {
                            commonService.clearStoredVal('3.5_DISKS_DAE');
                            commonService.storeVal('3.5_DISKS_DAE', value);
                        } else if (key == '2.5 disks in DAE') {
                            commonService.clearStoredVal('2.5_DISKS_DAE');
                            commonService.storeVal('2.5_DISKS_DAE', value);
                        }
                    });
                }
                var systemAttributesFailure = function (errorData) {
                    commonService.showAlert(errorData.data.ex);
                }

                var getSystemAttributes = function () {
                    commonService.getSystemAttributes().then(systemAttributesSuccess, systemAttributesFailure);
                }

                /**************************************
                 Watch for route change
                 **************************************/
                $scope.$on('$locationChangeStart', function (event, next, current) {
                    //Add an exception for this, because we intend to redirect the user to a seperate tab.
                    if (current.indexOf("defineConstraints") == -1 && current.indexOf("notifications") == -1)
                    {
                        if (next.substring(0, next.indexOf("?")) != current.substring(0, current.indexOf("?")))
                        {
                            $location.search('tab', 0);
                        }
                    }
                });

                var logoutSuccess = function (respData) {
                    commonService.toggleProcessing(false);
					$scope.loggedOut = true;
					localStorage.setItem('loggedOut', true);
                    if (respData.data.status && respData.data.status === true) {
                        $window.location.href = '#/login';
                    }
                };

                var logoutFailure = function (errorData) {
                    console.log("Error while logging out");
                    commonService.toggleProcessing(false);
                    //commonService.showAlert($translate('NETWORK_ERROR'));
                };

                $scope.logoutUser = function () {
                    clearInterval($scope.notificationInterval)
                    commonService.toggleProcessing(true);
                    localStorage.clear();
                    homeService.logout().then(logoutSuccess, logoutFailure);
                };

                $scope.searchMe = function (searchText) {
                    $location.path('/search/' + searchText);
                };
            }]);

/**********************************************************************************
 Alert Message Controller
 **********************************************************************************/
myApp.controller('alertMessageCtrl',
        ['$scope', '$modalInstance', 'items',
            function ($scope, $modalInstance, items) {

                $scope.errorMessage = items;

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }]);

/**********************************************************************************
 About mambo Controller
 **********************************************************************************/

myApp.controller('aboutmamboController',
        ['$scope', '$modalInstance', '$translate', 'commonService',
            function ($scope, $modalInstance, commonService) {
                $scope.app_version = "1.0"//commonService.getStoredVal('APP_VERSION');
                $scope.db_version = "255"//commonService.getStoredVal('DB_VERSION');
                $scope.USER_ROLE = "ROLE_ADMIN"//commonService.getStoredVal('USER_ROLE');
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }]);

/**********************************************************************************
 About settings Controller
 **********************************************************************************/

myApp.controller('changePasswordCtrl',
        ['$scope', '$modalInstance', '$translate', 'commonService',
            function ($scope, $modalInstance, commonService) {
                $scope.app_version = "1.0"//commonService.getStoredVal('APP_VERSION');
                $scope.db_version = "255"//commonService.getStoredVal('DB_VERSION');
                $scope.USER_ROLE = "ROLE_ADMIN"//commonService.getStoredVal('USER_ROLE');
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }]);

/**********************************************************************************
 Delete Message Controller
 **********************************************************************************/
myApp.controller('DeleteMessageCtrl', ['$scope', '$modalInstance', 'items',
    function ($scope, $modalInstance, items) {

        $scope.errorMessage = items;

        $scope.cancel = function () {
            $modalInstance.close('cancel');
        };
        $scope.yes = function () {
            $modalInstance.close('yes');
        };
        $scope.no = function () {
            $modalInstance.close('cancel');
        };
    }]);


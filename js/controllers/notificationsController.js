myApp.controller('notificationCtrl',
        ['$scope', '$rootScope', '$translate',
            '$location', '$route', '$modal', '$window',
            'commonService', '$routeParams', 'notificationsService','notificationsData',
            function($scope, $rootScope, $translate,
                    $location, $route, $modal, $window,
                    commonService, $routeParams, notificationsService,notificationsData)
            {
                
                
                var notificationSuccess = function(respData) {
                    console.log("Get notification success for user " + $rootScope.userHeaderName);
                    $scope.userNameHeader = respData.config.headers.notificationloginname;
                    $rootScope.userHeaderName = respData.config.headers.notificationloginname;
                    if (respData.data.errorcode && respData.data.errorcode === 1 && !respData.data.status) {
                        $scope.noDataFound = true;
                    } else {
                        $scope.notifications = respData.data;
                        $('#notibell').text('0');
                        setTimeout(function(){
                        $('.newone').fadeOut(9000);
                    }, 1000);
                        notificationsService.readNotifications();
                    }
                    commonService.toggleProcessing(false);
                };

                var notificationFailure = function(errorData) {
                    console.log("Error in getting notification list");
                    commonService.toggleProcessing(false);
                    commonService.showAlert($translate('NETWORK_ERROR'));
                };

                //console.log("Getting notification for user " + $rootScope.userHeaderName);
                if (notificationsData && 200 <= notificationsData.status && notificationsData.status < 300) {
                    notificationSuccess(notificationsData);
                } else {
                    notificationFailure(notificationsData);
                }
                
                $scope.goTores = function(notification){
                    if(notification.type === 'testrequest'){
                        $location.path('/takeTest/'+notification.emptestid);
                    }
                    if(notification.type === 'declinetest'){
                        $location.path('/viewCalendar/'+notification.emptestid);
                    }
                    if(notification.type === 'testcomplete'){
                        $location.path('/result');
                    }
                };

            }]);

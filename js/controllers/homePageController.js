myApp.controller('homePageCtrl',
        ['$scope', '$rootScope', '$translate',
            '$location', '$route', '$modal', '$window',
            'commonService', '$routeParams', 'homeService', 'dashboardData','constantValues',
            function ($scope, $rootScope, $translate,
                    $location, $route, $modal, $window,
                    commonService, $routeParams, homeService, dashboardData,constantValues)
            {
 
                $scope.role = localStorage.getItem("role");
                // get list of topic
                var daboardSuccess = function (respData) {
                    console.log("Get dashboard success for user " + $rootScope.userHeaderName);
                    $scope.userNameHeader = respData.config.headers.topicloginname;
                    $rootScope.userHeaderName = respData.config.headers.topicloginname;
                    $scope.dashboardData = respData.data;
                    commonService.toggleProcessing(false);
                };

                var dashboardFailure = function (errorData) {
                    console.log("Error in getting dashboard list");
                    commonService.toggleProcessing(false);
                    commonService.showAlert($translate('NETWORK_ERROR'));
                };

                if (dashboardData && 200 <= dashboardData.status && dashboardData.status < 300) {
                    daboardSuccess(dashboardData);
                } else {
                    dashboardFailure(dashboardData);
                }

                //Add  Topic
                $scope.addTopic = function () {
                    var modalInstance = $modal.open({
                        templateUrl:  constantValues.HTML_LOC + 'angularviews/addTopic.html',
                        controller: 'addTopicCtrl',
                        keyboard: false
                    });
                };

                //Add  Test
                $scope.addTest = function () {
                    var modalInstance = $modal.open({
                        templateUrl:  constantValues.HTML_LOC + 'angularviews/addTest.html',
                        controller: 'addTestCtrl',
                        keyboard: false,
                        resolve: {
                            topicsData: ["topicsService", "commonService",function (topicsService, commonService) {
                                commonService.toggleProcessing(true);
                                return topicsService.getTopics();
                            }],
                            categorysData: ["categorysService", "commonService",function (categorysService, commonService) {
                                commonService.toggleProcessing(true);
                                return categorysService.getCategorys();
                            }]
                        }

                    });
                };

                //Add  Category
                $scope.addCategory = function () {
                    var modalInstance = $modal.open({
                        templateUrl:  constantValues.HTML_LOC + 'angularviews/addCategory.html',
                        controller: 'addCategoryCtrl',
                        keyboard: false,
                        resolve: {
                            topicsData: ["topicsService", "commonService",function (topicsService, commonService) {
                                commonService.toggleProcessing(true);
                                return topicsService.getTopics();
                            }]
                        }
                    });
                };

            }]);

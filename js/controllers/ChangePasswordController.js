'use strict';

/**********************************************************************************
 Change Password Controller
 **********************************************************************************/
myApp.controller('changePasswordCtrl',["$scope", "$rootScope", "$translate", "$location", "$modal",
        "changePasswordService", "commonService", "constantValues", "$routeParams", "$window", "$timeout", "$modalInstance", function($scope, $rootScope, $translate, $location, $modal,
        changePasswordService, commonService, constantValues, $routeParams, $window, $timeout, $modalInstance) {
    $scope.user = {};

    var changePasswordSuccess = function(respData) {
        $modalInstance.close();
        commonService.toggleProcessing(false);
        if (respData.data.status && respData.data.status === true) {
            commonService.showAlert($translate('PASS_CHANGE_SUCCESS'));
        } else {
            commonService.showAlert($translate('BAD_PASSWORDS'));
        }
    };
    var changePasswordFailure = function(errorData) {
        commonService.showAlert(errorData.data.ex);
        commonService.showAlert($translate('NETWORK_ERROR'));
        commonService.toggleProcessing(false);
    };

    $scope.updatePassword = function() {
        commonService.toggleProcessing(true);
        changePasswordService.submitPassword($scope.user).then(changePasswordSuccess, changePasswordFailure);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.clearPassword = function() {
        $scope.user = {};
    };
}]);

'use strict';

/**********************************************************************************
 login Controller
 **********************************************************************************/
myApp.controller('loginCtrl', ['$route','$scope', '$rootScope', '$translate', '$location', '$modal',
    'loginService', 'commonService', 'constantValues', '$routeParams', '$window', '$timeout', function ($route,$scope, $rootScope, $translate, $location, $modal,
            loginService, commonService, constantValues, $routeParams, $window, $timeout) {
        $scope.user = {};
		$scope.user.username = "admin@saisoft.co.in";
		$scope.user.password = "Welcome@123";
        $scope.langSelected = "en";
        $scope.user.badCrd = false;

        var loginSuccess = function (respData) {
            
            if (respData.data.status && respData.data.status === true) {
                localStorage.setItem("firstName", respData.data.firstName);
                localStorage.setItem("lastName", respData.data.lastName);
                localStorage.setItem("role", respData.data.role);
                localStorage.setItem("gender", respData.data.gender);
				localStorage.setItem("token", respData.data.text);
                $window.location.href = "#/home";
				setTimeout(function(){
				$window.location.reload();
				}, 22);
				commonService.toggleProcessing(false);
            } else if (respData.data.status === false && respData.data.errorcode === 1 && respData.data.errorMessage === 'activate') {
                commonService.showAlert($translate('ACTIVATE_ACCOUNT'));
            }else if (respData.data.status === false && respData.data.errorcode === 1) {
                commonService.showAlert($translate('BAD_CREDENTIALS'));
            }
        };


        var loginFailure = function (errorData) {
            console.log("Error while logging in");
            commonService.toggleProcessing(false);
            commonService.showAlert($translate('ERROR_LOGIN'));
        };
        

        $scope.loginUser = function () {
            commonService.toggleProcessing(true);
            loginService.login($scope.user).then(loginSuccess, loginFailure);
        };
        
         var loggedin = function () {
            window.location.href = 'login';
            
        };
         var notloggedin = function () {
            console.log("not logging in");
        };
        
        setInterval(function(){
            loginService.isloggedin().then(loggedin, notloggedin);
        }, 36000);

        var credSuccess = function (respData) {
            commonService.toggleProcessing(false);
            
            if (respData.data.status && respData.data.status === true) {
                commonService.showAlert($translate('SUCCESS_CREDS'));
            } else {
                commonService.showAlert($translate('ERROR_CREDS'));
            }
        };


        var credFailure = function (errorData) {
            console.log("Error while logging in");
            commonService.toggleProcessing(false);
            commonService.showAlert($translate('ERROR_CREDS'));
        };


        $scope.getCreds = function () {
            commonService.toggleProcessing(true);
            loginService.getCreds($scope.user).then(credSuccess, credFailure);
        };



        $scope.clearUser = function () {
            $scope.user = {};
            $('#j_username').focus();
        };

        $scope.changeLanguage = function (langSelected) {
            $translate.uses(langSelected);
            commonService.setLanguage(langSelected);
        };

    }]);

/**********************************************************************************
 login Controller
 **********************************************************************************/
myApp.controller('signupCtrl',[ "$scope", "$rootScope", "$translate", "$location", "$modal",
        "loginService", "commonService", "constantValues", "$routeParams", "$window", "$timeout", function ($scope, $rootScope, $translate, $location, $modal,
        loginService, commonService, constantValues, $routeParams, $window, $timeout) {
    $scope.user = {};

    $scope.userType = $routeParams.type;
    $scope.langSelected = "en";
    $scope.user.gender = "Male";
    $scope.user.language = "en";

    var signupSuccess = function (respData) {
        commonService.toggleProcessing(false);
        if (respData.data.status && respData.data.status === true) {
            commonService.showAlert($translate('REGI_SUCCESS'));
        } else if (respData.data.status === false && respData.data.errorcode === 1 && respData.data.errorMessage === 'captchaerror') {
            commonService.showAlert($translate('BAD_CAPTCHA'));
        }
    };


    var signupFailure = function (errorData) {
        console.log("Error while logging in");
        commonService.toggleProcessing(false);
        commonService.showAlert($translate('ERROR_LOGIN'));
    };

    $scope.signupUser = function () {
        commonService.toggleProcessing(true);
        $scope.user.type = $scope.userType;
        var address = $scope.user.address + ", " + $scope.user.city + " - " + $scope.user.pincode;
            $.ajax({
                url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&sensor=false",
                type: "POST",
                success: function (res) {
                    $scope.user.lat = res.results[0].geometry.location.lat;
                    $scope.user.lng = res.results[0].geometry.location.lng;
                }
            });
        loginService.signup($scope.user).then(signupSuccess, signupFailure);
    };

    $scope.clearUser = function () {
        $scope.user = {};
        $('#first_name').focus();
    };

    $scope.changeLanguage = function (langSelected) {
        $translate.uses(langSelected);
        commonService.setLanguage(langSelected);
    };

}]);

/**********************************************************************************
 Alert Message Controller
 **********************************************************************************/
myApp.controller('alertMessageCtrl',["$scope", "$modalInstance", "items", function ($scope, $modalInstance, items) {

    $scope.errorMessage = items;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);


/**********************************************************************************
 login Controller
 **********************************************************************************/
myApp.controller('verifyCtrl', ['$scope', '$rootScope', '$translate', '$location', '$modal',
    'loginService', 'commonService', 'constantValues', '$routeParams', '$window', '$timeout','$route', function ($scope, $rootScope, $translate, $location, $modal,
            loginService, commonService, constantValues, $routeParams, $window, $timeout, $route) {
        $scope.user = {};

        var verifySuccess = function (respData) {
            commonService.toggleProcessing(false);
            if (respData.data.status && respData.data.status === true) {
                commonService.showAlert($translate('REG_SUCCESS'));
                $location.path("/login");
            } else if (respData.data.status === false && respData.data.errorcode === 1) {
                commonService.showAlert($translate('BAD_CREDENTIALS'));
            }
        };


        var verifyFailure = function (errorData) {
            console.log("Error while logging in");
            commonService.toggleProcessing(false);
            commonService.showAlert($translate('ERROR_VERIFY'));
        };
        

        $scope.verify = function () {
            commonService.toggleProcessing(true);
            $scope.user.fname = $route.current.params.fname;
            $scope.user.lname = $route.current.params.lname;
            $scope.user.value = $route.current.params.value;
            $scope.user.verifycode = $route.current.params.verifycode;
            $scope.user.contact = $route.current.params.contact;
            $scope.user.gender = $route.current.params.gender;
            $scope.user.email = $route.current.params.email;
            $scope.user.urls = $route.current.params.urls;
            $scope.user.ids = $route.current.params.ids;
            
            loginService.verify($scope.user).then(verifySuccess, verifyFailure);
        };
        
         var loggedin = function () {
            window.location.href = 'login';
            
        };
         var notloggedin = function () {
            console.log("not logging in");
        };
        
       

    }]);


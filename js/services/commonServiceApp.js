'use strict';
myApp.factory("commonService",["$http", "$q", "$rootScope", "constantValues", "$modal","$translate", function ($http, $q, $rootScope, constantValues, $modal, $translate) {
    var userName = null;
    var selectedLang = 'en';
    var userRole = null;
    var screenName = null;
    var nwerrshown = 0;

    return {
        setUserName: setUserName,
        getUserName: getUserName,
        setLanguage: setLanguage,
        getLanguage: getLanguage,
        getStoredVal: getStoredVal,
        setUserRole: setUserRole,
        getUserRole: getUserRole,
        setScreenName: setScreenName,
        getScreenName: getScreenName,
        storeVal: storeVal,
        clearStoredVal: clearStoredVal,
        clearSessionData: clearSessionData,
        getUserData: getUserData,
        showAlert: showAlert,
        showNetworkErrorAlert: showNetworkErrorAlert,
        toggleProcessing: toggleProcessing,
		showMessage: showMessage
    };

    function getStoredVal(key) {
        return localStorage.getItem(key);
    }

    function storeVal(key, value) {
        localStorage.setItem(key, value);
    }

    function clearStoredVal(key) {
        localStorage.removeItem(key);
    }

    function clearSessionData() {
        localStorage.clear();
    }


    function setUserName(userNameParam) {
        userName = userNameParam;
    }
    ;

    function getUserName() {
        return userName;
    }
    ;

    function setLanguage(language) {
        selectedLang = language;
    }
    ;

    function getLanguage() {
        return selectedLang;
    }
    ;

    function setUserRole(role) {
        userRole = role;
    }
    ;

    function getUserRole() {
        return userRole;
    }
    ;

    function setScreenName(name) {
        screenName = name;
    }
    ;

    function getScreenName() {
        return screenName;
    }
    ;


    function getUserData() {
        var deferred = $q.defer();
        var token = new Date().getMilliseconds();
        return $http({
            method: 'GET',
            url: constantValues.SERVER_HOST + '/users/' + $rootScope.userHeaderName + '?token=' + token,
            headers: {'emcloginname': $rootScope.userHeaderName}
        }).success(function (respData) {

            deferred.resolve(respData);
        }).error(function (errorData) {
            deferred.reject("Error while getting userdata");
        });

        return deferred.promise;
    }
    ;

	function showMessage(){
		if(localStorage.getItem('messsage') && localStorage.getItem('messsage') !== ""){	
			var messsage = localStorage.getItem('messsage');
			$('.popupMsg').text(messsage).show().fadeOut(9000);
			localStorage.removeItem('messsage');
		}
	}


    function showAlert(msg) {
        toggleProcessing(false);
        if (msg && msg.indexOf('x-xsrf-token') != -1) {
            msg="Your session expeired. Please login again."
        }
        var modalInstance = $modal.open({
            templateUrl:  constantValues.HTML_LOC + 'angularviews/alertMessageModal.html',
            controller: 'alertMessageCtrl',
            resolve: {
                items: function () {
                    return msg;
                }
            }
        });
        
         var logoutSuccess = function(respData) {
            toggleProcessing(false);
            if (respData.data.status && respData.data.status === true) {
                window.location.href = respData.data.target;
            }
        };

        var logoutFailure = function(errorData) {
            console.log("Error while logging out");
            toggleProcessing(false);
            showAlert($translate('NETWORK_ERROR'));
        };
        
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
            if (msg.indexOf('Your session expeired.') != -1) {
                localStorage.clear();
                logout().then(logoutSuccess, logoutFailure);
            }
        });
    }
    ;
    
    function logout(){
            var deferred = $q.defer();
            var token = new Date().getMilliseconds();
            return $http({
                method : 'GET',
                url    : constantValues.SERVER_HOST + '/logout?token=' + token,
            }).success(function(respData) {
			
                deferred.resolve(respData);			
            }).error(function(errorData) {
                deferred.reject("Error while logging out");
            });

            return deferred.promise;
        };

    function showNetworkErrorAlert() {
        if (nwerrshown == 0) {
            var modalInstance = $modal.open({
                templateUrl:  constantValues.HTML_LOC + 'angularviews/alertMessageModal.html',
                controller: 'alertMessageCtrl',
                resolve: {
                    items: function () {
                        return $translate('NEWORK_ERROR');
                    }
                }
            });
            nwerrshown = 1;
        }
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    }
    ;

    function toggleProcessing(show) {
        if (show) {
            $(".overlay").show();
        }
        if (!show) {
            $(".overlay").hide();
        }
    }
    ;
}]);

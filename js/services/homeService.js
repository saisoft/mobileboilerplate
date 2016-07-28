myApp.factory("homeService", 
    ['$http', '$q', '$rootScope', 'commonService', 'constantValues',
    function($http, $q, $rootScope, commonService, constantValues) {
    
        return{
            userDashboard : userDashboard,
            isUserLoggedin : isUserLoggedin,
            logout: logout
        };
    
        function userDashboard()
        {
            var deferred = $q.defer();
            var token = new Date().getMilliseconds();
            return $http({
                method : 'GET',
                url    : constantValues.SERVER_HOST + '/dashboard?token='+token,
                headers : {
                    'emcloginname': $rootScope.userHeaderName, 
                    'Content-Type': undefined
                }
            }).success(function(respData) {
                deferred.resolve(respData);
            }).error(function(errorData) {
                commonService.showAlert(errorData ,"Error while getting userDashboard data");
            });

            return deferred.promise;
        }
        function isUserLoggedin(){
            var deferred = $q.defer();
            var token = new Date().getMilliseconds();
            return $http({
                method : 'GET',
                url    : constantValues.SERVER_HOST + '/isUserLoggedIn?token=' + token,
            }).success(function(respData) {
			
                deferred.resolve(respData);			
            }).error(function(errorData) {
                deferred.reject("Error while getting userdata");
            });

            return deferred.promise;
        };
        
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
    
    }]);

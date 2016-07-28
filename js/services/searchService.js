myApp.factory("searchService", 
    ['$http', '$q', '$rootScope', 'commonService', 'constantValues',
    function($http, $q, $rootScope, commonService, constantValues) {
    
        return{
            searchFor : searchFor
        };
    
        function searchFor(searchText)
        {
		var deferred = $q.defer();
		var token = new Date().getMilliseconds();
		return $http({
			method : 'GET',
			url    : constantValues.SERVER_HOST + '/search/'+searchText+'?token=' + token,
			headers : {'emcloginname': $rootScope.userHeaderName}
		}).success(function(respData) {
			
			deferred.resolve(respData);			
		}).error(function(errorData) {
			deferred.reject("Error while getting search data");
		});

		return deferred.promise;
	};
        
    }]);

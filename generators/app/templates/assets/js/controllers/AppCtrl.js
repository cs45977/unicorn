/**
 * AppCtrl
 *
 * @type {angular.controller}
 * @module  <%=unicorn.module %>
 * @description  The UI container for the application experience.
 *
 *               ## Primary responsibilities:
 *               Set a global scope
 *
 */

angular.module('<%=unicorn.module %>')
.controller('AppCtrl', [
        '$scope', '$rootScope', '$state', '$q', '$mdSidenav', '$mdTheming', 'uiMe', 'uiList', 'uiErrorBus',
function($scope, $rootScope, $state, $q, $mdSidenav, $mdTheming, uiMe, uiList, uiErrorBus) {

  window.uiMe = uiMe;
  $scope.uiMe = uiMe;

  window.theme = $mdTheming;

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // When the application is initially rendered
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  // Make colors available to templates for SVG icons
  $scope.mdColors = {
    primary: '<%=unicorn.color.primary.palette[500] %>',
    accent: '<%=unicorn.color.accent.palette[400] %>'
  };

  // Create promise for app ready state
  var appReady = $q.defer();
  $rootScope.appReady = appReady.promise;

  $rootScope.appReady.then(function onReady(){
    
  })
  .catch(function onError(err){
    
  })
  .finally(function eitherWay(){
    uiMe.syncing.app = false;
  });

  // Fetch current user data from server
  uiMe.fetch()
  .then(function loggedIn(){

    // Fetch widgets from server
    // uiList.fetch({
    //   belongingTo: uiMe.id
    // });

  }).catch(function notLoggedIn(err){

    //appReady.reject(err);

  })
  .finally(function eitherWay(){
    appReady.resolve();
  });

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // DOM Events
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    $scope.intent.closeSidenav();
  });

  $scope.intent = angular.extend($scope.intent||{}, {

    toggleSidenav: function(navTarget){
      if(navTarget === 'links'){
        $mdSidenav('links').toggle();
        $mdSidenav('account').close();
      }
      else if(navTarget === 'account'){
        $mdSidenav('account').toggle();
        $mdSidenav('links').close();
      }
    },

    closeSidenav: function(){
      $mdSidenav('links').close();
      $mdSidenav('account').close();
    }

  });

}]);

'use strict'

angular.module('todoAngular', ['firebase', 'restangular', 'ui.router'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: '../js/states/login.html'
    })
    
    .state('todo', {
      url: '/todo',
      templateUrl: '../js/states/todo.html'
    })
  
  $urlRouterProvider.otherwise('/login');
    
})

.factory('Firebase', function(){
  return new Firebase("https://todangular.firebaseio.com/");
})

/**
* Auth(entication) Service
*
* @method {Promise} login
* @method {undefined} logout
* @method {undefined} onAuth
*
* @TODO: make onAuth return a Promise?
*/
.factory('Auth', function(Firebase, $firebaseAuth, $firebase){
  var auth = $firebaseAuth(Firebase);
  var currentUser = {};

  return {
    /**
    * Wrapper for `$firebaseAuth.$onAuth()` that filters the `auth` object
    * through the `updateUser()` function
    */
    onAuth: function(cb){
      auth.$onAuth(function(data){
        cb(updateUser(data));
      });
    },
    /**
    * Wrapper for `$firebaseAuth.$authWithOAuthPopup()` that invokes the
    * correct provider code.
    */
    login: function($location){
         console.log("Hello?!")
      return auth.$authWithOAuthPopup('facebook')
    },

    loggedIn: function(){
      if(auth.$getAuth()){
        return true;
      }
    },
    /**
    * Wrapper for `$firebaseAuth.$unauth()`
    */
    logout: function($location){
      auth.$unauth();
    },
    /**
    *Get the current user.
    */
    getUser: function(){
      return currentUser;
    }
  }; // END service

  /**
  * Tranform the `authdUser` object from `$firebaseAuth` into a full User
  * record in the `/users` collection.
  *
  * @param {Object} authdUser from $firebaseAuth.getAuth()
  * @return {Object} from $firebase.$asObject()
  */
  function updateUser(authdUser){
    if ( authdUser === null ){
      return null;
    }

    /**
    * Create a reference to the users collection within Firebase
    * Then create a child of the users collection named after the
    * authdUser's Facebook ID
    */
    var user = Firebase.child('Users').child(authdUser.facebook.id);

    // Update the authdUser's information in Firebase
    user.update({
      uid: authdUser.facebook.id,
      facebook: authdUser.facebook,
      fullName: authdUser.facebook.displayName,
      avatarUrl: authdUser.facebook.cachedUserProfile.picture.data.url,
    });

    // Set user to the object reference of authdUser
    user = $firebase(Firebase
      .child('Users')
      .child(authdUser.facebook.id)
    ).$asObject();

    //stores the user information for use elsewhere
    currentUser = user;

    return user;
   }
  }) // END updateUser


'use strict'

angular.module('todoAngular', ['firebase', 'restangular', 'ui.router'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'states/login.html'
    })
    
    .state('todo', {
      url: '/todo',
      templateUrl: 'states/todo.html'
    })
  
  $urlRouterProvider.otherwise('/login');
    
})

.factory('Firebase', function(){
  return new Firebase("https://todangular.firebaseio.com/Todos");
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
    var user = Firebase.child('users').child(authdUser.facebook.id);

    // Update the authdUser's information in Firebase
    user.update({
      uid: authdUser.facebook.id,
      facebook: authdUser.facebook,
      fullName: authdUser.facebook.displayName,
      avatarUrl: authdUser.facebook.cachedUserProfile.picture.data.url,
    });

    // Set user to the object reference of authdUser
    user = $firebase(Firebase
      .child('users')
      .child(authdUser.facebook.id)
    ).$asObject();

    //stores the user information for use elsewhere
    currentUser = user;

    return user;
   }
  }) // END updateUser

.controller('MainCtrl', function(filterFilter, $firebase, Firebase, Auth){
    var self = this,
    ref = Firebase,
    sync = $firebase(ref);
    this.todos = sync.$asArray();
    
    


// Empty input
    this.newTodo = '';
// Empty array to push into
    this.todoList = [];
// Length of Array todo for item count intialize
    this.itemsLeft =  self.todoList.length
    this.completeFilter = filterFilter(this.todoList, {completed:true}).length
// Default to no editing mode
    this.todoEdit = false;

// Add new todo on submit
    this.addTodo = function(){
        
        var newTask = this.newTodo.trim();
        var list = this.todoList;
        
        if(newTask.length === 0){
            console.log("boo")
            return;
        }
        // Push new objects into the array with default values
            list.push({
                "label": newTask,
                "input": newTask,
                "todoEdit": false,
                "completed": false,
                "active": true
            });
        
        this.todos.$add({content: newTask}).then(function(newChildRef) {
  console.log("added record with id " + newChildRef.key());
   });
        // Return new todo input to empty and increment counter
            this.itemsLeft = this.todoList.length
            return this.newTodo = '';   
        }
    
// Adds completed == true to object in array
    this.done = function(todos){
        todos.active = false;
        return todos.completed = true;
    }
    
// Add editing class on DoubleClick
    this.editTodo = function(todo){
       return todo.todoEdit = true;
    }
    
// Submitting edits
    this.editing = function(todos){
        var list = this.todoList;
        
        // Checks to see if todo was erased
        if(todos.label.length == 0){
            list.splice(list.indexOf(todos), 1)
        }
        todos.todoEdit = false;
    }
    
// Delete individual todos
    this.deleteTodo = function(id){
        console.log(id)
//        this.todoList.splice(this.todoList.indexOf(todos), 1);
//        self.items = self.todoList.length;
        this.todos.$remove(id);
    }
    
// Add completed for strikethrough
    this.completed = function(todo){
       return todo = true;
          
    }
        
// Deletes all todos marked completed 
    this.clearCompleted = function(){
        var list = this.todoList;
        
        this.todoList = list.filter(function(todo){
            
            return todo.completed == false;
        });
        self.items = self.todoList.length;
    }
    
// Show the clear completed option when a todo is checked off
    this.noComplete = function(){
        var list = this.todoList;
        
        if(this.todoList.some(this.completed)){
            return true;
        }
        return false;
    }
    
// Check off every todo at once
    this.allCompleted = function(allDone){
        var list = this.todoList
        if(allDone == true){
            list.forEach(function(todo){
                self.itemsLeft = 0;
                return todo.completed = true;
            })
            
        }
        else {
            list.forEach(function(todo){
                self.itemsLeft = list.length
                return todo.completed = false;
            })
        }
    }
    
    this.login = Auth.login;

  this.logout = Auth.logout;

  Auth.onAuth(function(user){
    self.user = user;
              console.log(user)
    if (user === null ){
      return $location.path('/login')
    }
    else {
      return $location.path('/main')
    }
  });

  this.loggedIn = Auth.loggedIn;

  this.outDoor = function(){
    if($location.path() === "/login"){
      return false;
    }
    else {
      return true;
    }
  }
  
  this.goHome = function(){
    if($location.path() === "/" || $location.path() === "/login" || $location.path() === "/main"){
      return false;
    }
    else {
      return true;
    }
  }
})



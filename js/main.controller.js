'use strict'

angular.module('todoAngular')

.controller('MainCtrl', function(filterFilter,$firebase,Auth,$location){
    var self = this,
    ref = new Firebase("https://todangular.firebaseio.com/Users" + Auth.getUser().uid + "Todos"),
    sync = $firebase(ref);
    this.todos = sync.$asArray();
    
    this.login = Auth.login;

  this.logout = Auth.logout;

  Auth.onAuth(function(user){
    self.user = user;
              console.log(user)
    if (user === null ){
      return $location.path('/login')
    }
    else {
      return $location.path('/todo')
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
    
})


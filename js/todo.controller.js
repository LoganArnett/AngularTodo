'use strict'

angular.module('todoAngular')

.controller('TodoCtrl', function($firebase,Auth,$location){
    var self = this,
    ref = new Firebase("https://todangular.firebaseio.com/Users/" + Auth.getUser().$id + "/Todos"),
    sync = $firebase(ref);

    this.todos = sync.$asArray();

    this.active = function(){
        this.todos.forEach(function(todos){
        console.log(todos.completed)
    })
    };

   this.productIndex = function(index){
     console.log(index);
   }
// Empty input
    this.newTodo = '';
// Empty array to push into
    this.todoList = [];
// Length of Array todo for item count intialize
    this.itemsLeft =  self.todoList.length
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

        this.todos.$add({content: newTask, completed: false}).then(function(newChildRef) {
  console.log("added Todo with id " + newChildRef.key());
   });
        // Return new todo input to empty and increment counter
            this.itemsLeft = this.todoList.length
            return this.newTodo = '';
        }
    this.userTodo = "https://todangular.firebaseio.com/Users/" + Auth.getUser().$id + "/Todos/";

// Adds completed == true to object in array
    this.done = function(todos){

        var taskRef = new Firebase(this.userTodo + todos.$id);
        var fireTodo = $firebase(taskRef);

        console.log(todos)

        if(todos.completed == true){
            fireTodo.$set({
                content: todos.content,
                completed: true});
        }
        else {
            fireTodo.$set({
                content: todos.content,
                completed: false});
        }

    }

// Add editing class on DoubleClick
    this.editTodo = function(todo){
       return todo.todoEdit = true;
    }

// Submitting edits
    this.editing = function(todos){

        var taskRef = new Firebase(this.userTodo + todos.$id);
        var fireTodo = $firebase(taskRef);

        var list = this.todoList;
        console.log(todos.content.length)
        // Checks to see if todo was erased
        if(todos.content.length == 0){
            fireTodo.$remove();
        }
        else {
            fireTodo.$update({
                content: todos.content,
                completed: todos.completed
            })
        }
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

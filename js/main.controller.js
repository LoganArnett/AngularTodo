'use strict'

angular.module('todoAngular')

.controller('MainCtrl', function($firebase,Auth,$location){
    var self = this;
    
    this.login = Auth.login;

    this.logout = Auth.logout;

    Auth.onAuth(function(user){
      self.user = user;
      console.log(self.user)
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
      if($location.path() === "/" || $location.path() === "/login" || $location.path() === "/todo"){
        return false;
      }
      else {
        return true;
      }
    }
    
})


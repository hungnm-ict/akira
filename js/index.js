/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        hasViewPermission();
        i18n.init({lng:"vi",resGetPath:'../../locales/__lng__/__ns__.json'},function(){
          $('body').i18n();
        }); 
       
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

};

function changeLang(code,val){
    window.sessionStorage.setItem("locale",code);
    window.sessionStorage.setItem("selectedLang",val)
    window.location.reload();
}

/**
 * Check current user have permission to view current page or not.
 * @return {Boolean}  
 */
function hasViewPermission(){
    return sessionStorage.getItem("authorized")==="true";
}

/**
 * Navigate to specific page
 * @param  {[type]} page Page to navigate to
 * @return {[type]}      [description]
 */
function navigateTo(page){
  window.location.href=page.trim();
}

function loadPartialView(){

}

function getUser(){
  return JSON.parse(sessionStorage.user);
}

function ajaxGetScoreFromJs(movieName) {
    /*var loggedin = 17;
    if (loggedin != 0) { 
      jQuery(".flashmovie object")[0].ajaxGetScore(2220,900,2000,"");
    } else{
      jQuery(".flashmovie object")[0].ajaxGetScore(0,0,0,"");
    }*/ 
} 

function ajaxSaveScore(exp,gold,lesson,lessonStage){
/*    var data = {
      action: 'akira_save_score',
      exp: exp,
      gold: gold,
      lesson: lesson,
      lessonStage: lessonStage
    };  

    jQuery.post("http://akira.edu.vn/wp-admin/admin-ajax.php", data, function(response) {
      console.log(response);
    });
  }*/ 
}

function get(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
    return "";
} 
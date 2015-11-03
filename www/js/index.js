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
"use strict";

var info = null;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
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

        //console.log('Received Event: ' + id);
    },

    reminderSelect: function () {
        var options = {
            date: new Date(),
            mode: 'time'
        };

        function onSuccess(date) {
            //navigator.notification.alert('Selected date: ' + date);
            app.reminderAdd(date);
        }

        function onError(error) { // Android only
            navigator.notification.alert('Error: ' + error);
        }

        // let user select time:
        datePicker.show(options, onSuccess, onError);
    },

    reminderAdd: function (date) {
        var now = new Date();
        if(date < now){ // time selected is in the past
            // add a day:
            date.setDate(date.getDate() + 1);
        }

        cordova.plugins.notification.local.hasPermission(function(granted){
            if(granted == true) {
                cordova.plugins.notification.local.schedule({
                    id: 1,
                    text: "Time to meditate",
                    every: "day",
                    at: date,
                    led: "FF0000",
                    sound: null
                });
                navigator.notification.alert('Daily reminders begins at: ' + date);
            } else {
                cordova.plugins.notification.local.registerPermission(function(granted) {
                    if(granted == true) {
                        cordova.plugins.notification.local.schedule({
                            id: 1,
                            text: "Time to meditate",
                            every: "day",
                            at: date,
                            led: "FF0000",
                            sound: null
                        });
                    } else {
                        navigator.notification.alert("Reminder cannot be added because app doesn't have permission");
                    }
                });
            }
        });
    },

    reminderCancel: function(){
        cordova.plugins.notification.local.cancel(1, function () {
            // Notification was cancelled
        }, scope);
    }
};

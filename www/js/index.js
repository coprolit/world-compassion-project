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

        if(!localStorage.getItem("rp_data"))
        {
            var rp_data = {data: []};
            localStorage.setItem("rp_data", JSON.stringify(rp_data));
        }
        info = JSON.parse(localStorage.getItem("rp_data"));

        app.add_reminder_test();

        console.log('Received Event: ' + id);
    },

    schedule: function (id, title, message, schedule_time) {
        cordova.plugins.notification.local.schedule({
            id: id,
            title: title,
            message: message,
            at: schedule_time
        });
        var array = [id, title, message, schedule_time];
        info.data[info.data.length] = array;
        localStorage.setItem("rp_data", JSON.stringify(info));
        navigator.notification.alert("Reminder added successfully")
    },

    add_reminder: function () {
        var date = document.getElementById("date").value;
        var time = document.getElementById("time").value;
        var title = document.getElementById("title").value;
        var message = document.getElementById("message").value;
        if(date == "" || time == "" || title == "" || message == "")
        {
            navigator.notification.alert("Please enter all details");
            return;
        }
        var schedule_time = new Date((date + " " + time).replace(/-/g, "/")).getTime();
        schedule_time = new Date(schedule_time);

        var id = info.data.length;
        cordova.plugins.notification.local.hasPermission(function(granted){
            if(granted == true)
            {
                app.schedule(id, title, message, schedule_time);
            }
            else
            {
                cordova.plugins.notification.local.registerPermission(function(granted) {
                    if(granted == true)
                    {
                        app.schedule(id, title, message, schedule_time);
                    }
                    else
                    {
                        navigator.notification.alert("Reminder cannot be added because app doesn't have permission");
                    }
                });
            }
        });
    },
    add_reminder_test: function () {
        //navigator.notification.alert("add_reminder_test()");

        var now             = new Date().getTime(),
            _5_sec_from_now = new Date(now + 5*1000);

        cordova.plugins.notification.local.hasPermission(function(granted){
            if(granted == true) {
                cordova.plugins.notification.local.schedule({
                    text: "Delayed Notification",
                    at: _5_sec_from_now,
                    led: "FF0000",
                    sound: null
                });
            } else {
                cordova.plugins.notification.local.registerPermission(function(granted) {
                    if(granted == true) {
                        cordova.plugins.notification.local.schedule({
                            text: "Delayed Notification",
                            at: _5_sec_from_now,
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

    hasPermission: function() {
        cordova.plugins.notification.local.hasPermission(function (granted) {
            navigator.notification.alert("granted? " + (granted ? 'Yes' : 'No'));
        });
    }
};

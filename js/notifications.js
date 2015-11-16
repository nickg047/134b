// from Mozilla Dev Network
// modified for modular use in our app


var notifications = {
    timer: 3000,
    pushNotify: function(strToDisplay){
        if (Notification.permission === "granted") {
            // If it's okay, create a notification
            var notification = new Notification(strToDisplay);
        }

        // Otherwise, ask the user for permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                // If the user accepts, create a notification
                if (permission === "granted") {
                    var notification = new Notification(strToDisplay);
                }
            });
        }
    },
    keepNotifying: true,
    stopNotifying: function(){
        notifications.keepNotifying = false;
    },
    numHabits: 3,
    notifyStr: " placeholder ",
    buildNotifyStr: function(){
        notifications.notifyStr = "You have ".concat(notifications.numHabits.toString()).concat(" unresolved Habits");
    },
    startNotification: function() {
        setTimeout(function() {
            if (notifications.keepNotifying) {
                notifications.buildNotifyStr();
                notifications.pushNotify(notifications.notifyStr);
            }
            if (notifications.keepNotifying) {
                notifications.startNotification();
            }
        }, notifications.timer);
    }
};

/*
 notify.pushNotify = function(strToDisplay) {
 if (Notification.permission === "granted") {
 // If it's okay, create a notification
 var notification = new Notification(strToDisplay);
 }

 // Otherwise, ask the user for permission
 else if (Notification.permission !== 'denied') {
 Notification.requestPermission(function (permission) {
 // If the user accepts, create a notification
 if (permission === "granted") {
 var notification = new Notification(strToDisplay);
 }
 });
 }
 };*/

// might not be used
// more for understanding concept
/*
 notify.delayedNotification = function(strToDisplay, timerInMiSeconds){

 setTimeout(function(){
 if (Notification.permission === "granted") {
 // If it's okay, create a notification
 var notification = new Notification(strToDisplay);
 }
 // Otherwise, ask the user for permission
 else if (Notification.permission !== 'denied') {
 Notification.requestPermission(function (permission) {
 // If the user accepts, create a notification
 if (permission === "granted") {
 var notification = new Notification(strToDisplay);
 }
 });
 }
 }, timerInMiSeconds);
 };
 */

/*
 notify.stopNotification = false;

 notify.killNotification = function(){
 notify.stopNotification = true;
 };

 notify.createNotification = function(notifyStr){
 setTimeout(function(){
 if(notify.stopNotification == false) {
 notify.pushNotify(notifyStr);
 }
 if(notify.stopNotification == false) {
 notify.createNotification(notifyStr);
 }
 }, 3000);

 };
 */
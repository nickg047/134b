var notifications = {
    timer: 3000,
    updateTimer: function(timer){
        notifications.timer = timer;
    },
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
    numHabits: 0,
    updateNumHabits: function(num){
        notifications.numHabits = num;
    },
    keepNotifying: function(){
        if(notifications.numHabits){
            return true;
        } else {
            return false;
        }
    },
    notifyStr: function(){
        return "You have ".concat(notifications.numHabits.toString()).concat(" incomplete tasks");
    },
    startNotification: function() {
        setTimeout(function() {
            if (notifications.keepNotifying()) {
                notifications.pushNotify(notifications.notifyStr());
            }
            if (notifications.keepNotifying()) {
                notifications.startNotification();
            }
        }, notifications.timer);
    }
};
// from Mozilla Dev Network
// modified for modular use in our app
function pushNotify(strToDisplay) {
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
}

function delayedNotification(strToDisplay, timerInMiSeconds){

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
}

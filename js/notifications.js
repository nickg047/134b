// from Mozilla Dev Network
// modified for modular use in our app
function pushNotify(strToDisplay) {
  // Check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
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

function createNotification(strToDisplay, timerInMiSeconds){
    setTimeout(pushNotify(strToDisplay), timerInMiSeconds);
}


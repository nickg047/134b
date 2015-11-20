var notifications = {
    numHabits: 0, // number of today's incomplete habits, set by updateTodaysHabits()
	displayPageLoadNotifications: true, // sets whether to display notifications on page load
    // timer object holds all the variables and functions that control the timer
    // variable behavior. Used to try and keep timer data valid for ensuring
    // desired performance and operation
    timer:{
        currentTimer: 0, // the current timer value
        intervalTimer: null, // stores the interval timer object
        oneSecond: 1000, // the number of timer units in a second
        oneMinute: 1000 * 60, // the number of timer units in a minute
        oneHour: 1000 * 60 * 60, // the number of timer units in an hour

        // converts a given number of seconds into timer units
        convertSecondsToTimerUnits: function(seconds) {
            return seconds * notifications.timer.oneSecond;
        },

        // converts a given number of minutes into timer units
        convertMinutesToTimerUnits: function(minutes){
            return minutes * notifications.timer.oneMinute;
        },

        // converts a given number of hours into timer units
        convertHoursToTimerUnits: function(hours){
            return hours * notifications.timer.oneHour;
        },

        // converts the given number of timer units into seconds
        convertTimerUnitsToSeconds: function(timerUnits){
            return timerUnits / notifications.timer.oneSecond;
        },

        // converts the given number of timer units into minutes
        convertTimerUnitsToMinutes: function(timerUnits){
            return timerUnits / notifications.timer.oneMinute;
        },

        // converts the given number of timer units into hours
        convertTimerUnitsToHours: function(timerUnits){
            return timerUnits / notifications.timer.oneHour;
        },

        // direct sets the timer assuming input is in timer units
        setTimerRaw: function(timerUnits){
            notifications.timer.currentTimer = timerUnits;
            notifications.timer.clearTimer();
            notifications.startNotification();
        },

        // converts the given number of seconds into timer units and sets the timer
        setTimerInSeconds: function(seconds){
            notifications.timer.setTimerRaw(notifications.timer.convertSecondsToTimerUnits(seconds));
        },

        // converts the given number of minutes into timer units and sets the timer
        setTimerInMinutes: function(minutes){
            notifications.timer.setTimerRaw(notifications.timer.convertMinutesToTimerUnits(minutes));
        },

        // converts the given number of hours into timer units and sets the timer
        setTimerInHours: function(hours){
            notifications.timer.setTimerRaw(notifications.timer.convertHoursToTimerUnits(hours));
        },

        // returns the current value of the timer in timer units
        getCurrentTimerRaw: function(){
            return notifications.timer.currentTimer;
        },

        // returns the current value of the timer in seconds
        getCurrentTimerSeconds: function(){
            return notifications.timer.convertTimerUnitsToSeconds(notifications.timer.getCurrentTimerRaw());
        },

        // returns the current value of the timer in minutes
        getCurrentTimerMinutes: function(){
            return notifications.timer.convertTimerUnitsToMinutes(notifications.timer.getCurrentTimerRaw());
        },

        // returns the current value of the timer in hours
        getCurrentTimerHours: function(){
            return notifications.timer.convertTimerUnitsToHours(notifications.timer.getCurrentTimerRaw());
        },

        // stops the interval timer
        clearTimer: function(){
            if(notifications.timer.intervalTimer != null) {
                clearInterval(notifications.timer.intervalTimer);
            }
        }
    },

    // create a push notification that displays the string passed to the function
    pushNotify: function(strToDisplay){
        if (Notification.permission === "granted") {
            // If it's okay, create a notification
            new Notification(strToDisplay);
        }

        // Otherwise, ask the user for permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                // If the user accepts, create a notification
                if (permission === "granted") {
                    new Notification(strToDisplay);
                }
            });
        }
    },

    // from list.js
    // used to get all habits from the local storage
    getAllHabits: function(){
        var habits = JSON.parse(localStorage.getItem("Habits"));
        if (!habits){
            habits = [];
            localStorage.setItem("Habits", JSON.stringify(habits));
        }
        return habits;
    },

 
    //updateHabit(habitToUpdate) from list.js
    //Takes in a habit as a parameter and swaps it into the habit object list 
    //and re-writes this into the database.
    updateHabit: function(habitToUpdate){
        var habits = getAllHabits();
        var habit;
        for (var i = 0; i < habits.length; i++){
            habit = habits[i];
            if (habitToUpdate.id === habit.id){
                habits[i] = habitToUpdate;
                localStorage.setItem("Habits", JSON.stringify(habits));
                return;
            }
        }
    },
    
    // from list.js
    // used to filter out habits that do/do not occur today
    todayIsUpdateDay: function(habit){
        var date = new Date();
        var day = date.getDay();
        date = null;
        //if you didn't select today as a day that you shouldn't update your habits
        if (habit.weekFreq[day] === 0){
            return false;
        }
        return true;
    },

    // from list.js
    // used to check if a given habit has been completed
    completedHabit: function(habit){
        return habit.ticks == habit.dailyFreq;
    },

    // sets numHabits to the number of habits that are currently incomplete for today
    // if a habit has not reached its goal frequency reset its currentStreak
    updateTodaysHabits: function(){
        var habitsList = notifications.getAllHabits();
        var counter = 0;
        var result = 0;
        for(counter = 0; counter < habitsList.length; counter++){
            var currentHabit = habitsList[counter];
            if(notifications.todayIsUpdateDay(currentHabit)){
                if(!notifications.completedHabit(currentHabit)){
                    result++;
			    currentHabit.currentStreak = 0;
			    updateHabit(currentHabit);
                }
            }
        }
        notifications.numHabits = result;
    },

    // begin displaying push notifications at the interval specified in timer
    // if timer is set to stop, the function will continue to execute however no
    // notifications will be displayed.
    // Also, no notifications are displayed if numHabits is 0.
    startNotification: function() {
        notifications.timer.intervalTimer = setInterval(function () {
            notifications.updateTodaysHabits();
            if (notifications.numHabits != 0) {
                notifications.pushNotify("You have ".concat(notifications.numHabits.toString()).concat(" incomplete tasks"));
            }
        }, notifications.timer.getCurrentTimerRaw());
    },

    // stops new push notifications from being displayed until resumeNotifications is called
    disableNotifications: function(){
        notifications.timer.clearTimer();
    },

	// call this function to display notifications on page load
	pageLoadNotifications: function(){
		if(notifications.displayPageLoadNotifications){
			notifications.updateTodaysHabits();
        	if (notifications.numHabits != 0) {
        		notifications.pushNotify("You have ".concat(notifications.numHabits.toString()).concat(" incomplete tasks"));
        	}
		}
	}
};

/******************************************************************************************************
 * This Section sets up and launches the notification system for any page that includes this .js file *
 ******************************************************************************************************/

// set the notification interval and starts the timer
notifications.timer.setTimerInHours(1);

// display notification on page load
// set notifications.displayPageLoadNotifications to false to disable
// notifications.displayPageLoadNotifications = false;
notifications.pageLoadNotifications();

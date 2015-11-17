var notifications = {
    timer: 0,
    setTimer: function(timer){
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
    getAllHabits: function(){
        var habits = JSON.parse(localStorage.getItem("Habits"));
        if (!habits){
            habits = [];
            localStorage.setItem("Habits", JSON.stringify(habits));
        }
        return habits;
    },
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
    completedHabit: function(habit){
        return habit.ticks == habit.dailyFreq;
    },
    numHabits: 0,
    updateNumHabits: function(num){
        notifications.numHabits = num;
    },
    updateNumOfHabitsForToday: function(){
        var habitsList = notifications.getAllHabits();
        var counter = 0;
        var result = 0;
        for(counter = 0; counter < habitsList.length; counter++){
            var currentHabit = habitsList[counter];
            if(notifications.todayIsUpdateDay(currentHabit)){
                if(!notifications.completedHabit(currentHabit)){
                    result++;
                }
            }
        }

        notifications.updateNumHabits(result);
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
        if (notifications.timer) {
            setTimeout(function () {
                notifications.updateNumOfHabitsForToday();
                if (notifications.keepNotifying()) {
                    notifications.pushNotify(notifications.notifyStr());
                }
                notifications.startNotification();
            }, notifications.timer);
        }
    }
};

notifications.setTimer(3000);
notifications.startNotification();
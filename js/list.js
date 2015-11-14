function getAllHabits(){
    var habits = JSON.parse(localStorage.getItem("Habits"));
    if (!habits){
        habits = [];
        localStorage.setItem("Habits", JSON.stringify(habits));
    }
    return habits;
}

//habitId needs to be an integer
function getHabitById(habitId){
    var habits = getAllHabits();
    var habit;
    for (var i = 0; i < habits.length; i++){
        habit = habits[i];
        if (habitId === habit.id){
            return habit;
        }
    }
}

function deleteHabit(habitId){
    var habits = getAllHabits();
    habitId = parseInt(habitId);
    var habit;
    for (var i = 0; i < habits.length; i++){
        habit = habits[i];
        if (habitId === habit.id){
            habits.splice(i, 1);
            break;
        }
    }
    localStorage.setItem("Habits", JSON.stringify(habits));
}

function updateHabit(habitToUpdate){
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
}

function updateHabitUI(){
    var habits = getAllHabits();
    var listItem;  //type is HTML ListItem
    var list = document.getElementById('habit-list');
    var habit;

    for (var i = 0; i < habits.length; i++){
        habit = habits[i];
        listItem = makeHtmlElement(habit);
        list.appendChild(listItem);
    }

    JSON.parse(localStorage.getItem("Habits"));
}
updateHabitUI();

function makeHtmlElement(habit){
    var listItem = document.createElement('li');
    listItem.id = habit.id;
    var elementTemplate = document.getElementById('template').innerHTML;
    listItem.innerHTML = elementTemplate;

    //Title
    listItem.getElementsByClassName("habit-name")[0].innerHTML = habit.title;

    //Image
    listItem.getElementsByClassName("habit-icon")[0].src = habit.image;
    listItem.getElementsByClassName("habit-name")[0].innerHTML.alt = habit.image.substring(habit.image.lastIndexOf("/")+1);
    //Stats
    listItem.getElementsByClassName("message-total")[0].children[0].innerHTML = habit.currentStreak;
    listItem.getElementsByClassName("message-total")[0].children[1].innerHTML = habit.bestRecord;
    //----->CHANGE HERE if not supposed to use ticks
    setCompletionText(listItem, habit);

    if(!todayIsUpdateDay(habit)){  //TODO hide green button
        hideCompleteButton();
    }
    if(completedHabit(habit)){
        showTodaysCompletions(listItem);
        hideCompleteButton();
    }
    return listItem;
}

function setCompletionText(listElement, habit){
    listElement.getElementsByClassName("message-today")[0].children[0].innerHTML = ""+habit.ticks+"/"+habit.dailyFreq;
}

function todayIsUpdateDay(habit){
    var date = new Date();
    var day = date.getDay();
    date = null;
    if (habit.weekFreq[day] === 0){  //if you didn't select today as a day that you should update your habits
        return false;
    }
    return true;
}

function showTodaysCompletions(listElement){
    var msgElement = listElement.getElementsByClassName("message-today")[0];
    msgElement.style.visibility="visible";
}

function completedHabit(habit){
    return habit.ticks == habit.dailyFreq;
}

function hideCompleteButton(){

}

/*  

makeHtmlElement should now be taking care of this

//Update the UI for an individual habit using the info from database                
function detailHabit(id_param){
    //Get the habit to modify and the database info for it
    var habitMod = document.getElementById(("HABIT"+id_param));
    var habitInfo = isolateHabit(id_param);
    //Title
    habitMod.getElementsByClassName("habit-name")[0].innerHTML = habitInfo.title;
    //Image
    habitMod.getElementsByClassName("habit-icon")[0].src = habitInfo.image;
    habitMod.getElementsByClassName("habit-name")[0].innerHTML.alt = habitInfo.image.substring(habitInfo.image.lastIndexOf("/")+1);
    //Stats
    habitMod.getElementsByClassName("message-total")[0].children[0].innerHTML = habitInfo.currentStreak;
    habitMod.getElementsByClassName("message-total")[0].children[1].innerHTML = habitInfo.bestRecord;
    //----->CHANGE HERE if not supposed to use ticks
    habitMod.getElementsByClassName("message-today")[0].children[0].innerHTML = ""+habitInfo.ticks+"/"+parseInt(habitInfo.dailyFreq[0]);
    
    //Make it visible
    habitMod.parentNode.style.visibility="visible";
}*/

//Isolate the string and make it an object for a desire habit, called by id number
function isolateHabit(habitID){
    var _mainHabit = localStorage.getItem("Habits");
    if(_mainHabit !== null && typeof habitID == 'number'){
        var _idString = "\"id\":"+habitID;
        var habitString = _mainHabit.substring(_mainHabit.indexOf(_idString) -1);
        habitString = habitString.substring(0, habitString.indexOf("}")+1); 
    }
    return (JSON.parse(habitString));
}   

/*
    Used to show "completed x/y for today!" text when
    hitting the check mark
*/          
function showMsg(element){
    var msgElement = (element.parentNode.parentNode.getElementsByClassName("message-today"))[0];
    msgElement.style.visibility="visible";
}

/*
    Increment the ticks for how many times you performed the
    habit for today
    NOTE I WASN'T SURE WHAT TICKS WAS BUT I USED IT (I ASSUMED IT WAS EITHER TO = TIME)
*/
function completeHabit(id_param){
    var listElement = getHabitElement(id_param);
    var habitC = getHabitById(parseInt(listElement.id));
    habitC.ticks = habitC.ticks + 1;
    if (habitC.ticks > habitC.dailyFreq){
        habitC.ticks = habitC.dailyFreq;
    }
    
    //Only update the daily streaks once per day
    if(habitC.ticks === parseInt(habitC.dailyFreq)){
        if(habitC.ticks > habitC.currentStreak){
            habitC.currentStreak = habitC.ticks;
        }
        if(habitC.currentStreak > habitC.bestRecord){
            habitC.bestRecord = habitC.currentStreak;
        }
    }
    updateHabit(habitC);

    setCompletionText(listElement, habitC);
    showTodaysCompletions(listElement);
}

function getHabitElement(clickElement){
    return clickElement.parentNode.parentNode;
}

/*
    UI update of deleting a habit
    Called within deleteHabitLS(id_param)
      Could put nice UI effect to make it look pretty here
*/
function onDeletePress(id_param){
    var listItem = id_param.parentNode.parentNode;
    var listContainer = listItem.parentNode;

    var id = listItem.id;
    deleteHabit(id);

    listContainer.removeChild(listItem);
     
}
/*
    only works with backend
    id_param: id of the habit to be deleted
*/
function deleteHabitLS(id_param){
    var habitsDel = JSON.parse(localStorage.getItem("Habits"));
    var removed = false;
    for (var i = 0; i < habitsDel.length; i++){
        var habit = habitsDel[i];
        if(habit.id === id_param) {
            habitsDel.splice(i, 1);
            removed = true;
            i = i - 1;
        }
        if(habit.id > id_param && removed) {
            habit.id = habit.id - 1; 
        }
    }
    if(removed === true) {
        if(habitsDel.length === 0) {
            localStorage.removeItem("Habits");
        }
        else {
            localStorage.setItem("Habits", JSON.stringify(habitsDel));
        }
        deleteHabit(id_param);//For UI
    }
    else {
        alert("id does not exist");
    }
}
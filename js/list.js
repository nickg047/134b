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

    listItem.getElementsByClassName("op op-edit")[0].onclick = function onclick(event) {location.href='edit.html?id='+habit.id;}

    setCompletionText(listItem, habit);
    setMeter(listItem, habit);

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
    listElement.getElementsByClassName("message-total")[0].children[0].innerHTML = habit.currentStreak;
    listElement.getElementsByClassName("message-total")[0].children[1].innerHTML = habit.bestRecord; 
    listElement.getElementsByClassName("message-today")[0].children[0].innerHTML = ""+habit.ticks+"/"+habit.dailyFreq;
}

function todayIsUpdateDay(habit){
    var date = new Date();
    var day = date.getDay();
    date = null;
    //if you didn't select today as a day that you shouldn't update your habits
    if (habit.weekFreq[day] === 0){  
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

function setMeter(listItem, habit){
    var line1 = listItem.getElementsByClassName('meter')[0];
    var line2 = listItem.getElementsByClassName('meter')[1];

    var max = parseFloat(line2.getAttribute('x2'));

    //var fractionToBest = habit.bestRecord === 0 ? 0.0 : (habit.currentStreak * max)/habit.bestRecord;
    var tickProgToday = max * (habit.ticks/habit.dailyFreq);
    
    line1.setAttribute('x2', tickProgToday);
    line2.setAttribute('x1', tickProgToday);
}

/*
    Increment the ticks for how many times you performed the
    habit for today
*/
function completeHabit(id_param){
    var listElement = getHabitElement(id_param);
    var habitC = getHabitById(parseInt(listElement.id));

    if(habitC.ticks < habitC.dailyFreq){//If already there do nothing
        habitC.ticks = habitC.ticks + 1;
		if(completedHabit(habitC) && todayIsUpdateDay(habitC)){
		    habitC.currentStreak = 1 + habitC.currentStreak;
		}
		if(habitC.currentStreak > habitC.bestRecord){
		    habitC.bestRecord = habitC.currentStreak;
		}
    }
   updateHabit(habitC);
   setCompletionText(listElement, habitC);
   setMeter(listElement, habitC);
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
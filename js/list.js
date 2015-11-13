function getAllHabits(){
    var habits = JSON.parse(localStorage.getItem("Habits"));
    if (!habits){
        habits = [];
        localStorage.setItem("Habits", JSON.stringify(habits));
    }
    return habits;
}

function deleteHabit(habitId){
    var habits = getAllHabits();
    habitId = parseInt(habitId);
    
    for (var i = 0; i < habits.length; i++){
        habit = habits[i];
        if (habitId === habit.id){
            habits.splice(i, 1);
            break;
        }
    }
    localStorage.setItem("Habits", JSON.stringify(habits));
}

function test(){

}

//On load update the UI displayed for all habits if allowed
function updateHabitUI(){
    var habits = getAllHabits();
    console.log('what');
    var listItem;  //type is HTML ListItem
    var list = document.getElementById('habit-list');

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
    listItem.getElementsByClassName("message-today")[0].children[0].innerHTML = ""+habit.ticks+"/"+parseInt(habit.dailyFreq[0]);
    

    return listItem;
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
    //alert(msgElement.innerHTML);
    msgElement.style.visibility="visible";
}

/*
    Increment the ticks for how many times you performed the
    habit for today
    NOTE I WASN'T SURE WHAT TICKS WAS BUT I USED IT (I ASSUMED IT WAS EITHER TO = TIME)
*/
function completedHabit(id_param){
    var habitC = getAllHabits();
    habitC[id_param].ticks = habitC[id_param].ticks + 1;
    
    //Only update the daily streaks once per day
    if(habitC[id_param].ticks === parseInt(habitC[id_param].dailyFreq[0])){
        if(habitC[id_param].ticks > habitC[id_param].currentStreak){
            habitC[id_param].currentStreak = habitC[id_param].ticks;
        }
        if(habitC[id_param].currentStreak > habitC[id_param].bestRecord){
            habitC[id_param].bestRecord = habitC[id_param].currentStreak;
        }
    }
    //Update Database
    localStorage.setItem("Habits", JSON.stringify(habitC));
    
    detailHabit(id_param); 
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
    alert(getAllHabits().length);

    listContainer.removeChild(listItem);
    //updateHabitUI();
     
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
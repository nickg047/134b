//On load update the UI displayed for all habits if allowed
function updateHabitUI(){
    var habits = JSON.parse(localStorage.getItem("Habits"));
    if (!habits){
        habits = [];
        localStorage.setItem("Habits", JSON.stringify(habits));
        return;
    }
    var el;
    var listItem;
    var list = document.getElementById('habit-list');
    if(habits.length > 0 && habits[0].id == 0){
        detailHabit(0);
    }
    if(habits.length > 1 && habits[1].id == 1){
        detailHabit(1);
    }
    else{
        list.children[1].style.visibility = "hidden";
    }
    if(habits.length > 2 && habits[2].id == 2){
        detailHabit(2);
    }
    else{
        list.children[2].style.visibility = "hidden";
    }
/*
    for (var habit in habits){
        listItem = makeHabit(habit);
        list.appendChild(listItem);
    }
*/
    //alert('hi');
}

updateHabitUI();
	
function makeHabit(habit){
    var listItem = document.createElement('li');
    /*
    listItem.innerHTML = "<ul class="habit-info">
                <li><div class="habit-name">Exercise 30 minutes</div></li>
                <li><img class="habit-icon" src="../img/run.jpg" alt="habit icon"></li>
            </ul>
            
		    <div class="message">
                <span class="message-total">
                    <strong>48</strong> days in a row! Best Record: <strong>60</strong><br>
                    <svg height="25" width="150">
                        <line x1="0" y1="0" x2="120" y2="0" style="stroke:rgba(65, 131, 215, 0.8);stroke-width:25"></line>
                        <line x1="120" y1="0" x2="150" y2="0" style="stroke:rgba(171,171,171,0.6);stroke-width:25"></line>
                    </svg>
                </span><br>
                <span class="message-today">Completed <strong>1/2</strong> for today!</span>
            </div>
            <div class="habit-op">
                <button type="button" class="op op-done" onclick="showMsg(this);" title="done">
                    <img src="../img/done.svg" alt="Done">
                </button>
                <button type="button" class="op op-edit" onclick="location.href='edit.html'" title="edit habit">
                    <img src="../img/edit.svg" alt="Edit">
                </button>
                <button type="button" id="myid" class="op op-del" onclick="deleteHabit(this);" title="delete habit">
                    <img src="../img/delete.svg" alt="Del">
                </button>
            </div>";
		    */
}

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
    habitMod.getElementsByClassName("message-today")[0].children[0].innerHTML = ""+habitInfo.ticks+"/"+parseInt(habitInfo.dailyFreq[0])
    
    //Make it visible
    habitMod.parentNode.style.visibility="visible";
}

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
function deleteHabit(id_param){
    updateHabitUI();
    var habitsDelUI = JSON.parse(localStorage.getItem("Habits"));
    if(habitsDelUI.length == 0){
        location.href='add.html'; //If there are no habits left return to add page
    }   
}
/*
    only works with backend
    id_param: id of the habit to be deleted
*/
function deleteHabitLS(id_param){
    var habitsDel = JSON.parse(localStorage.getItem("Habits"));
    var removed = false;
    for (var i = 0; i < habitsDel.length; i++){
        habit = habitsDel[i];
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
function getAllHabits() {
    return JSON.parse(localStorage.getItem("Habits"));
}
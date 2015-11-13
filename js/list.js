//On load update the UI displayed for all habits if allowed
function updateHabitUI(){
    alert('hi');
    var habits = localStorage.getItem("Habits");
    if (!habits){
        habits = [];
        localStorage.setItem("Habits", JSON.stringify(habits));
        return;
    }
    var el;
    var listItem;
    var list = document.getElementById('habitlist');
    for (var habit in habits){
        listItem = makeHabit(habit);
        list.appendChild(listItem);
    }
}

updateHabitUI();
	
function makeHabit(habit){
    var listItem = document.createElement('li');
    listItem.innerHTML = '<ul class="habit-info">
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
            </div>';
}


//Update the UI for an individual habit using the info from database				
function detailHabit(habitID){
    //Get the habit to modify and the database info for it
    var habitMod = document.getElementById(("HABIT"+habitID));
    var habitInfo = isolateHabit(habitID);
    //Title
    habitMod.getElementsByClassName("habit-name")[0].innerHTML = habitInfo.title;
    //Image
    habitMod.getElementsByClassName("habit-icon")[0].src = habitInfo.image;
    habitMod.getElementsByClassName("habit-name")[0].innerHTML.alt = habitInfo.image.substring(habitInfo.image.lastIndexOf("/")+1);
    
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
    return JSON.parse(habitString);
}	
			
function showMsg(element){
    var msgElement = (element.parentNode.parentNode.getElementsByClassName("message-today"))[0];
    //alert(msgElement.innerHTML);
    msgElement.style.visibility="visible";
}

function deleteHabit(element){
    var child = element.parentNode.parentNode;
    var parent = child.parentNode;
    parent.removeChild(child);


}
/*
    only works with backend
    id_param: id of the habit to be deleted
*/
function deleteHabitLS(id_param){
    var habits = JSON.parse(localStorage.getItem("Habits"));
    var removed = false;
    for (var i = 0; i < habits.length; i++){
        habit = habits[i];
        if(habit.id === id_param) {
            habits.splice(i, 1);
            removed = true;
            break;
        }
    }
    if(removed === true) {
        if(habits.length === 0) {
            localStorage.removeItem("Habits");
        }
        else {
            localStorage.setItem("Habits", JSON.stringify(habits));
        }
    }
    else {
        alert("id does not exist");
    }
}
function getAllHabits() {
    return JSON.parse(localStorage.getItem("Habits"));
}
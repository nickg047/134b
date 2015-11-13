//On load update the UI displayed for all habits if allowed
function updateHabitUI(){
    var db = localStorage.getItem("Habits");
    if(db !== null){
        if(db.indexOf("\"id\":0") !== -1){
	    detailHabit(0);
	}
	if(db.indexOf("\"id\":1") !== -1){
	    detailHabit(1);
	}
        if(db.indexOf("\"id\":2") !== -1){
	    detailHabit(2);
	}
    }
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
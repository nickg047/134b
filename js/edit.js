var image = document.getElementById('icon3');
function selectImage(name) {
	//Clear all the other effects
	document.getElementById('icon1').style.border = "none";
	document.getElementById('icon2').style.border = "none";
	document.getElementById('icon3').style.border = "none";
	image = document.getElementById(name);
	image.style.border = "5px solid #42A5F5";
}
/*
	gets variables for habit from html form
	id_param: id of the habit to be updated (hardcoded. need to get it from list.html i think)
*/
function editFromUI() {
	var id_param = 0; //hardcoded
	var habits = JSON.parse(localStorage.getItem('Habits'));
    var i;
    if (habits === null) {		     
        i = 0;
    }
    else {
    	i = habits[habits.length-1].id + 1;
    }
	var habit = {
		id: id_param,
        title: document.getElementById('title').value,
        image: image.id,
        weekFreq: getCheckedBoxes('date'),
        dailyFreq: getCheckedBoxes('day'),
        other: document.getElementById('others').value
    };
    editHabit(habit);
}
/*
	only works with backend
	habit: habit to update
*/
function editHabit(habit) {
    var habits = JSON.parse(localStorage.getItem("Habits"));
	var i;
	var id_param = 0; //hardcoded
	for (i = 0; i < habits.length; i++){
		original_habit = habits[i];		  
        if(habit.id === original_habit.id) {
        	alert("i = " + i + "habit.id = " + habit.id);
            break;
    	}
    }
    habits[i] = habit;
    localStorage.setItem("Habits", JSON.stringify(habits));
}
function getCheckedBoxes(chkboxName) {
    var checkboxes = document.getElementsByName(chkboxName);
    var checkboxesChecked = [];
    for (var i=0; i<checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            checkboxesChecked.push(checkboxes[i].value);
        }
    }
    return checkboxesChecked.length > 0 ? checkboxesChecked : null;
}
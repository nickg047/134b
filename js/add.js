image = null;

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
*/
function addFromUI() {
    if (image === null){
        errorNeedToPickImage();
        return;
    }
    var habits = JSON.parse(localStorage.getItem('Habits'));
    var newHabitId;
    if (habits.length === 0){//Is so because initialized to Habits: []
        newHabitId = 0;
    }else {
        var prevHabit = habits[habits.length-1];
        newHabitId = prevHabit.id + 1;
    }
    var dailyCount;
    if(getCheckedBoxes('day') !== null){
       dailyCount = getCheckedBoxes('day');
    }
    else{
       dailyCount = [document.getElementById("others").value];
    }
	var habit = {
        id: newHabitId,
        title: document.getElementById('title').value,
        image: image.src,
        weekFreq: getCheckedBoxes('date'),
        dailyFreq: getDailyCount(),
        other: document.getElementById('others').value,
        ticks: 0,
        bestRecord: 0,
        currentStreak: 0,
        date: 0
    };
    addHabit(habit);
    location.href='list.html'; 
}

function errorNeedToPickImage(){ //this could also be preset, which is how it is in the todo list, so this error is never thrown
    alert('pick image');
}

function getDailyCount(){
    var daily = document.getElementById("others").value;
    if(isInt(daily)){
        return parseInt(daily, 10);
    }else{
        var checkBoxes = getCheckedBoxes('day');
        var day;
        for (var i = 0; i < checkBoxes.length; i++){
            day = checkBoxes[i];
            if (day){
                return i + 1;
            }
        }
        return i;
    }
}

function isInt(data){
    if (data != parseInt(data, 10))
        return false;
    data = parseInt(data, 10);
    if (data < 1){
        return false;
    }
    return true;
}
/*
	gets called from addFromUI() 
	habit: habit to be added 
*/
function addHabit(habit) {       
    		        
    //Get stored data
    var habits = JSON.parse(localStorage.getItem('Habits'));
    //If no stored data, create empty array
    if (habits === null) {
        habits = [];
    }

    //Add new entry to stored array
    habits.push(habit);

    //Save array
    localStorage.setItem("Habits", JSON.stringify(habits));
    return true;		        			    
}
function getCheckedBoxes(chkboxName) {
    var checkboxes = document.getElementsByName(chkboxName);
    var checkboxesChecked = [];
    for (var i=0; i<checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            checkboxesChecked.push(1);
        }else{
            checkboxesChecked.push(0);
        }
    }
    return checkboxesChecked.length > 0 ? checkboxesChecked : null;
}
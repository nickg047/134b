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
    var habits = JSON.parse(localStorage.getItem('Habits'));
    var i;
    if (habits.length == 0){//Is so because initialized to Habits: []
        i = 0;
    }else {
        i = habits[habits.length-1].id + 1;
    }
    var dailyCount;
    if(getCheckedBoxes('day') !== null){
       dailyCount = getCheckedBoxes('day');
    }
    else{
       dailyCount = [document.getElementById("others").value];
    }
	var habit = {
        id: i,
        title: document.getElementById('title').value,
        image: image.src,
        weekFreq: getCheckedBoxes('date'),
        dailyFreq: dailyCount,
        other: document.getElementById('others').value,
        ticks: 0,
        bestRecord: 0,
        currentStreak: 0,
        date: 0
    };
    addHabit(habit);
    location.href='list.html'; 
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
            checkboxesChecked.push(checkboxes[i].value);
        }
    }
    return checkboxesChecked.length > 0 ? checkboxesChecked : null;
}
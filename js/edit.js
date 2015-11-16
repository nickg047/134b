var image = null;
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
	id_param: id of the habit to be updated
*/
function editFromUI() {
	var id_param = location.search.split('id=')[1];
	var habits = JSON.parse(localStorage.getItem('Habits'));
    var org_habit;
    for (var i = 0; i < habits.length; i++){
        org_habit = habits[i];
        if(id_param == org_habit.id) {
            break;
        }
    }

	var habit = {
		id: org_habit.id,
        title: document.getElementById('title').value,
        image: image.src,
        weekFreq: getCheckedBoxes('date'),
        dailyFreq: getDailyCount(),
        other: document.getElementById('others').value,
        ticks: org_habit.ticks,
        bestRecord: org_habit.bestRecord,
        currentStreak: org_habit.currentStreak,
        date: org_habit.date
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
        if(habit.id == habits[i].id) {
            break;
    	}
    }
    habits[i] = habit;

    localStorage.setItem("Habits", JSON.stringify(habits));
}
function updateHabitUI(){
    var habits = getAllHabits();
    var habit;
    var idFromUrl = location.search.split('id=')[1];
    for (var i = 0; i < habits.length; i++){
        habit = habits[i];
        if(idFromUrl == habit.id) {
            makeHtmlElement(habit);
            break;
        }
    }

}
updateHabitUI();
function makeHtmlElement(habit){
    
    var listItem = document.getElementById('forms');
    var elementTemplate = document.getElementById('template').innerHTML;
    listItem.innerHTML = elementTemplate;

    //Title
    //var a = listItem.getElementById('title').value;
    //alert(a);
    document.getElementById('title').value = habit.title;

    //Image
    for(var i = 0; i < document.getElementsByClassName('icon').length; i++) {
        var element = document.getElementsByClassName('icon')[i];
        if(element.src == habit.image) {
            selectImage(element.id);
            break;
        }
    }

    //Weekly Frequency
    for(var i = 0; i < document.getElementsByName('date').length; i++) {
        var element = document.getElementsByName('date')[i];
        if(habit.weekFreq[i]) {
            element.checked = true;
        }
    }

    //Daily Frequency   
    document.getElementsByName('day')[habit.dailyFreq-1].checked = true;
        
    //Others

    document.getElementById('others').value = habit.other;
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

/*
 *  selectCheckBox(dayName){
 *   When choosing a dailyFrequency only allow one to be chosen
 */
function selectCheckBox(dayName){
    if(dayName !== 1){
        document.getElementById("df1").checked = false           
    }
    if(dayName !== 2){
        document.getElementById("df2").checked = false
    }
    if(dayName !== 3){
        document.getElementById("df3").checked = false
    }
}

function getAllHabits(){
    var habits = JSON.parse(localStorage.getItem("Habits"));
    if (!habits){
        habits = [];
        localStorage.setItem("Habits", JSON.stringify(habits));
    }
    return habits;
}
function getDailyCount(){
    var daily = document.getElementById("others").value;
    if(isInt(daily)){
        return parseInt(daily, 10);
    }else{
        var checkBoxes = getCheckedBoxes('day');
        
        if(checkBoxes == 'one') {
            return 1;
        }
        else if(checkBoxes == 'two') {
            return 2;
        }
        else if(checkBoxes == 'three') {
            return 3;
        }
        else return 1;
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

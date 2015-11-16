image = null;

/*
 *  selectImage(name)
 *   When choosing a icon this will put a blue border around only the selected
 *   icon. It then sets the image for the habit to be this one
 */
function selectImage(name) {
//Clear all the other effects
    document.getElementById('icon1').style.border = "none";
    document.getElementById('icon2').style.border = "none";
    document.getElementById('icon3').style.border = "none";
    image = document.getElementById(name);
    image.style.border = "5px solid #42A5F5";
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

/*
 *  addFromUI
 *   Gets variables for habit from the inputs on the screen. Has safeguards to
 *   protect from improper input. Once done, move towards the listing page.
 */
function addFromUI() {
    //Check to make sure input is valid
    if (image === null){
        errorNeedToPickImage();
        return;
    }
    if (document.getElementById('title').value.length == 0){
        errorNeedToChooseTitle();
		return;
    }    
    
    var habits = JSON.parse(localStorage.getItem('Habits'));
    var newHabitId;
    if (habits === null || habits.length === 0){//Is so because initialized to Habits: []
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
        date: new Date()
    };
    addHabit(habit);
    location.href='list.html'; 
}


/*
 *  errorNeedTo___()
 *   Send a javascript alert that you have a improper field entry
 */
function errorNeedToPickImage(){
    alert("Select an image before saving");
}
function errorNeedToChooseTitle(){
    alert("Choose a title before saving");
}
function errorNeedToChooseFrequency(){
    alert("Choose a weekly and daily frequency before saving");
}

/*
 *  getDailyCount()
 *   Return what should be the dailyFreq. If there is input in the other box
 *   than that gets priority over the count chosen by the checkbox.   
 */
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
        return 1;
    }
}

/*
 *  isInt(data)
 *   Return true if the data is an integer.
 */
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
 *  addHabit(habit)
 *   Gets called from addFromUI(), add the param habit into the stored
 *   database.
 */
function addHabit(habit) {       
    if(!isAHabit(habit)){return;} //Safeguard
    
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

/*
 *  getCheckedBoxes(chkboxName)
 *   Goes to the weekly or daily checkboxes and returns an array of 0s and 1s 
 *   if that checkbox was checked.
 */
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

/*
 *  isAHabit(habit)
 *   Determines the field names of an object, if they do not match up with
 *   what should be the field names of a habit than return false. Used to
 *   verify/protect input into database.
 */
function isAHabit(habit){
    //Get the fields
    var k=[],p;
        for (p in habit) if (Object.prototype.hasOwnProperty.call(habit,p)) k.push(p);
    
    var habitFields = ["id", "title", "image", "weekFreq", "dailyFreq", "other", "ticks", "bestRecord", "currentStreak", "date"];
    var i;
    for(i = 0; i < 10; i++){
        if(habitFields[i] !== k[i]){
            alert("ERROR: Attempted to enter an invalid habit into database");
		    return false;
		}
    }
    return true;
}
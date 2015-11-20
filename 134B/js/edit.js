

var image = null;

/*
 *  selectImage(name)
 *   When choosing a icon this will put a blue border around only the selected
 *   icon. It then sets the image for the habit to be this one
 */
function selectImage(imageElement) {
//Clear all the other effects
    var icons = document.getElementsByClassName("icon");
    var i = 0;
    for(i; i<icons.length; i++){
        icons[i].style.border = "none";
    }
    image = imageElement;
    image.style.border = "5px solid #42A5F5";
}

/*
 *  updateImage(input)
 *   Turn the add image into a new image and save this new image as the
 *   image you have selected
 *
 *   NOTE TEMPORARY AS SRC = LOCAL URL, NEED SOMETHING THAT CAN BE PASSED
 *   INTO LOCAL STORAGE AND USED IN ANOTHER FILE
 */
function updateImage(input){
    var imgU = URL.createObjectURL(input.files[0]);
    if(imgU !== "null"){
        //Add in the new img element
		var imgE = document.createElement('img');
		var iconNum = document.getElementsByClassName("icon").length;
		imgE.id = ("icon"+iconNum);
		imgE.className = "icon";
		imgE.src = imgU;
		imgE.alt = "Uploaded Image";
		imgE.onclick = function() { selectImage(("icon"+iconNum)); };
		
		document.getElementById("icon-list").appendChild(imgE);
		selectImage(("icon"+iconNum));
    }
    else{
		document.getElementById("icon4".src = "../img/add.png");
    }
}

/*  TODO
 *  convertImg()
 *   Takes the inputted file image and returns the base64 image that can be 
 *   stored in local storage and read into by list.html.  Called from 
 *   updateImage(input)
 */
function convertImg(){

}

/*
 *  selectCheckBox(dayName){
 *   When choosing a dailyFrequency only allow one to be chosen and remove the
 *   text within the other daily frequencies tab.
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
    if(dayName !== -1){
    		document.getElementById("others").value = "";
    }
}

/*
	gets variables for habit from html form
	id_param: id of the habit to be updated
*/
function editFromUI() {
    if (document.getElementById('title').value.length == 0){
        errorNeedToChooseTitle();
		return;
    } 
    if (image === null){
        errorNeedToPickImage();
        return;
    }
    if (!isInt(document.getElementById('others').value) && document.getElementById('others').value.length > 0){
        errorNeedProperFrequencyRange()
		return;
    }
    var dailyCount = getDailyCount();
    var weeklyCount = getCheckedBoxes('date');
    alert(weeklyCount);
    if (dailyCount === null || dailyCount === 0 || sumArray(weeklyCount) == 0){
        errorNeedToChooseFrequency();
		return;
    }
    if(document.getElementById('others').value > 1000){
        errorNeedProperFrequencyRange()
		return;
    }
    
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
        image: getImage(),
        weekFreq: weeklyCount,
        dailyFreq: dailyCount,
        other: document.getElementById('others').value,
        ticks: org_habit.ticks,
        bestRecord: org_habit.bestRecord,
        currentStreak: org_habit.currentStreak,
        date: org_habit.date
    };
    editHabit(habit);
    return;
    location.href='list.html'; 
}

function getImage(){
    var num = image.id.toString().slice(4,5);
    if (parseInt(num) < 4)
        return num;
    else
        return getBase64Image();

}

/*
	only works with backend
	habit: habit to update
*/
function editHabit(habit) {
    if(!isAHabit(habit)){return;} //Safeguard

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
    if(!isAHabit(habit)){return;} //Safeguard
    return;
    
    var listItem = document.getElementById('forms');
    var elementTemplate = document.getElementById('template').innerHTML;
    listItem.innerHTML = elementTemplate;

    //Title
    //var a = listItem.getElementById('title').value;
    //alert(a);
    document.getElementById('title').value = habit.title;
    
    //Image
    if (isInt(habit.image)){
        selectImage(document.getElementById('icon' + habit.image));
        //imageElement.src = "../img/icon" + habit.image +  ".jpg"
    }else{
       imageElement.src = "data:image/png;base64," + habit.image;
    }
    for(var i = 0; i < document.getElementsByClassName('icon').length; i++) {
        var element = document.getElementsByClassName('icon')[i];
        if(element.src == habit.image) {
            selectImage(element.id);
            break;
        }
    }

    //Weekly Frequency
    var dateBoxes = document.getElementsByName('date');
    for(var i = 0; i < dateBoxes.length; i++) {
        var dateBox = dateBoxes[i];
        if(habit.weekFreq[i]) {
            dateBox.checked = true;
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
    alert(chkboxName + checkboxes.length);
    for (var i=0; i<checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            checkboxesChecked.push(1);
        }else{
            checkboxesChecked.push(0);
        }
    }
    return checkboxesChecked;
}

function getAllHabits(){
    var habits = JSON.parse(localStorage.getItem("Habits"));
    if (!habits){
        habits = [];
        localStorage.setItem("Habits", JSON.stringify(habits));
    }
    return habits;
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
        return 0;
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

function sumArray(arr){
    if(arr == null){return 0;}
    var _i = 0;
    var _l = arr.length;
    var sum = 0;
    for(_i; _i < _l ; _i++){
        sum += arr[_i];
    }
    return sum;
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
    for(i = 0; i < k.length; i++){
        if(habitFields[i] !== k[i]){
            alert("ERROR: Attempted to enter an invalid habit into database");
		    return false;
		}
    }
    return true;
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
    document.getElementById("title").placeholder = "Please Set A Title";
    document.getElementById("title").className += " error";
}

function errorNeedToChooseFrequency(){
    alert("Choose a proper weekly and daily frequency before saving");
}

function errorNeedProperFrequencyRange(){
    document.getElementById("others").value = "";
    document.getElementById("others").placeholder = "Number 1-1000";
    document.getElementById("others").className += " error";
    alert("Please choose a frequency to be a number between\n1 and 1000");    
}

image = null;

/*
 *  selectImage(name)
 *   When choosing a icon this will put a blue border around only the selected
 *   icon. It then sets the image for the habit to be this one
 */
function selectImage(id_param) {
//Clear all the other effects
    var icons = document.getElementsByClassName("icon");
    var i = 0;
    for(i; i<icons.length; i++){
        icons[i].style.border = "none";
    }
    image = document.getElementById(id_param);
    image.style.border = "5px solid #42A5F5";
}


document.getElementById("df1").checked = true
document.getElementById("defaultWeeklyFrequency").checked = true

function inputCheck(){
    var potentialNumber = document.getElementById('others').value;
    selectCheckBox(-1);
    if (!isInt(potentialNumber)){
        document.getElementById("df1").checked = true;
    }
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
function convertImg(img){
    var data, canvas, ctx;
    //Create the canvas element.
    canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    // Get '2d' context and draw the image.
    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    // Get canvas data URL
    try{
        data = canvas.toDataURL();
    }catch(e){
        alert("Error converting inputted image");
    }
    return data;
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
}

/*
 *  addFromUI
 *   Gets variables for habit from the inputs on the screen. Has safeguards to
 *   protect from improper input. Once done, move towards the listing page.
 */
function addFromUI() {
    //Check to make sure input is valid
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
    if (dailyCount === null || dailyCount === 0 || sumArray(weeklyCount) == 0){
        errorNeedToChooseFrequency();
		return;
    }
    if(document.getElementById('others').value > 1000){
        errorNeedProperFrequencyRange()
		return;
    }
      
    var habits = JSON.parse(localStorage.getItem('Habits'));
    var newHabitId;
    if (habits === null || habits.length === 0){
        newHabitId = 0;
    }else {
        var prevHabit = habits[habits.length-1];
        newHabitId = prevHabit.id + 1;
    }

    var habit = {
        id: newHabitId,
        title: document.getElementById('title').value,
        image: image.src,
        weekFreq: weeklyCount,
        dailyFreq: dailyCount,
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
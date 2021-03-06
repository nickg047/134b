Parse.initialize("lSrD6K2YbBIZKM7H8VMS43nY1ekjsEohi1RNY7Iu", "c3iXu7MDpI5guDqlEgr93lan7z0BoajBWSjGOU2j");
if(!Parse.User.current()){
    location.href='login.html';
}

var image = null;

/*
 *  selectImage(name)
 *   When choosing a icon this will put a blue border around only the selected
 *   icon. It then sets the image for the habit to be this one
 */
function onImageClick(imageElement) {
//Clear all the other effects
    var icons = document.getElementsByClassName("icon");
    for(var i = 0; i<icons.length; i++){
        icons[i].style.border = "none";
    }
    image = imageElement;
    image.style.border = "5px solid #42A5F5";
}


/*
 *  inputCheck()
 *   Checks to see if the other input for daily frequency is a valid integer
 *   if it is uncheck the daily frequencies buttons. Otherwise default to 
 *   check box 1 being checked
 */
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
 */
function updateImage(input){
    if(!isImageFile(input.files[0].name)){
        errorNeedToChooseProperImage();
        return;
    }
    var imgU = URL.createObjectURL(input.files[0]);
    if(imgU !== "null"){
        addNewImageChild(imgU);
    }
    else{
        document.getElementById("icon4".src = "../img/add.png");
    }
}

/*
 *  isImageFile
 *   Checks to see if the filename string has a file extension of a
 *   image that is upload-able. Returns boolean
 */
function isImageFile(fileName){
    if(fileName === null || fileName.indexOf(".") === -1)
        return false;
        
    var ext = fileName.split(".");
    ext = ext[ext.length-1];
    if(ext === "jpg" || ext === "png")
        return true;
    else
        return false;
}
 
/*
 *  addNewImageChild(imageData)
 *   Add a new image based on the inputted file
 */
function addNewImageChild(imageData){
    var imgE = document.createElement('img');
    var iconNum = document.getElementsByClassName("icon").length;
    imgE.id = ("icon"+iconNum);
    imgE.className = "icon";
    imgE.src = imageData;
    imgE.alt = "Uploaded Image";
    imgE.onclick = function() { onImageClick(this); };
    
    document.getElementById("icon-list").appendChild(imgE);
    onImageClick(imgE);
}

/*
 *  selectCheckBox(dayName){
 *   When choosing a dailyFrequency only allow one to be chosen and remove the
 *   text within the other daily frequencies tab.
 */
function selectCheckBox(dayName){
    if(dayName !== 1){
        document.getElementById("df1").checked = false ;          
    }
    if(dayName !== 2){
        document.getElementById("df2").checked = false;
    }
    if(dayName !== 3){
        document.getElementById("df3").checked = false;
    }
    if(dayName !== -1) {
        document.getElementById('others').value = "";
    }
}

/*
 *  addFromUI
 *   Gets variables for habit from the inputs on the screen. Has safeguards to
 *   protect from improper input. Once done, move towards the listing page.
 */
function errorChecks(){
    //Check to make sure input is valid
    if (document.getElementById('title').value.length === 0){
        errorNeedToChooseTitle();
        return true;
    }
    if (document.getElementById('title').value.length > 20){
        errorNeedToChooseShorterTitle();
        return true;
    } 
    if (image === null){
        errorNeedToPickImage();
        return true;
    }
    //If otherFrequency is not a positive integer
    if ( (!isInt(document.getElementById('others').value) || document.getElementById('others').value <= 0) && document.getElementById('others').value.length > 0 ){
        errorNeedProperFrequencyRange();
        return true;
    }
    var dailyCount = getDailyCount();
    var weeklyCount = getCheckedBoxes('date');
    if (dailyCount === null || dailyCount === 0 || sumArray(weeklyCount) === 0){
        errorNeedToChooseFrequency();
        return true;
    }
    if(document.getElementById('others').value > 1000){
        errorNeedProperFrequencyRange();
        return true;
    }
    return false;
}

function addFromUI(){
    if(errorChecks())
        return;
    var Habit = Parse.Object.extend("Habit");

    var idFromUrl = location.search.split('id=');
    if (idFromUrl.length >= 2){
        idFromUrl = idFromUrl[1];
        var query = new Parse.Query(Habit);
        query.get(idFromUrl, {
            success: function(habit){
                habit = save(habit);
                parseSave(habit);
            },
            error: function(object, error){
                var habit = save(new Habit());
                parseSave(habit);
            }
        });
    }else{
        var habit = save(new Habit());
        parseSave(habit);
    }
}

function parseSave(habit){
    habit.save(null, {
        success: function(habit){
            habit = save(habit);
            mixpanel.track('save habit');
            location.href='list.html'; 
        },
        error: function(object, error){
            alert(error.message);
            mixpanel.track('error in parse save');
        }
    });
}

function save(habit){
    habit.set('owner', Parse.User.current().id);
    habit.set('title', document.getElementById('title').value.toString());
    habit.set('image', getImage());
    habit.set('weekFreq', getCheckedBoxes('date'));
    var dailyFreq = getDailyCount();
    habit.set('dailyFreq', dailyFreq);
    
    if(!habit.get('firstFlurry')){
        habit.set('firstFlurry', true);//anyas transition effect, only should happen once
    }

    //ticks
    if(habit.get('ticks') > dailyFreq){
        habit.set('ticks', dailyFreq);
    }else if(!habit.get('ticks')){//no ticks
        habit.set('ticks', 0);
    }else{
        //don't need to do anything here
    }

    if(!habit.get('bestRecord')){
        habit.set('bestRecord', 0);
    }else{
        //don't need to do anything, its an edit
    }

    if(!habit.get('currentStreak')){
        habit.set('currentStreak', 0);
    }else{
        //don't need to do anything, its an edit
    }

    if(!habit.get('date')){
        habit.set('date', new Date().toString());
    }else{
        //don't need to do anything, its an edit
    }
    return habit;
}


/*
 *  getImage()
 *   Return the image, if its an added one return the base64 version
 */
function getImage(){
    var num = image.id.toString().slice(4,5);
    if (parseInt(num) < 4)
        return num;
    else
        return getBase64Image();

}

/*
 *  getBase64Image()
 *   Take in an image and convert and return the base64 image
 */
function getBase64Image() {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, 80, 80);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
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
    if (typeof(data) !== "number"){
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
 *   if none are checked, assume all days are checked
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
    return checkboxesChecked.length > 0 ? checkboxesChecked : [1,1,1,1,1,1,1];
}
  
/* Sum an array */
function sumArray(arr){
    if(!arr){return 0;}
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

function errorNeedToChooseProperImage(){
    alert("Please choose a proper image to upload. We support JPEG and PNG");
}
function errorNeedToChooseShorterTitle(){
    alert("Please choose a title 20 characters or less");
}

function getHabitById(habitId){
    var habits = getAllHabits();
    var habit;
    for (var i = 0; i < habits.length; i++){
        habit = habits[i];
        if (habitId === habit.id){
            return habit;
        }
    }
}

/*
 *  getAllHabits()
 *   Return a list of habits
 */
function getAllHabits(){
    var habits = JSON.parse(localStorage.getItem("Habits"));
    if (!habits){
        habits = [];
        localStorage.setItem("Habits", JSON.stringify(habits));
    }
    return habits;
}

/*
 *  Once all scripts are done loading if this was redirected to edit a habit
 *  then load up the habit's features which you expect to edit
 */
function loadHtmlElements(habit) {
    
    //Editing a habit
	document.getElementById("main-header").innerHTML = "Edit A Habit";    
    document.getElementById('title').value = habit.get('title');

    if (isInt(habit.get('image'))){
        onImageClick(document.getElementById('icon' + habit.get('image')));
    }else{
       var imageElementData = "data:image/png;base64," + habit.get('image');
       addNewImageChild(imageElementData);
    }

    //Weekly Frequency
    var dateBoxes = document.getElementsByName('date');
    for(var i = 0; i < dateBoxes.length; i++) {
        var dateBox = dateBoxes[i];
        if(habit.get('weekFreq')[i]) {
            dateBox.checked = true;
        }
    }

    //Daily Frequency   

    try {
        document.getElementsByName('day')[habit.get('dailyFreq')-1].checked = true;
    }
    //Others
    catch(e) {
        document.getElementById('others').value = habit.get('dailyFreq');
    }
    
}
function adjustFreqOnLoad() {
    var idFromUrl = location.search.split('id=');
    //Edit
    if(idFromUrl.length >= 2) {
        selectCheckBox(-1);
    }else{
    document.getElementById("df1").checked = true;
    document.getElementById("defaultWeeklyFrequency").checked = true;
    }
}
adjustFreqOnLoad();
var idFromUrl = location.search.split('id=');
if (idFromUrl.length < 2){
    //Adding a habit
    onImageClick(document.getElementById('icon1'));
}
else{
    idFromUrl = idFromUrl[1];
    var Habit = Parse.Object.extend('Habit');
    var query = new Parse.Query(Habit);
    query.get(idFromUrl, {
        success: function(habit){
            loadHtmlElements(habit);
        },
        error: function(o, error){
            if(error.code != 100)//for spaming f5
                alert(error.message);
        }
    });
}

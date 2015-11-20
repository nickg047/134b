/*
 * getAllHabits()
 *  Return a list of all the habits taken from the database
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
 *  getHabitById(habitId)
 *   Return the habit object given its id
 */
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
 *  updateHabit(habitToUpdate)
 *   Takes in a habit as a parameter and swaps it into the habit object list 
 *   and re-writes this into the database.
 */
function updateHabit(habitToUpdate){
    var habits = getAllHabits();
    var habit;
    for (var i = 0; i < habits.length; i++){
        habit = habits[i];
        if (habitToUpdate.id === habit.id){
            habits[i] = habitToUpdate;
            localStorage.setItem("Habits", JSON.stringify(habits));
            return;
        }
    }
}

/*
 *  updateHabitUI
 *   For all the habits within our list, make the HTML element using a 
 *   method call and append it to the list. Seperate habits that
 *   are scheduled today vs not if necessary
 */
function updateHabitUI(){
    var habits = getAllHabits();
    var listItem;  //type is HTML ListItem
    var list = document.getElementById('habit-list');
    var habit;
    var othersExist = false;
    for (var i = 0; i < habits.length; i++){
        habit = habits[i];
		if(todayIsUpdateDay(habit)){
            listItem = makeHtmlElement(habit);
            list.appendChild(listItem);
		}
		else{
		    othersExist = true;
		}
    }
    
    if(othersExist){
        //Make the separation between habits scheduled for today and those not
        list.appendChild(makeSeparatorElement());
        
        for (var i = 0; i < habits.length; i++){
            habit = habits[i];
            if(!todayIsUpdateDay(habit)){
                listItem = makeHtmlElement(habit);
                list.appendChild(listItem);
            }
        }
    }

    JSON.parse(localStorage.getItem("Habits"));
}

updateHabitUI();

/*
 *  makeSeparatorElement()
 *   Returns an <li> which will be appended in the main habit-list to show the
 *   separation between habits scheduled for today and the other ones.
 */
function makeSeparatorElement(){
    var separator = document.createElement('li');
    separator.innerHTML = '<h1> Other Habits </h1>'
    //Couldn't get it to work in CSS file so manually here
    separator.id = "separator";
    separator.style.height = '50px';
    separator.style.background= 'none';
    separator.style.border = 'none';
    
    return separator;    
}

//On loading the script for this class updateHabitUI
//so on page load it draws everything

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
 *  makeHtmlElement(habit)
 *   Takes in a habit object and uses its information to make a list element 
 *   for UI to be appended to the list. It builds off of the 'template' div in
 *   list.html. Sets title, image, text, buttons. Called from updateHabitUI
 */ 
function makeHtmlElement(habit){
    var listItem = document.createElement('li');
    listItem.id = habit.id;
    var elementTemplate = document.getElementById('template').innerHTML;
    listItem.innerHTML = elementTemplate;

    //Title
    listItem.getElementsByClassName("habit-name")[0].innerHTML = habit.title;

    //Image
    imageElement = listItem.getElementsByClassName("habit-icon")[0];

    if (isInt(habit.image)){
        imageElement.src = '../img/icon' + habit.image + '.jpg';
    }else{
       imageElement.src = "data:image/png;base64," + habit.image;
    }
    //imageElement.width = 100;
    //imageElement.width = 100;
    //imageElement.style.maxheight = "100px";
    //imageElement.style.maxwidth = "100px";
    listItem.getElementsByClassName("habit-name")[0].innerHTML.alt = habit.image.substring(habit.image.lastIndexOf("/")+1);
    //Statss
    listItem.getElementsByClassName("message-total")[0].children[0].innerHTML = habit.currentStreak;
    listItem.getElementsByClassName("message-total")[0].children[1].innerHTML = habit.bestRecord;

    listItem.getElementsByClassName("op op-edit")[0].onclick = function onclick(event) {location.href='add.html?id='+habit.id;}

    setCompletionText(listItem, habit);
    setMeter(listItem, habit);

    if(!todayIsUpdateDay(habit)){
        showCompleteButton(listItem, true);
    }
    else{
        showCompleteButton(listItem, false);
    }
    
    if(completedHabit(habit)){
        showTodaysCompletions(listItem);
        showCompleteButton(listItem, false);
    }
    return listItem;
}

/*
 *  setCompletionText(listElement, habit)
 *   Updates the UI of the currentStreak, bestRecord, and your progress on 
 *   completing a habit for today
 */
function setCompletionText(listElement, habit){
    listElement.getElementsByClassName("message-total")[0].children[0].innerHTML = habit.currentStreak;
    listElement.getElementsByClassName("message-total")[0].children[1].innerHTML = habit.bestRecord; 
    listElement.getElementsByClassName("message-today")[0].children[0].innerHTML = ""+habit.ticks+"/"+habit.dailyFreq;
}

/*
 *  todayIsUpdateDay(habit)
 *   Checks if this habit is scheduled for today, and if today is that day 
 *   Return boolean
 */
function todayIsUpdateDay(habit){
    var date = new Date();
    var day = date.getDay();
    date = null;
    //if you didn't select today as a day that you shouldn't update your habits
    if (habit.weekFreq[day] === 0){  
        return false;
    }
    return true;
}

/*
 *  showTodaysCompletions(listElement)
 *   Used when you have hitten a check mark to show the progress you have made
 *   with a text indication.
 */
function showTodaysCompletions(listElement){
    var msgElement = listElement.getElementsByClassName("message-today")[0];
    msgElement.style.visibility="visible";
}

/*
 *  completedHabit(habit)
 *   Simple check to see if you have completed the habit for today
 *   Return boolean
 */
function completedHabit(habit){
    return habit.ticks == habit.dailyFreq;
}

/*
 *  showCompleteButton(listElement, willShow)
 *   Hides the green checkmark of this listElement habit. This is done on 
 *   habits which are not scheduled to have been completed today.
 *   listItem is the habit, willShow is boolean
 */
function showCompleteButton(listElement, willShow){
    if(willShow){
        listElement.getElementsByClassName('op op-done')[0].style.display = "none";
    }
    else{
        listElement.getElementsByClassName('op op-done')[0].style.display = "initial";
    }
}

/*
 *  setMeter(listItem, habit)
 *   Updates the UI of a habit when you increment your ticks for today. Grows
 *   the status bar
 */      
function setMeter(listItem, habit){
    var line1 = listItem.getElementsByClassName('meter')[0];
    var line2 = listItem.getElementsByClassName('meter')[1];

    var max = parseFloat(line2.getAttribute('x2'));

    //var fractionToBest = habit.bestRecord === 0 ? 0.0 : (habit.currentStreak * max)/habit.bestRecord;
    var tickProgToday = max * (habit.ticks/habit.dailyFreq);
    
    line1.setAttribute('x2', tickProgToday);
    line2.setAttribute('x1', tickProgToday);
}

/*
 *  completeHabit(id_param)
 *   Called when you hit the checkmark. Increment the ticks for how many times
 *   you completed the habit today. Also contains the implementatin for 
 *   updating your currentStreak and bestRecord, also calls UI updates.
 */
function completeHabit(id_param){
    var listElement = getHabitElement(id_param);
    var habitC = getHabitById(parseInt(listElement.id));

    if(habitC.ticks < habitC.dailyFreq){//If already there do nothing
        habitC.ticks = habitC.ticks + 1;
		if(completedHabit(habitC) && todayIsUpdateDay(habitC)){
		    habitC.currentStreak = 1 + habitC.currentStreak;
		}
		if(habitC.currentStreak > habitC.bestRecord){
		    habitC.bestRecord = habitC.currentStreak;
		}
    }
   updateHabit(habitC);
   setCompletionText(listElement, habitC);
   setMeter(listElement, habitC);
   showTodaysCompletions(listElement);
}

/*
 *  getHabitElement(clickElement)
 *   Return the list element <li> of this habit. Used in completeHabit.
 */
function getHabitElement(clickElement){
    return clickElement.parentNode.parentNode;
}

/*
 *  onDeletePress(id_param)
 *   Called when you hit the red delete button. Deletes it from the UI by 
 *   deleting list element and calls deleteHabit to remove from database. 
 *   Removes 'Other Habits' heading if there are none.
 */
function onDeletePress(id_param){
    if(!confirm("Are you sure you want to delete this habit?")){
        return;
    }

    var listItem = id_param.parentNode.parentNode;
    var listContainer = listItem.parentNode;

    var id = listItem.id;
    deleteHabit(id);

    listContainer.removeChild(listItem); 
    if(listContainer.children[(listContainer.children.length)-1].id === "separator"){
        listContainer.removeChild(listContainer.children[(listContainer.children.length)-1]);
    }    
}

/*
 *  deleteHabit(habitId)
 *   Deleting the habit instance from our database. Called from onDeletePress 
 */
function deleteHabit(habitId){
    var habits = getAllHabits();
    habitId = parseInt(habitId);
    var habit;
    for (var i = 0; i < habits.length; i++){
        habit = habits[i];
        if (habitId === habit.id){
            habits.splice(i, 1);
            break;
        }
    }
    localStorage.setItem("Habits", JSON.stringify(habits));
}



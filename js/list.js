Parse.initialize("lSrD6K2YbBIZKM7H8VMS43nY1ekjsEohi1RNY7Iu", "c3iXu7MDpI5guDqlEgr93lan7z0BoajBWSjGOU2j");

//redirects user to login page if they managed to get here
if(!Parse.User.current()){
    location.href='login.html';
}

/*
 * getAllHabits()
 *  Return a list of all the habits taken from the database
 */

 //old way to get habits
function getAllHabits1(){
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
    for (var i = 0; i < habits.length; i++){
        if (habits[i].id === habitId){
            return habits[i];
        }
    }
}

function getHabitById1(habitId){
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
    habitToUpdate.save(null, {
        success: function(habit){

        }, error: function(o, error){
            alert(error.message);
        }
    })
    /*var habits = getAllHabits();
    var habit;
    for (var i = 0; i < habits.length; i++){
        habit = habits[i];
        if (habitToUpdate.id === habit.id){
            habits[i] = habitToUpdate;
            localStorage.setItem("Habits", JSON.stringify(habits));
            return;
        }
    }*/
}

/*
 *  updateHabitUI
 *   For all the habits within our list, make the HTML element using a 
 *   method call and append it to the list. Seperate habits that
 *   are scheduled today vs not if necessary
 */
function updateHabitUI(habits){
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
        
        for (i = 0; i < habits.length; i++){
            habit = habits[i];
            if(!todayIsUpdateDay(habit)){
                listItem = makeHtmlElement(habit);
                list.appendChild(listItem);
            }
        }
    }

    JSON.parse(localStorage.getItem("Habits"));
}

var Habit = Parse.Object.extend("Habit");
var query = new Parse.Query(Habit);
var habits;
query.equalTo('owner', Parse.User.current().id);
query.find({
    success: function(h){
        habits = h;
        updateHabitUI(h);
    }, error: function(error){
        if(error.code != 100)//for spaming f5
            alert(error.message);
    }
});

/*
 *  makeSeparatorElement()
 *   Returns an <li> which will be appended in the main habit-list to show the
 *   separation between habits scheduled for today and the other ones.
 */
function makeSeparatorElement(){
    var separator = document.createElement('li');
    separator.innerHTML = '<h1>Other Habits</h1>';
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
    if (data != parseInt(data, 10)){
        return false;
    }
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


    listItem.className = "new-item";
   //Title
    listItem.getElementsByClassName("habit-name")[0].innerHTML = habit.get('title');

    //Image
    imageElement = listItem.getElementsByClassName("habit-icon")[0];

    image = habit.get('image');
    if (isInt(image)){
        imageElement.src = '../img/icon' + image + '.jpg';
    }else{
       imageElement.src = "data:image/png;base64," + image;
    }
    //imageElement.width = 100;
    //imageElement.width = 100;
    //imageElement.style.maxheight = "100px";
    //imageElement.style.maxwidth = "100px";

    //not usre if this is needed anymore
    //listItem.getElementsByClassName("habit-name")[0].innerHTML.alt = habit.image.substring(habit.image.lastIndexOf("/")+1);

    //Statss
    listItem.getElementsByClassName("message-total")[0].children[0].innerHTML = habit.get('currentStreak');
    listItem.getElementsByClassName("message-total")[0].children[1].innerHTML = habit.get('bestRecord');

    listItem.getElementsByClassName("op op-edit")[0].onclick = function onclick(event) {location.href='add.html?id='+habit.id;};

    setCompletionText(listItem, habit);
    setMeter(listItem, habit);

    if(todayIsUpdateDay(habit) && completedHabit(habit)){
        showTodaysCompletions(listItem);
        showCompleteButton(listItem,false);
    }
    else if (todayIsUpdateDay(habit) && !completedHabit(habit)){
        showTodaysCompletions(listItem);
        showCompleteButton(listItem,false);
    }   
    else{
        showCompleteButton(listItem,true);
    }
    return listItem;
}

/*
 *  setCompletionText(listElement, habit)
 *   Updates the UI of the currentStreak, bestRecord, and your progress on 
 *   completing a habit for today
 */
function setCompletionText(listElement, habit){
    listElement.getElementsByClassName("message-total")[0].children[0].innerHTML = habit.get('currentStreak');
    listElement.getElementsByClassName("message-total")[0].children[1].innerHTML = habit.get('bestRecord'); 
    listElement.getElementsByClassName("message-today")[0].children[0].innerHTML = ""+habit.get('ticks')+"/"+habit.get('dailyFreq');
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
    if (habit.get('weekFreq')[day] === 0){  
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
    return habit.get('ticks') == habit.get('dailyFreq');
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
    var tickProgToday = max * (habit.get('ticks')/habit.get('dailyFreq'));

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
    var habitC = getHabitById(listElement.id);

    if(habitC.get('ticks') < habitC.get('dailyFreq')){//If already there do nothing
        habitC.set('ticks', habitC.get('ticks') + 1);
        if(completedHabit(habitC) && todayIsUpdateDay(habitC)){
            habitC.set('currentStreak', 1 + habitC.currentStreak);
        }
        if(habitC.get('currentStreak') > habitC.get('bestRecord')){
            habitC.set('bestRecord', habitC.currentStreak);
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
    //show yes and no
    var listElement = getHabitElement(id_param);
    listElement.getElementsByClassName("replace")[0].innerHTML = "<div class='para' style='color:#888;display:inline'>Are you sure? <button type='button' class='yesbtn op-yesbtn op-del' style='color:white;font-size:16px'>Yes</button><button type='button' class='nobtn op-yesbtn op-done' style='color:white;font-size:16px'>No</button></div>";  


    // if delete, delete
    var yb = listElement.getElementsByClassName('yesbtn')[0];

    yb.onclick = function () {
        listElement.className = "removed-item";
        setTimeout(fun, 1000);
            function fun() {
            var listItem = id_param.parentNode.parentNode;
            var listContainer = listItem.parentNode;

            var id = listItem.id;

            deleteHabit(id);
            listContainer.removeChild(listItem); 
            if(listContainer.children[(listContainer.children.length)-1].id === "separator")
                listContainer.removeChild(listContainer.children[(listContainer.children.length)-1]);
            }
    };

    // if no delete, put back delete button
    var nb = listElement.getElementsByClassName('nobtn')[0];
    nb.onclick = function() {
        listElement.getElementsByClassName('nobtn')[0].remove();
        listElement.getElementsByClassName('yesbtn')[0].remove();
        listElement.getElementsByClassName('para')[0].innerHTML = "<p class='replace' style='display:inline'></p>";
    } ;   
}

/*
 *  deleteHabit(habitId)
 *   Deleting the habit instance from our database. Called from onDeletePress 
 */
function deleteHabit(habitId){
    var habit = getHabitById(habitId);
    for (var i = 0; i < habits.length; i++){
        habit = habits[i];
        if (habitId === habit.id){
            habit.destroy({ 
                success: function(o){
                    habits.splice(i, 1);
                }, 
                error: function(o, e){
                    alert(e.message);
                }});
            break;
        }
    }
    localStorage.setItem("Habits", JSON.stringify(habits));
}
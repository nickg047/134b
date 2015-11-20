CSE 134B Github Repo  
Homework #4 - Working Prototype with JavaScript  
Authors: Jackson Davenport, Nicholas G,  Anna Lebedeva, Daniel Kim, Charles McKay  

HTML Files: welcome, login, add, list  
Javascript Files: welcome, login, parse, notifications, add, list  
CSS Files: welcome, login, forms, default, list  

Start with opening up welcome.html  
For this prototype our pseudo-database is localStorage, which stores you're 
PARSE identification and habits. The habits is a list of habit objects turned
into a string.
_______________________________________________________________________________
________________________________________________________________________________

welcome.html will welcome you to the app. It will ask you to create an account, which through 
Parse will make sure it is a valid e-mail. If you are returning to the app welcome.html will 
recognize you and accept your login information and you can either re-login if necessary 
or go straight to adding habits.

________

Creating
________
Adding habits has you select the title, icon, weekly frequency, and daily frequency.
We have checks implemented to make sure the habit you have created are valid.  
This involves:
  -If no title then prompt the user to enter a valid title via Javascript alert and 
    changing the placeholder text to red. Title also has a 20 character limit, this will cover
    most cases where the text will overflow the bounds of the habit UI.
  -If no icon then prompt the user via Javascript alert (default is the 1st icon). If 
    the user uploads an improper file for the icon they are alerted.
  -If no weekly frequency buttons are selected prompt the user to choose some via
    Javascript alert.
  -If no daily frequency buttons or text are inputted prompt the user via Javascript
    alert. Will attempt to default to 1. If you have inputted a number in the other 
    portion it will uncheck the buttons for clarity. If you have an invalid number in
    there the button 1 will be checked.
  -If you are messing around in the developers console and try to directly add a habit
    into the database it must have all and only the correct fields of a habit. This check
    is also used as a safeguard when adding any habits anywhere else.
We have tried to keep the creation of a habit simple and quick since this is a relatively 
interaction heavy part of the app.  

The user can also choose to upload their own icon, through the 4th add icon.  It loads up a 
file and displays all the icons you have selected for this session of create. Once you save
the habit it will save the Base64 version of the file to localStorage. As of now the storage 
of the Base64 image is a string which is converted back to an image to be displayed, this string
is stored within the habit object string in the database.

_______

Reading
_______
list.html and list.js will get all the habits from our database, parse the information, and output
it onto the UI.  It displays the habits in two sections: Habits for Today and Other Habits. They 
will display the appropriate habits based on when the user decided to schedule the weekly frequencies.
The UI for both are similar, there are three options for interaction: Check, Edit, Delete.  
  -Check will increment and note the user that you have said you have completed 1/n of your tick goals
    today and will increment further on more ticks. It will also grow a bar to more visually show 
    your progress. When you also complete a habit for the day you can increase your 'current streak'
    and 'best record' fields of your habit, which are displayed. Current streak will be zeroed in
    notifications upon our final release.
  -Edit will redirect you to the creation page, autofilling in as much of the previous data already.
    It has the same safeguards of a normal create. It will update the database and return back to read.
  -Delete will delete the habit from the list UI and database. It will also prompt the user before
    doing so as a precaution.
The habits that are not scheduled for today ("Other Habits") cannot be checked off.
________

Updating
________
The template-starter file provided us with add.html and edit.html. We found the two to be largely similar
so in the interest not duplicating code we combined them into add.html. As stated above edit will redirect 
you to the creation page, autofilling in as much of the previous data already. It has the same safeguards 
of a normal create. It will update the database and return back to read. If you are editing your ticks then
your ticks for today cannot excede the new tick limit (they will be truncated after saving). Also your 
current streak and best record are preserved after updating.
________

Deleting
________
Deleting was a simple two step process for us. A habit can be deleted in the list/read portion of the app
after confirmation of the delete. It then removes the habit from the database and then from the UI. The 
remaining habits are then re-aligned and if necessary the heading for "Other Habits" disappears if there are
none.


____

Notifications
_____
Push notifications were created using a javascript interval call and javascript web notifications. If the user has tasks assigned for the current day that have not been completed, the site will send a push notification through the browser every hour alerting the user how many incomplete tasks they have. Oddly though, if the site is run locally (eg file:///) as opposed to being run through server software (eg local server software included in tools like WebStorm) the web notifications will not display in most browsers.
_____

Extra
_____
For the CRUD pattern, there were originally 4 methods: getAllHabits(), addHabit(habitObject), editHabit(habitObject), and deleteHabit(habitId). However, editHabit(habitObject) is not replaced by creating a variable of the new habit with the same id, deleting the original habit, and adding the new habit. getAllHabits() just simply gets "Habits" from the localStorage and parse it into JSON data to return array of habits. addHabit(habitObject) creates a variable of habit and adds into the JSON data, which gets stringified and put into the localStorage. deleteHabit(habitId) finds the correct habit with the corresponding habit id and removes it from the JSON data then stringify the JSON data to put it into the localStorage.


________________________

Team Member Contributions
_________________________
Daniel Kim: 
-Created database by using localStorage.  
-Implemented basic backend CRUD pattern. (getAllHabits, addHabit, editHabit, deleteHabit)  
-Implemented Edit.html and Edit.js (merged with Add.html and Add.js)  
-Fixed bugs mostly for Edit  
-Attempted XSS for security  
-Performed basic QA job to find bugs  

Jackson Davenport:   
-Laid the a good portion of the groundwork for the UI for read.  
-Wrote several of the security checks for the create (the error message ones).   
-Backbone of image file upload and resizing (not conversion)  
-UI modifications changes for create, code to make it clear what choice your daily frequency is.   
-Method comments, this README.   
-Dynamic headers for read/edit.  
-Bug fixes.  
-Side note: for some reason my commits on git are listed separately under 'Jackson Davenport' and 'Jack'  

Nicholas G:
-Used local storage in concurence with the list data model to determine tasks the user has not completed for the current day  
-Used javascript timed intervals to trigger hourly push notifications  
-Used javascript web notifications to create push notifications  

Anna Lebedeva:
-Transition effects for deletion
-Transition effects for adding new item; although when a new item is added or edited, all of the habits do the animation. Will be fixed in hw5.
-Added logout button
-Confirmation for deletion more user friendly (not just an alert)
-Basic QA to see how animations work
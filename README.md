CSE 134B Github Repo  
Homework #4 - Working Prototype with JavaScript  
Authors: Jackson Davenport, Nicholas G,  Anna Lebedeva, Daniel Kim, Charles McKay  

HTML Files: welcome, login, add, list  
Javascript Files: welcome, login, parse, notifications, add, list  
CSS Files: welcome, login, forms, default, list  

Start with opening up welcome.html  
For this prototype our pseudo-database is localStorage, which stores you're 
PARSE identification and habits.
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
    changing the placeholder text to red
  -If no icon then prompt the user via Javascript alert (default is the 1st icon). If 
    the user uploads an improper file for the icon they are alerted.
  -If no weekly frequency buttons are selected prompt the user to choose some via
    Javascript alert
  -If no daily frequency buttons or text are inputted prompt the user via Javascript
    alert. Will attempt to default to 1. If you have inputted a number in the other 
    portion it will uncheck the buttons for clarity. If you have an invalid number in
    there the button 1 will be checked.
  -If you are messing around in the developers console and try to directly add a habit
    into the database it must have all and only the correct fields of a habit. This check
    is also used as a safeguard when adding any habits anywhere else.
We have tried to keep the creation of a habit simple and quick since this is a relatively 
interaction heavy part of the app.  The user can also choose to upload their own icon, through
the 4th add icon.  It loads up a file and displays all the icons you have selected for this 
session of create. Once you save it will save the Base64 version of the file to localStorage.
As of now we the storage of the Base64 image works as the string is saved into the habits 
image.src field. In the final implementation we plan to correct this by either solving this 
bug or transitioning to firebase and direct downloading the user inputted image.

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
of a normal create. It will update the database and return back to read. We decided to implement edit as a
reset of the ticks. We came to this conclusion since retaining a streak after editing the parameters seemed 
illogical.
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

_____

Extra
_____



________________________

Team Member Contributions
_________________________
Jackson: There was a lot of mixing between duties especially as we added more and more features and 
security checks. I laid the a good portion of the groundwork for the UI for read. I wrote several of
the security checks for the create (the error message ones). First portion of uploading image.  
UI changes for create, code to make it clear what choices your daily frequency is. Method comments, 
this README. Separating Habits For Today and Other Habits. Bug fixes.

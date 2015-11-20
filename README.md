CSE 134B Github Repo
Homework #4 - Working Prototype with JavaScript
Authors: Jackson Davenport, Nicholas G,  Anna Lebedeva, Daniel Kim, Charles McKay

HTML Files: welcome, login, add, list
Javascript Files: welcome, login, parse, notifications, add, list
CSS Files: welcome, login, forms, default, list

Start with opening up welcome.html
For this prototype our pseudo-database is localStorage, which stores you're 
PARSE identification and habits.
________________________________________________________________________________

welcome.html will welcome you to the app. It will ask you to create an account, 
which through Parse will make sure it is a valid e-mail. If you are returning 
to the app welcome.html will recognize you and accept your login information 
and you can either re-login if necessary or go straight to adding habits.

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
As of now we the storage of the Base64 image works as the string is saved into the habits image.src
field. In the final implementation we plan to correct this by either solving this bug or transitioning
to firebase and direct downloading the user inputted image.

_______

Reading
_______


________

Updating
________


________

Deleting
________


_____

Extra
_____



________________________

Team Member Contributions
_________________________

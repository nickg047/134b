Parse.initialize("lSrD6K2YbBIZKM7H8VMS43nY1ekjsEohi1RNY7Iu", "c3iXu7MDpI5guDqlEgr93lan7z0BoajBWSjGOU2j");


function onClickSignUp() {
	var user = Parse.User();
	var screenname = getUser();
	user.set("username", screenname);
	user.set("password", getPassword());
	uesr.set("email", screenname);
	user.signUp(null, {
		success: function(user) {
			onSignupSuccess();
		},
		error: function(user, error) {
			onSignupFailure(user, error);
		}
	} );
  
}

function getUser(){
	return document.getElementById('usermail').value;
}

function getPassword(){
	return document.getElementById('password').value;
}

function onClickLogin(){
	Parse.User.logIn(getUser(), getPassword(), {
      success: function(user) {
        var userSessionId = Parse.User.current().getSessionToken();
        Parse.User.become(userSessionId);
        successfulSignup();
      },
      error: function(user, error) {
        failedSignup(user, error);
      }
    });
}

function successfulSignup(){
	alert('success!');
}

function failedSignup(user, error){
	alert('failure');
}

function onSignupSuccess(){
	var signUpText = document.getElementById("signInMessage");
	signUpText.style.display = 'block';
}

function onSignupFailure(user, error){    alert("Error: " + error.code + " " + error.message);

}
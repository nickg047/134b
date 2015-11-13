Parse.initialize("lSrD6K2YbBIZKM7H8VMS43nY1ekjsEohi1RNY7Iu", "c3iXu7MDpI5guDqlEgr93lan7z0BoajBWSjGOU2j");

if (Parse.User.current()){
	onSignInSucess();
}

function onClickSignUp() {
	var user = new Parse.User();
	var screenname = getUser();
	user.set("username", screenname);
	user.set("password", getPassword());
	user.set("email", screenname);
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
        onSignInSucess();
      },
      error: function(user, error) {
        failedSignup(user, error);
      }
    });
}

function onSignInSucess(){
	location.href='welcome.html'
}

function failedSignup(user, error){
	alert(error.message);
}

function onSignupSuccess(){
	var signUpText = document.getElementById("signInMessage");
	signUpText.style.display = 'block';
}

function onSignupFailure(user, error){    alert("Error: " + error.code + " " + error.message);

}
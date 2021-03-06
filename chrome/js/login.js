Parse.initialize("lSrD6K2YbBIZKM7H8VMS43nY1ekjsEohi1RNY7Iu", "c3iXu7MDpI5guDqlEgr93lan7z0BoajBWSjGOU2j");

document.getElementById("login").addEventListener("click", onClickLogin);
document.getElementById("signUp").addEventListener("click", onClickSignUp);
if (Parse.User.current()){
	onSignInSucess();
}

function onClickSignUp() {
	var screenname = getUser();
	if (screenname.length == 0){
		return;
	}
	var user = new Parse.User();
	user.set("username", screenname);
	user.set("password", getPassword());
	user.set("email", screenname);
	user.signUp(null, {
		success: function(user) {
			onSignupSuccess();
			mixpanel.track("signup success");
		},
		error: function(user, error) {
			onSignupFailure(user, error);
			mixpanel.track("signup failure " + error.message);
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
        mixpanel.track("login success");
      },
      error: function(user, error) {
        failedSignup(user, error);
        mixpanel.track("login failure " + error.message);
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

function onSignupFailure(user, error){
	alert("Error: " + error.code + " " + error.message);
}
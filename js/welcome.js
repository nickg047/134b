Parse.initialize("lSrD6K2YbBIZKM7H8VMS43nY1ekjsEohi1RNY7Iu", "c3iXu7MDpI5guDqlEgr93lan7z0BoajBWSjGOU2j");

if (!loggedIn()){
	document.querySelector('.addbutton').value = 'login';
}

function onClick(){
	if (loggedIn()){
		location.href='list.html'
	}else{
		location.href='login.html'
	}
}


function loggedIn(){
	return Parse.User.current();
}
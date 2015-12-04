Parse.initialize("lSrD6K2YbBIZKM7H8VMS43nY1ekjsEohi1RNY7Iu", "c3iXu7MDpI5guDqlEgr93lan7z0BoajBWSjGOU2j");
document.getElementById("viewBtn").addEventListener("click", function(){onClick(1);});
document.getElementById("addBtn").addEventListener("click", function() {onClick(2);});
if (!loggedIn()){
	document.querySelector('.addbutton').value = 'login';
	document.getElementById('add').outerHTML = '';
}

function onClick(i){
	if (loggedIn()){
		if (i === 1){
			mixpanel.track('view habits');
			location.href='list.html';
		}else{
			location.href='add.html'
			mixpanel.track('add habit');
		}
	}else{
		location.href='login.html'
		mixpanel.track('login');
	}
}


function loggedIn(){
	return Parse.User.current();
}
Parse.initialize("lSrD6K2YbBIZKM7H8VMS43nY1ekjsEohi1RNY7Iu", "c3iXu7MDpI5guDqlEgr93lan7z0BoajBWSjGOU2j");

function onClick(){
    if(Parse.User.current()){
        location.href = 'list.html';
    } else {
        location.href = 'login.html';
    }
}
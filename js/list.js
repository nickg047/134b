function getAllHabits1(){var a=JSON.parse(localStorage.getItem("Habits"));return a||(a=[],localStorage.setItem("Habits",JSON.stringify(a))),a}function getHabitById(a){for(var b=0;b<habits.length;b++)if(habits[b].id===a)return habits[b]}function getHabitById1(a){for(var b,c=getAllHabits(),d=0;d<c.length;d++)if(b=c[d],a===b.id)return b}function updateHabit(a){a.save(null,{success:function(a){},error:function(a,b){alert(b.message)}})}function updateHabitUI(a){for(var b,c,d=document.getElementById("habit-list"),e=!1,f=0;f<a.length;f++)c=a[f],todayIsUpdateDay(c)?(b=makeHtmlElement(c),d.appendChild(b)):e=!0;if(e)for(d.appendChild(makeSeparatorElement()),f=0;f<a.length;f++)c=a[f],todayIsUpdateDay(c)||(b=makeHtmlElement(c),d.appendChild(b));JSON.parse(localStorage.getItem("Habits"))}function zeroOutDate(a){var b=new Date(a);return b.setSeconds(0),b.setMilliseconds(0),b.setMinutes(0),b.setHours(0),b}function makeSeparatorElement(){var a=document.createElement("li");return a.innerHTML="<h1>Other Habits</h1>",a.id="separator",a.style.height="50px",a.style.background="none",a.style.border="none",a}function isInt(a){return a!=parseInt(a,10)?!1:(a=parseInt(a,10),1>a?!1:!0)}function makeHtmlElement(a){var b=document.createElement("li");b.id=a.id;var c=document.getElementById("template").innerHTML;return b.innerHTML=c,a.get("firstFlurry")&&(b.className="new-item",a.set("firstFlurry",!1),a.save()),b.getElementsByClassName("habit-name")[0].innerHTML=a.get("title"),imageElement=b.getElementsByClassName("habit-icon")[0],image=a.get("image"),isInt(image)?imageElement.src="../img/icon"+image+".jpg":imageElement.src="data:image/png;base64,"+image,b.getElementsByClassName("message-total")[0].children[0].innerHTML=a.get("currentStreak"),b.getElementsByClassName("message-total")[0].children[1].innerHTML=a.get("bestRecord"),b.getElementsByClassName("op op-edit")[0].onclick=function(b){location.href="add.html?id="+a.id},setCompletionText(b,a),setMeter(b,a),todayIsUpdateDay(a)&&completedHabit(a)?(showTodaysCompletions(b),showCompleteButton(b,!0)):todayIsUpdateDay(a)&&!completedHabit(a)?(showTodaysCompletions(b),showCompleteButton(b,!1)):showCompleteButton(b,!0),b}function setCompletionText(a,b){a.getElementsByClassName("message-total")[0].children[0].innerHTML=b.get("currentStreak"),a.getElementsByClassName("message-total")[0].children[1].innerHTML=b.get("bestRecord"),a.getElementsByClassName("message-today")[0].children[0].innerHTML=""+b.get("ticks")+"/"+b.get("dailyFreq")}function todayIsUpdateDay(a){var b=new Date,c=b.getDay();return b=null,0===a.get("weekFreq")[c]?!1:!0}function showTodaysCompletions(a){var b=a.getElementsByClassName("message-today")[0];b.style.visibility="visible"}function completedHabit(a){return a.get("ticks")>=a.get("dailyFreq")}function showCompleteButton(a,b){b?a.getElementsByClassName("op op-done")[0].style.display="none":a.getElementsByClassName("op op-done")[0].style.display="initial"}function setMeter(a,b){var c=a.getElementsByClassName("meter")[0],d=a.getElementsByClassName("meter")[1],e=parseFloat(d.getAttribute("x2")),f=e*(b.get("ticks")/b.get("dailyFreq"));c.setAttribute("x2",f),d.setAttribute("x1",f)}function completeHabit(a){var b=getHabitElement(a),c=getHabitById(b.id);if(mixpanel.track("complete my habit"),c.get("ticks")<c.get("dailyFreq")){if(c.increment("ticks"),completedHabit(c)&&todayIsUpdateDay(c)){var d=zeroOutDate(c.get("dateSuccess")),e=zeroOutDate((new Date).toDateString()),f=nextDate(d,c.get("weekFreq")),g=f.date,h=f.counter;g.getTime()==e.getTime()?(c.set("currentStreak",c.get("currentStreak")+h),c.set("dateSuccess",e.toDateString())):(c.set("currentStreak",h),c.set("dateSuccess",e.toDateString())),showCompleteButton(b,!0)}c.get("currentStreak")>c.get("bestRecord")&&c.set("bestRecord",c.get("currentStreak"))}updateHabit(c),setCompletionText(b,c),setMeter(b,c),showTodaysCompletions(b)}function nextDate(a,b){console.log(b);var c,d=9e7,e=a.getDay()+1;for(c=1;c<b.length+1&&(e%=7,!b[e]);e++,c++);var f;for(f=0;c>f;f++){var g=a.getTime();g+=d,a=zeroOutDate(new Date(g).toDateString())}var h={date:a,counter:c};return h}function getHabitElement(a){return a.parentNode.parentNode}function onDeletePress(a){var b=getHabitElement(a);mixpanel.track("try to delete habit"),b.getElementsByClassName("replace")[0].innerHTML="<div class='para' style='color:#888;display:inline'>Are you sure? <button type='button' class='yesbtn op-yesbtn op-del' style='color:white;font-size:16px'>Yes</button><button type='button' class='nobtn op-yesbtn op-done' style='color:white;font-size:16px'>No</button></div>";var c=b.getElementsByClassName("yesbtn")[0];c.onclick=function(){function c(){var b=a.parentNode.parentNode,c=b.parentNode,d=b.id;deleteHabit(d),c.removeChild(b),"separator"===c.children[c.children.length-1].id&&c.removeChild(c.children[c.children.length-1])}b.className="removed-item",setTimeout(c,1e3)};var d=b.getElementsByClassName("nobtn")[0];d.onclick=function(){b.getElementsByClassName("nobtn")[0].remove(),b.getElementsByClassName("yesbtn")[0].remove(),b.getElementsByClassName("para")[0].innerHTML="<p class='replace' style='display:inline'></p>"}}function deleteHabit(a){for(var b=getHabitById(a),c=0;c<habits.length;c++)if(b=habits[c],a===b.id){b.destroy({success:function(a){habits.splice(c,1)},error:function(a,b){alert(b.message)}});break}localStorage.setItem("Habits",JSON.stringify(habits))}Parse.initialize("lSrD6K2YbBIZKM7H8VMS43nY1ekjsEohi1RNY7Iu","c3iXu7MDpI5guDqlEgr93lan7z0BoajBWSjGOU2j"),Parse.User.current()||(location.href="login.html");var Habit=Parse.Object.extend("Habit"),query=new Parse.Query(Habit),habits;query.equalTo("owner",Parse.User.current().id),query.find({success:function(a){if(habits=a,0!=habits.length){var b=habits[0],c=zeroOutDate((new Date).toDateString()),d=zeroOutDate(b.get("dateAccessed"));if(c.getTime()!=d.getTime()){var e;for(e=0;e<habits.length;e++)habits[e].set("ticks",0),habits[e].set("dateAccessed",c.toDateString()),updateHabit(habits[e])}}updateHabitUI(a)},error:function(a){100!=a.code&&alert(a.message)}});
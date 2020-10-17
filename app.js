window.onload = function () {

	document.getElementById("start_date").value = formatDate();
	document.getElementById("end_date").value = formatDate();

	getTournaments();

}

function formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function verifyDates(id) {


	var start = new Date(document.getElementById("start_date").value.split("-").join("/"));
	var end = new Date(document.getElementById("end_date").value.split("-").join("/"));

	 if (start == "Invalid Date" || end == "Invalid Date") {

	 	alert("Invalid date(s). Ensure dates are in DD-MM-YYYY format.");
	 	return;

	 } else if (start.getTime() > end.getTime()) {

		alert("Start date " + document.getElementById("start_date").value + " cannot be before end date " + document.getElementById("end_date").value);
		return;

	} else {

		if (id == "getResults") {

			if (start.getTime() > new Date().getTime()) {

				alert("Start date " + document.getElementById("start_date").value + " cannot be later than current date");
				return;

			} else {

				document.getElementById("results").innerHTML = "";
				getResults(document.getElementById("start_date"), document.getElementById("end_date"), document.getElementById("tournaments"));

			}

		} else if (id == "getFixtures") {

			if (start.getTime() < new Date().getTime() - (1000 * 60 * 60 * 24)) {

				alert("Start date " + document.getElementById("start_date").value + " cannot be earlier than current date");
				return;

			} else {

				document.getElementById("results").innerHTML = "";
				getFixtures(document.getElementById("start_date"), document.getElementById("end_date"), document.getElementById("tournaments"));

			}

		}

	}

}

function filterGames(obj) {

	console.log("Function invoked");

	var dateOfGame;
	var newObj = [];

	for (var i = 0; i < obj.length; i++) {
		
		dateOfGame = new Date(obj[i].start_time.split("Z")[0].split(".")[0]);
		console.log(dateOfGame + " " + obj[i].event_name);

		if (dateOfGame.getTime() > Date.now()) {

			newObj.push(obj[i]);

		}

	}

	console.log(newObj);

	return newObj;

}

function getResults(start_date, end_date, tournaments) {

	var data = null;
	var obj;

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
		if (this.readyState == 4 && this.status == 200) {
			obj = JSON.parse(this.responseText);
			displayResults(obj);
		}
	});

	if (tournaments.value == "all") {
		xhr.open("GET", "https://stroccoli-futbol-science-v1.p.rapidapi.com/s1/results/" + start_date.value + "/" + end_date.value);
	} else {
		xhr.open("GET", "https://stroccoli-futbol-science-v1.p.rapidapi.com/s1/results/" + start_date.value + "/" + end_date.value + "?tournament_name=" + tournaments.value);
	}
	xhr.setRequestHeader("x-rapidapi-host", "stroccoli-futbol-science-v1.p.rapidapi.com");
	xhr.setRequestHeader("x-rapidapi-key", "438ba18331msh6814de6ff9c6756p12b320jsn292463a78e9f");

	xhr.send(data);

}

function getFixtures(start_date, end_date, tournaments) {

	var data = null;
	var obj;

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
		if (this.readyState == 4 && this.status == 200) {
			obj = JSON.parse(this.responseText);
			obj = filterGames(obj)
			displayFixtures(obj);
		}
	});

	if (tournaments.value == "all") {
		xhr.open("GET", "https://stroccoli-futbol-science-v1.p.rapidapi.com/s1/calendar/" + start_date.value + "/" + end_date.value);
	} else {
		xhr.open("GET", "https://stroccoli-futbol-science-v1.p.rapidapi.com/s1/calendar/" + start_date.value + "/" + end_date.value + "?tournament_name=" + tournaments.value);
	}
	xhr.setRequestHeader("x-rapidapi-host", "stroccoli-futbol-science-v1.p.rapidapi.com");
	xhr.setRequestHeader("x-rapidapi-key", "438ba18331msh6814de6ff9c6756p12b320jsn292463a78e9f");

	xhr.send(data);

}

function getTournaments() {

	var data = null;

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
		if (this.readyState == 4 && this.status == 200) {
			obj = JSON.parse(this.responseText);
			for (var i = 0; i < obj.length; i++) {
				var val = obj[i].league.split(" ").join("%20");
				document.getElementById("tournaments").innerHTML += "<option value=\"" + val + "\">" + obj[i].league + "</option>";
			}
		}
	});

	xhr.open("GET", "https://stroccoli-futbol-science-v1.p.rapidapi.com/s1/tournaments");
	xhr.setRequestHeader("x-rapidapi-host", "stroccoli-futbol-science-v1.p.rapidapi.com");
	xhr.setRequestHeader("x-rapidapi-key", "438ba18331msh6814de6ff9c6756p12b320jsn292463a78e9f");

	xhr.send(data);

}

function getLiveData() {

	document.getElementById("results").innerHTML = "";

	var data = null;

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
		if (this.readyState == 4 && this.status == 200) {
			obj = JSON.parse(this.responseText);
			displayResults(obj);
		}
	});

	xhr.open("GET", "https://stroccoli-futbol-science-v1.p.rapidapi.com/s2/live");
	xhr.setRequestHeader("x-rapidapi-host", "stroccoli-futbol-science-v1.p.rapidapi.com");
	xhr.setRequestHeader("x-rapidapi-key", "438ba18331msh6814de6ff9c6756p12b320jsn292463a78e9f");

	xhr.send(data);

}

function displayLineUps(obj, match_id) {

	for (var i = 0; i < obj[0].home_team.players.length; i++) {

		if (obj[0].home_team.players[i].status != "starter") {

			break;

		} else {

			document.getElementById("HomeLineup" + match_id).innerHTML += "<h5><b>" + obj[0].home_team.players[i].uniform_number + "</b> - " + obj[0].home_team.players[i].full;

		}

	}

	for (var i = 0; i < obj[0].visitant_team.players.length; i++) {

		if (obj[0].visitant_team.players[i].status != "starter") {

			break;

		} else {

			document.getElementById("AwayLineup" + match_id).innerHTML += "<h5><b>" + obj[0].visitant_team.players[i].uniform_number + "</b> - " + obj[0].visitant_team.players[i].full;

		}

	}

}

function displayGoals(obj, match_id) {

	try { 

		for (var i = 0; i <= obj[0].scores.length; i++) {

			if (obj[0].scores[i].score_type == "shootout") { continue; }

			if (obj[0].scores[i].team.full == obj[0].home_team.name.full) {

				if (obj[0].scores[i].score_type == "penalty") {
					document.getElementById("HomeGoals" + match_id).innerHTML += "<i class=\"far fa-futbol\"></i><h5>" + obj[0].scores[i].participants[0].player.last + " (\'" + obj[0].scores[i].minutes_elapsed + ") - P</h5>";
				} else if (obj[0].scores[i].score_type == "own-goal") {
					document.getElementById("HomeGoals" + match_id).innerHTML += "<i class=\"far fa-futbol\"></i><h5>" + obj[0].scores[i].participants[0].player.last + " (\'" + obj[0].scores[i].minutes_elapsed + ") - OG</h5>";
				} else {
					document.getElementById("HomeGoals" + match_id).innerHTML += "<i class=\"far fa-futbol\"></i><h5>" + obj[0].scores[i].participants[0].player.last + " (\'" + obj[0].scores[i].minutes_elapsed + ")</h5>";
				}

			} else {

				if (obj[0].scores[i].score_type == "penalty") {
					document.getElementById("AwayGoals" + match_id).innerHTML += "<i class=\"far fa-futbol\"></i><h5>" + obj[0].scores[i].participants[0].player.last + " (\'" + obj[0].scores[i].minutes_elapsed + ") - P</h5>";
				} 
				else if (obj[0].scores[i].score_type == "own-goal") {
					document.getElementById("AwayGoals" + match_id).innerHTML += "<i class=\"far fa-futbol\"></i><h5>" + obj[0].scores[i].participants[0].player.last + " (\'" + obj[0].scores[i].minutes_elapsed + ") - OG</h5>";
				} else {
					document.getElementById("AwayGoals" + match_id).innerHTML += "<i class=\"far fa-futbol\"></i><h5>" + obj[0].scores[i].participants[0].player.last + " (\'" + obj[0].scores[i].minutes_elapsed + ")</h5>";
				}

			}

	} } catch (error) {
		console.log(error);
	}

}

function displayCards(obj, match_id) {

	try {

		for (var i = 0; i < obj[0].penalties.length; i++) {

			if (obj[0].penalties[i].team.full == obj[0].home_team.name.full) {

				if (obj[0].penalties[i].penalty_level == "yellow-card") {

					document.getElementById("HomeCards" + match_id).innerHTML += "<i class=\"yellow-card\"></i><h5>" + obj[0].penalties[i].player.last + " (\'" + obj[0].penalties[i].minutes_elapsed + ")";

				} else if (obj[0].penalties[i].penalty_level == "red-card") {

					document.getElementById("HomeCards" + match_id).innerHTML += "<i class=\"red-card\"></i><h5>" + obj[0].penalties[i].player.last + " (\'" + obj[0].penalties[i].minutes_elapsed + ")";

				}

			} else {

				if (obj[0].penalties[i].penalty_level == "yellow-card") {

					document.getElementById("AwayCards" + match_id).innerHTML += "<i class=\"yellow-card\"></i><h5>" + obj[0].penalties[i].player.last + " (\'" + obj[0].penalties[i].minutes_elapsed + ")";

				} else if (obj[0].penalties[i].penalty_level == "red-card") {

					document.getElementById("AwayCards" + match_id).innerHTML += "<i class=\"red-card\"></i><h5>" + obj[0].penalties[i].player.last + " (\'" + obj[0].penalties[i].minutes_elapsed + ")";

				}

			}
			
		}

	} catch (error) {
		console.log(error);
	}

}

function displaySubs(obj, match_id) {

	try {

		for (var i = 0; i < obj[0].substitutions.length; i++) {

			if (obj[0].substitutions[i].team.full == obj[0].home_team.name.full) {

				document.getElementById("HomeSubs" + match_id).innerHTML += "<h5>\'" + obj[0].substitutions[i].minutes_elapsed + "</h5>";
				document.getElementById("HomeSubs" + match_id).innerHTML += "<i class=\"fas fa-sign-out-alt\"></i><h5>" + obj[0].substitutions[i].player_out + "</h5>";
				document.getElementById("HomeSubs" + match_id).innerHTML += "<i class=\"fas fa-sign-in-alt\"></i><h5>" + obj[0].substitutions[i].player_in + "</h5><br>";

			} else {

				document.getElementById("AwaySubs" + match_id).innerHTML += "<h5>\'" + obj[0].substitutions[i].minutes_elapsed + "</h5>";
				document.getElementById("AwaySubs" + match_id).innerHTML += "<i class=\"fas fa-sign-out-alt\"></i><h5>" + obj[0].substitutions[i].player_out + "</h5>";
				document.getElementById("AwaySubs" + match_id).innerHTML += "<i class=\"fas fa-sign-in-alt\"></i><h5>" + obj[0].substitutions[i].player_in + "</h5><br>";

			}

		}		

	} catch (error) {
		console.log(error);
	}

}

function showMatchDetails(match_id) {

	document.getElementById("Button" + match_id).disabled = true;

	document.getElementById("match" + match_id).innerHTML = "";

	var data = null;

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
		if (this.readyState == 4 && this.status == 200) {
			obj = JSON.parse(this.responseText);
			console.log(obj);

			if (obj.length == 0) {

				document.getElementById("match" + match_id).innerHTML = "<br><div class=\"row\"><div class=\"col\" style=\"text-align: center\"><h3>NO MATCH DETAILS AVAILABLE</h3></div></div>";
				return;

			}

			var result = "";

			if (obj[0].officials) {
				result = "<br><div class=\"row\"><div class=\"col\" style=\"text-align: center\"><h5><b>Referee - </b>" + obj[0].officials[0].full + "</h5></div></div>";
			}
			if (obj[0].extra_time) {
				result += "<div class=\"row\"><div class=\"col\" style=\"text-align: center\"><h5><b>Additional time - </b>" + obj[0].extra_time + " minutes</h5></div></div>";
			}
			result += "<br><div class=\"row\"><div class=\"col\" style=\"text-align: center\"><h3>Lineups</h3></div></div>";
			result += "<div class=\"row\"><div class=\"col-sm-6\" style=\"text-align: center\" id=\"HomeLineup" + match_id + "\"></div><div class=\"col-sm-6\" style=\"text-align: center\" id=\"AwayLineup" + match_id + "\"></div></div>";
			result += "<br><div class=\"row\"><div class=\"col\" style=\"text-align: center\"><h3>Goals</h3></div></div>";
			result += "<div class=\"row\"><div class=\"col-sm-6\" style=\"text-align: center\" id=\"HomeGoals" + match_id + "\"></div><div class=\"col-sm-6\" style=\"text-align: center\" id=\"AwayGoals" + match_id + "\"></div></div>";
			result += "<br><div class=\"row\"><div class=\"col\" style=\"text-align: center\"><h3>Cards & Fouls</h3></div></div>";
			result += "<div class=\"row\"><div class=\"col-sm-6\" style=\"text-align: center\" id=\"HomeCards" + match_id + "\"></div><div class=\"col-sm-6\" style=\"text-align: center\" id=\"AwayCards" + match_id + "\"></div></div>";
			result += "<br><div class=\"row\"><div class=\"col\" style=\"text-align: center\"><h3>Substitutions</h3></div></div>";
			result += "<div class=\"row\"><div class=\"col-sm-6\" style=\"text-align: center\" id=\"HomeSubs" + match_id + "\"></div><div class=\"col-sm-6\" style=\"text-align: center\" id=\"AwaySubs" + match_id + "\"></div></div>";
			document.getElementById("match" + match_id).innerHTML += result;

			displayLineUps(obj, match_id);
			displayGoals(obj, match_id);
			displayCards(obj, match_id);
			displaySubs(obj, match_id);
		}
	});

	xhr.open("GET", "https://stroccoli-futbol-science-v1.p.rapidapi.com/s1/stats/" + match_id);
	xhr.setRequestHeader("x-rapidapi-host", "stroccoli-futbol-science-v1.p.rapidapi.com");
	xhr.setRequestHeader("x-rapidapi-key", "438ba18331msh6814de6ff9c6756p12b320jsn292463a78e9f");

	xhr.send(data);

}

function displayResults(obj) {

	if (obj.status == "error") {

		alert(obj.message);
		return;

	}

	if (obj.length == 0) {

		alert("No game data available");
		return;

	}
	
	console.log(obj);

	for (var i = 0; i < obj.length; i++) {

		var result;

		result = "<div class=\"row\"><div class=\"col-sm-2\" style=\"text-align: center\">";

		if (obj[i].home_team.image != "") {
			result += "<img src=\"" + obj[i].home_team.image + "\" style=\"display:inline-block; height:80px; width:80px;\" /></div>";
		} else {
			result += "</div>";
		}

		result += "<div class=\"col-sm-3\" style=\"text-align: center\">";

		if (obj[i].home_team.full) {
			result += "<h3 style=\"display:inline-block\">" + obj[i].home_team.full + " </h3>";
		} else {
			result += "<h3 style=\"display:inline-block\">" + obj[i].home_team.name.full + " </h3>";
		}

		if (obj[i].result) {
			result += "</div><div class=\"col-sm-2\" style=\"text-align: center\"><h1>" + obj[i].result[0] + "-" + obj[i].result[1] + "</h1>";
		} else {
			result += "</div><div class=\"col-sm-2\" style=\"text-align: center\"><h1>Vs.</h1>";
		}

		if (obj[i].visitant_team.full) {
			result += "</div><div class=\"col-sm-3\" style=\"text-align: center\"><h3 style=\"display:inline-block;\"> " + obj[i].visitant_team.full + "</h3></div>";
		} else {
			result += "</div><div class=\"col-sm-3\" style=\"text-align: center\"><h3 style=\"display:inline-block;\"> " + obj[i].visitant_team.name.full + "</h3></div>";
		}

		if (obj[i].visitant_team.image != "") {
			result += "<div class=\"col-sm-2\" style=\"text-align: center\"><img src=\"" + obj[i].visitant_team.image + "\" style=\"display:inline-block; height:80px; width:80px;\" /></div></div>";
		} else {
			result += "<div class=\"col-sm-2\"></div></div>";
		}

		result += "<br>";

		if ((obj[i].result[0] == obj[i].result[1]) && obj[i].event_outcome_type == "shootout") {
			if (obj[i].home_team.stats.outcome == "win") {
				result += "<div class=\"row\"><div class=\"col\" style=\"text-align: center\"><h4>" + obj[i].home_team.name.full + " wins on penalties</h4></div></div>";
			} else if (obj[i].visitant_team.stats.outcome == "win") {
				result += "<div class=\"row\"><div class=\"col\" style=\"text-align: center\"><h4>" + obj[i].visitant_team.name.full + " wins on penalties</h4></div></div>";
			}
		}

		result += "<div class=\"row\"><div class=\"col\" style=\"text-align: center\"><i class=\"far fa-futbol\"></i><h5>" + obj[i].tournament_name + "</h5></div></div>";

		if (obj[i].tournament_type != "Unknown") {
			result += "<div class=\"row\"><div class=\"col\" style=\"text-align: center\"><h5>" + obj[i].tournament_type + "</h5></div></div><br>";
		} else { result += "<br>"; }

		result += "<div class=\"row\"><div class=\"col\" style=\"text-align: center\"><i class=\"fas fa-calendar-alt\"></i><h5>" + obj[i].date.split("-").reverse().join("/") + "</h5></div></div>";
		result += "<br>";
		result += "<div class=\"row\"><div class=\"col\" style=\"text-align: center\"><i class=\"far fa-clock\"></i><h5>" + obj[i].start_time.split("T")[1].split(".")[0].substring(0,5) + " UTC</h5></div></div>";
		result += "<br>";

		if (obj[i].city && obj[i].stadium) {
			result += "<div class=\"row\"><div class=\"col\" style=\"text-align: center\"><i class=\"fas fa-location-arrow\"></i><h4>" + obj[i].city + " - " + obj[i].stadium + "</h4></div></div>";
		}

		if (obj[i].match_id && obj[i].result) {
			result += "<br><div class=\"row\"><div class=\"col\" style=\"text-align: center\"><button class=\"btn btn-primary\" id=\"Button" + obj[i].match_id + "\" onclick=\"showMatchDetails(\'" + obj[i].match_id + "\')\">View Match Details</button></div></div><br><div id=\"match" + obj[i].match_id + "\"></div><br>";
		}

		result += "<hr>";

		document.getElementById("results").innerHTML += result + "</br><br/>";

	}

}

function displayFixtures(obj) {

	if (obj.status == "error") {

		alert(obj.message);
		return;

	}

	if (obj.length == 0) {

		alert("No game data available");
		return;

	}
	
	console.log(obj);

	for (var i = 0; i < obj.length; i++) {

		var result;

		result = "<div class=\"row\"><div class=\"col-sm-2\" style=\"text-align: center\">";

		if (obj[i].home_team.image != "") {
			result += "<img src=\"" + obj[i].home_team.image + "\" style=\"display:inline-block; height:80px; width:80px;\" /></div>";
		} else {
			result += "</div>";
		}

		result += "<div class=\"col-sm-3\" style=\"text-align: center\">";

		if (obj[i].home_team.full) {
			result += "<h3 style=\"display:inline-block\">" + obj[i].home_team.full + " </h3>";
		} else {
			result += "<h3 style=\"display:inline-block\">" + obj[i].home_team.name.full + " </h3>";
		}

		result += "</div><div class=\"col-sm-2\" style=\"text-align: center\"><h1>Vs.</h1>";

		if (obj[i].visitant_team.full) {
			result += "</div><div class=\"col-sm-3\" style=\"text-align: center\"><h3 style=\"display:inline-block;\"> " + obj[i].visitant_team.full + "</h3></div>";
		} else {
			result += "</div><div class=\"col-sm-3\" style=\"text-align: center\"><h3 style=\"display:inline-block;\"> " + obj[i].visitant_team.name.full + "</h3></div>";
		}

		if (obj[i].visitant_team.image != "") {
			result += "<div class=\"col-sm-2\" style=\"text-align: center\"><img src=\"" + obj[i].visitant_team.image + "\" style=\"display:inline-block; height:80px; width:80px;\" /></div></div>";
		} else {
			result += "<div class=\"col-sm-2\"></div></div>";
		}

		result += "<br><div class=\"row\"><div class=\"col\" style=\"text-align: center\"><i class=\"far fa-futbol\"></i><h5>" + obj[i].tournament_name + "</h5></div></div>";

		if (obj[i].tournament_type != "Unknown") {
			result += "<div class=\"row\"><div class=\"col\" style=\"text-align: center\"><h5>" + obj[i].tournament_type + "</h5></div></div><br>";
		} else { result += "<br>"; }

		result += "<div class=\"row\"><div class=\"col\" style=\"text-align: center\"><i class=\"fas fa-calendar-alt\"></i><h5>" + obj[i].date.split("-").reverse().join("/") + "</h5></div></div>";
		result += "<br>";
		result += "<div class=\"row\"><div class=\"col\" style=\"text-align: center\"><i class=\"far fa-clock\"></i><h5>" + obj[i].start_time.split("T")[1].split(".")[0].substring(0,5) + " UTC</h5></div></div>";
		result += "<br>";

		if (obj[i].city && obj[i].stadium) {
			result += "<div class=\"row\"><div class=\"col\" style=\"text-align: center\"><i class=\"fas fa-location-arrow\"></i><h4>" + obj[i].city + " - " + obj[i].stadium + "</h4></div></div>";
		}

		result += "<hr>";

		document.getElementById("results").innerHTML += result + "</br><br/>";

	}

}
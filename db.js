// JavaScript Document

//function init() {
	//alert('1');
	//document.addEventListener("deviceready", deviceready, true);
//}

$(document).on('deviceready', deviceready);

var db;

function deviceready() {
	alert('2');
	db = window.openDatabase("test", "1.0", "test", 1000000);
	db.transaction(setup, errorHandler, dbReady);
}

function setup(tx) {
	alert('3');
	tx.executeSql('create table if not exists euro(id INTEGER PRIMARY KEY AUTOINCREMENT, q1 TEXT, q2 TEXT, created DATE)');
}

function errorHandler(e) {
	alert(e.message);
}

function dbReady() {
	$("#addButton").on("click", function(e){
		alert('4');
		db.transaction(function(tx) {
			var q1 = "prueba";
			var q2 = "prueba2";
			tx.executeSQL("insert into euro(q1,q2) values('?,?')",[q1,q2]);
		}, errorHandler, function() { $("#result").html("Guardado."); });
	});

	$("#consultar").on("click", function(e){
		alert('5');
		db.transaction(function(tx) {
			tx.executeSql("select * from euro order by created desc", [], gotLog,errorHandler);
		},errorHandler, function() {});
	});
}

function gotLog(tx, results) {
	if(results.rows.length == 0) {
		$("#result").html("Sin datos.");
		return false;
	}

	var s = "";
	for(var i=0; i<results.rows.length; i++) {
		var d = new Date();
		d.setTime(results.rows.item(i).created);
		s += d.toDateString() + " "+d.toTimeString() + "<br />";
	}
}

$("#results").html(s);
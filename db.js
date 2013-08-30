// global variables
var db;
var shortName = 'WebSqlDB';
var version = '1.0';
var displayName = 'WebSqlDB';
var maxSize = 65535;
 
// this is called when an error happens in a transaction
function errorHandler(transaction, error) {
   alert('Error: ' + error.message + ' code: ' + error.code);
}
 
// this is called when a successful transaction happens
function successCallBack() {
   //alert("DEBUGGING: success");
}
 
function nullHandler(){};
 
// called when the application loads
function onBodyLoad(){
 
    // This alert is used to make sure the application is loaded correctly
    // you can comment this out once you have the application working
    alert("DEBUGGING: we are in the onBodyLoad() function");

    if (!window.openDatabase) {
     // not all mobile devices support databases  if it does not, the following alert will display
     // indicating the device will not be albe to run this application
     alert('Databases are not supported in this browser.');
     return;
    }

    // this line tries to open the database base locally on the device
    // if it does not exist, it will create it and return a database object stored in variable db
    db = openDatabase(shortName, version, displayName,maxSize);

    // this line will try to create the table User in the database just created/openned
    db.transaction(function(tx){

    // you can uncomment this next line if you want the User table to be empty each time the application runs
    // tx.executeSql( 'DROP TABLE User',nullHandler,nullHandler);

    // this line actually creates the table User if it does not exist and sets up the three columns and their types
    // note the UserId column is an auto incrementing column which is useful if you want to pull back distinct rows
    // easily from the table.
    tx.executeSql( 'CREATE TABLE IF NOT EXISTS User(Id INTEGER NOT NULL PRIMARY KEY, pregunta TEXT NOT NULL, foto TEXT NOT NULL)',
      [],nullHandler,errorHandler);
    },errorHandler,successCallBack);
 
}
 
// list the values in the database to the screen using jquery to update the #lbUsers element
function ListDBValues() {
    alert("list refresh");
    if (!window.openDatabase) {
      alert('Databases are not supported in this browser.');
      return;
    }
 
    // this line clears out any content in the #lbUsers element on the page so that the next few lines will show updated
    // content and not just keep repeating lines
    $('#lbUsers').html('');
 
    // this next section will select all the content from the User table and then go through it row by row
    // appending the UserId  FirstName  LastName to the  #lbUsers element on the page
    db.transaction(function(transaction) {
     transaction.executeSql('SELECT * FROM User;', [],
       function(transaction, result) {
        if (result != null && result.rows != null) {
          for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            $('#lbUsers').append('<br>' + row.Id + '. ' + row.pregunta+ ' ' + row.foto);
          }
        }
       },errorHandler);
    },errorHandler,nullHandler);

    return;
}
 
// this is the function that puts values into the database using the values from the text boxes on the screen
function AddValueToDB() {
    var q1 = $('#checkbox-1a').val();
    var q2 = $('#lafoto').val();
    if (!window.openDatabase) {
      alert('Databases are not supported in this browser.');
      return;
    }
  
    // this is the section that actually inserts the values into the User table
    db.transaction(function(transaction) {
        transaction.executeSql('INSERT INTO User(pregunta, foto) VALUES (?,?)',[q1, q2], nullHandler,errorHandler);   
    });
 
    // this calls the function that will show what is in the User table in the database
    //pictureSource=navigator.camera.PictureSourceType; 
    //destinationType=navigator.camera.DestinationType;

    uploadPhoto(q2);
    ListDBValues();
    return false;
}

function onFileSystemSuccess(fileSystem) {
    alert(fileSystem.name);
}

function onResolveSuccess(fileEntry) {
    console.log(fileEntry.name);
}

function fail(evt) {
    alert(evt.target.error.code);
}


function uploadPhoto(imageURI) {
    alert('1');
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType="image/jpeg";

    var params = {};
    params.value1 = "test";
    params.value2 = "param";

    options.params = params;

    var ft = new FileTransfer();
    ft.upload(imageURI, "http://www.eurofashion.cl/app_euro/", win, fail, options);
}	
	
function win(r) {
    alert('3');
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
}

function fail(error) {
    alert('4');
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}

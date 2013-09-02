$(document).on('deviceready', onDeviceReady);
function onDeviceReady(){
	$('#btnCamera').on('click', function() {
		sessionStorage.removeItem('imagepath');
		navigator.camera.getPicture(onSuccessCamera, onErrorCamera, {destinationType : Camera.DestinationType.FILE_URI , 
															        sourceType : Camera.PictureSourceType.CAMERA,
															        allowEdit : false,
																    targetWidth:  1024,
															        targetHeight: 1024,
															    	quality : 80,
															    	correctOrientation : true,
															    	saveToPhotoAlbum : false});
											
	});

	onBodyLoad();
}

function onSuccessCamera(imageData){
	var imagen = $('.capture > img');
		imagen.attr({ 'src': imageData, "width" : "320px"} );
		imagen.css( 'display', 'block');
		movePic(imageData);
}

function onErrorCamera(message){
	console.log("Error:" + message);
}

function movePic(file){ 
    window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError); 
} 

//Callback function when the file system uri has been resolved
function resolveOnSuccess(entry){ 
    var d = new Date();
    var n = d.getTime();
    //new file name
    var newFileName = n + ".jpg";
    var myFolderApp = "Eurofashion";

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
    	function(fileSys) {      
		    //The folder is created if doesn't exist
		    fileSys.root.getDirectory( myFolderApp, {create:true, exclusive: false}, 
		    	function(directory) {
										entry.moveTo(directory, newFileName,  successMove, resOnError);
									}, resOnError);
        },
    resOnError);
}

//Callback function when the file has been moved successfully - inserting the complete path
function successMove(entry) {
    //Store imagepath in session for future use
    // like to store it in database
    sessionStorage.setItem('imagepath', entry.fullPath);
    $("#lafoto").val(entry.fullPath);	
}

function resOnError(error) {
    alert(error.code);
}
///////global vars
var current_add;
var date_add;
var invited="";
var marker;
var map;
var level=1;





////////////handle drag event for map pointer
function handleDrag(event){
    coordinates_to_address(event.latLng.lat(),event.latLng.lng());      
    placeMarker(map, event.latLng);
    date_add = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };

}




///////////////////// place marker
function placeMarker(map, location) {
    
  
  if(marker !=null){
    marker.setMap(null);
  }
  console.log(location.lat);
  console.log(map);
  marker = new google.maps.Marker({
    position: location,
    map: map,
    draggable:true,
    animation: google.maps.Animation.DROP,
    icon: "./img/home.png"
  }); 
  
 
  marker.addListener('dragend', handleDrag);
}



////////////// coordinates => formated address
function coordinates_to_address(lat, lng) {

    var formatedAdd; 
    var geocoder = new google.maps.Geocoder;
    var latlng = new google.maps.LatLng(lat, lng);
  
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if(status == google.maps.GeocoderStatus.OK) {
           
            if(results[0]) {
                formatedAdd= results[0].formatted_address;
            } else {
              formatedAdd= "I can't say where are you!";
            }
        } else {
            // alert('Geocoder failed due to: ' + status);
            formatedAdd= "Probably your GPS is disabled";
        }
        $("#address").text(formatedAdd);
    });
  }
  
  
  
/////////////////set map to its div
  function setMap(){
  
    var x,y;

    if(current_add!=null){
      x=current_add.lat;
      y=current_add.lng;
    }else{
      x=32.637758;
      y=51.676933;
    }

 coordinates_to_address(x,y);
//////////intial map with customized style
  function initMap() {
    
    var styledMapType = new google.maps.StyledMapType(
      [
        {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#444444"
                }
            ]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#333666"
                }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#31b9c1"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#f2f2f2"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": 45
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#46bcec"
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#31b9c1"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#31b9c1"
                }
            ]
        }
    ],
    {name: 'Styled Map'}
    );


    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: parseFloat(x), lng: parseFloat(y)},
      zoom: 13,
      mapTypeControlOptions:{
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
        'styled_map']
      }
    });

    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');


/*    google.maps.event.addListener(map, 'dragend', function(event) {
      coordinates_to_address(event.latLng.lat(), event.latLng.lng());    
      placeMarker(map, event.latLng);
      date_add = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      
    });    
    */
//////////////////handle click event on map for map pointer
    google.maps.event.addListener(map, 'click', function(event) {
      coordinates_to_address(event.latLng.lat(),event.latLng.lng());      
      placeMarker(map, event.latLng);
      date_add = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
    });    



/////initiate marker
    var image = {
      url: './img/home.png',
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(64, 64),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 48)
    };
     marker = new google.maps.Marker({
      position: {lat: parseFloat(x), lng: parseFloat(y)},
      map: map,
      draggable:true,
      animation: google.maps.Animation.DROP,  
      icon: image
    }); 
  }
  
  

////////call map ini
  initMap();
  
  }


////////////////get current position when its ready
  $(window).on('load', function () {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(positionSuccess,positionError);
 } else {
   // Browser doesn't support Geolocation
   var r=confirm("You'r location is unavailable,continue anyway?");
   if(r){
     setMap();
   }else{
     location.reload();
   }
 } 
   
  });
  
   ///if GPS is available
function positionSuccess(position) {
    current_add = {
     lat: position.coords.latitude,
     lng: position.coords.longitude
   };
   //setTimeout(function(){coordinates_to_address(pos.lat, pos.lng);},500); 
   return setMap();
 }

 ///if GPS is not available
function positionError(){
  var r=confirm("You'r location is unavailable,continue anyway?");
  if(r){
    current_add=null;
    return setMap();
  }else{
    location.reload();
  }

}


////////////////////////////////////////////////////////////////////////////////




////////////////////hide map after choose position
function hideMap(){
  $("#map").animate({marginTop:'-100%'},1000);
  $("#title").text("قرار کی باشه؟");
  $("#address").animate({top:'10vh'},1100);
 // setTimeout(function(){$("#map").remove();},2000);
  $("#date").show();
  $("#date").animate({marginTop:'26vh'},1200);
  $("#time").show();
  $("#time").animate({marginTop:'3vh'},1300);
  $("#friends").show();
  setTimeout(function(){$("#friends").animate({marginTop:'4vh'},800);},800);
  $("#next").text("ثبت");
  $("#next").attr("onclick","setDate()");
  level=0;
}
/////////////////////////show map again
function showMap(){
 
  $("#map").animate({marginTop:'18%'},1000);
  $("#title").text("قرار کجا باشه؟");
  setTimeout(function(){$("#friends").animate({marginTop:'100vh'},800);},800);
  $("#friends").hide();
  $("#time").animate({marginTop:'90vh'},1300);
  setTimeout(function(){$("#time").hide();},1300);
  $("#date").animate({marginTop:'80vh'},1200);
  setTimeout(function(){$("#date").hide();},1200);
  $("#address").animate({top:'65vh'},1100); 
  $("#next").text("ادامه");
  $("#next").attr("onclick","hideMap()");
  level=1;

}
//////////////////////////////////////////////////////////////////////////




//////////////////////////////////////////////////////////////////////////
/////////////DOCUMENT READY EVENT's /////////////////////////////////////

$(document).ready(function(){

  

  //////audio///////
  document.getElementById("record").addEventListener('click',()=>{
   
    console.log("audio capture fired");
    var options = {
       limit: 1,
       duration: 60
    };

    navigator.device.capture.captureAudio(onSuccess, onError, options);
 
    $("#attachFile").hide();
    $("#addNote").hide();
    $("#iconRow2").hide();
    $("#player").show();
    $("#record").css('margin-left','40%');

    function onSuccess(mediaFiles) {
       var  path,recordedVoice,stat,interval,i=4;
       
        path = mediaFiles[0].fullPath;
        recordedVoice = new Media(path, function(){console.log("well played!")}, function(e){console.log("you suck:(=>"+e)},function(status){stat=status});
        recordedVoice.play();
        recordedVoice.pause();

        ////playBTN listener event
          document.getElementById("playBTN").addEventListener("click",()=>{
             
            var constant=96/(recordedVoice.getDuration()*10);
             progressBar=document.getElementById("progressBar");

             ///// forward progressBar
             function forwardSeeker(){
                 console.log("status:"+stat+" percent:"+i);
                 
                 i=i+constant;
                if(stat==4){
                    
                    i=4;
                    progressBar.style.width=i+'%';
                    $("#playBTN").css('background-image','url(./img/play.svg)');
                    clearInterval(interval);
                    }

                     progressBar.style.width=i+'%';
                 }

             if(stat==2){

                recordedVoice.pause();
                $("#playBTN").css('background-image','url(./img/play.svg)');
                clearInterval(interval);

             }else{

                recordedVoice.play()
                $("#playBTN").css('background-image','url(./img/pause.svg)');
                interval=setInterval(forwardSeeker,100);   
             }


          });
          ///voiceConfirmState() #HERE#
          
          //recordedVoice.play();
      
    }
 
    function onError(error) {
       navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    }
  });
  



  /////////////////////scroll determination////////////
  var Tstart,Tend;

  var obj = document.getElementById("container");
  obj.addEventListener('touchstart', function(event) {
    // If there's exactly one finger inside this element
    if (event.targetTouches.length == 1) {
      var touch = event.targetTouches[0];
      // Place element where the finger is
      Tstart = touch.pageY;
      console.log("start:"+Tstart);
    }
  }, false);

  obj.addEventListener('touchend', function(event) {
    // If there's exactly one finger inside this element
    
      var touch = event.changedTouches[0];
      // Place element where the finger is
      Tend = touch.pageY;
      console.log("end:"+Tend);

      if (70<Tstart-Tend){
        //hide map(set level 0)
        if(level==1)
        hideMap();
     }
     if(70<Tend-Tstart){

      if(level==0)
      showMap();

     }
       //unhide (set level 1)
  }, false);





  /////////////////////keyboadr show/hide handler ////////////
  window.addEventListener('keyboardDidShow', (event) => {
  // Describe your logic which will be run each time keyboard is shown.
  $("#title").text('کی بیاد؟');
  $("#friends").css('margin-top','16vh');
  $("#friends").css('height','8vh');
  $("#founded").css('height','48vh');
  $("#address").hide();
  $("#date").hide();
  $("#time").hide();

});
window.addEventListener('keyboardDidHide', () => {
///////////////// Describe your logic which will be run each time keyboard is closed.
  $("#founded").css('height','18vh');
  $("#friends").css('margin-top','4vh');
  $("#address").show();
  $("#date").show();
  $("#time").show();
  $("#title").text('مشخصات قرار');
});

//////////////////trigger when pressing key for contact search
  $("input").keyup(function(){
    
    function onSuccess(contacts) {

      $("#founded").remove();
      founded_div=document.createElement("div");
      founded_div.setAttribute('id','founded');
      var temp_list;
      for (var i = 0; i < contacts.length; i++) {
        //alert(contacts[i].phoneNumbers[0].value);
        alert(contacts[i].photos[0].value);
        temp_list=document.createElement("div");
        temp_list.className="contactList";
        temp_list.innerHTML=contacts[i].displayName+" : "+contacts[i].phoneNumbers[0].value;
        founded_div.appendChild(temp_list);
     }
     document.getElementById('friends').after(founded_div);
  };
  
  function onError(contactError) {
      alert('onError!');
  };
/////////////////// find all contacts with 'Bob' in any name field
  var options      = new ContactFindOptions();
  options.filter   = $("#addUser").val();
  options.multiple = true;
  options.hasPhoneNumber = true;
  var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
  navigator.contacts.find(fields, onSuccess, onError, options);  
  });


});///////////////end of document ready events


///////////////////////////////////////////////////
/////////show camera/recorder and file manager icon
function showAttachRow(){
    $("#iconRow2").hide();
    $("#addNote").hide();
    $("#record").hide();
    $("#attachFile").css('margin-left','40%');
    $("#fileRow").show();
}



///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

//////////////////DEVICE READY EVENTS/////////////////////////
document.addEventListener('deviceready', function () {
    // cordova.plugins.backgroundMode is now available
    cordova.plugins.backgroundMode.enable();

}, false);//////end of device ready events




////////////////////////////////////////////////////////////////////////////////
///////send sms ##### TODO : sending multiple messages is only available in INTENT, do it  "foreach" contact....
var app = {
  sendSms: function() {
      var number ="'"+ invited+"'";
      var message = "some message";
      //CONFIGURATION
      var options = {
          replaceLineBreaks: false, // true to replace \n by a new line, false by default
          android: {
              intent: ''  // send SMS with the native android SMS messaging
              //intent: '' // send SMS without open any other app
          }
      };

      var success = function () { alert('Message sent successfully '+number); };
      var error = function (e) { alert('Message Failed:' + e); };
      sms.send(number, message, options, success, error);
  }
};


///////////////////////////////////////////////////////
////////////////////////////// set and confirm date

function setDate(){

  function calculateDistance(origin, destination) {
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
    {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
      avoidHighways: false,
      avoidTolls: false
    }, callback);
  }

  function callback(response, status) {
    if (status != google.maps.DistanceMatrixStatus.OK) {
    alert(err);
    } else {
      var origin = response.originAddresses[0];
      var destination = response.destinationAddresses[0];
      if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
       alert("مسیر انتخابی شما احتمالا به هواپیما نیاز دارد.");
      } else {
        var distance = response.rows[0].elements[0].duration;
        var distance_value = distance.value;
        var distance_text = distance.text;
        var miles = distance_text;//.substring(0, distance_text.length - 3);
        alert("زمان پیمایش مسیر:"+miles);
      }
    }
  }
    
     
  //1
     calculateDistance(current_add, date_add);
}
///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////






//////////////add invited No. to Gvar
function addNumber(No){
    if(invited.length>0){
      invited=invited+","+No;
    }else{
      invited=No;
    }
    alert(invited);  
  }
  //////////////////////////////////////////
  ////////////////////////////////////////
//  function playRecorded(duration){
//}

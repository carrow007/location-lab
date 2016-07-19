// document.addEventListener("DOMContentLoaded", function(){

console.log("main.js loaded");
var searchBtn = document.querySelector("#search-location");
var apiPublicKeyQuery = "?key=" + API_KEY;
var map;
var longitude, latitude;
var currentLocation;
var userInput;
var service;
var infoWindow;
function initMap() {

///// start *partially from google map's API*
  currentLocation = new google.maps.LatLng(latitude,longitude);
  map = new google.maps.Map(document.getElementById('map'), {
    center: currentLocation,
    zoom: 15
  });

  var request = {
    location: currentLocation,
    radius: '30',
    query: userInput
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
  };

function success(pos) {
  latitude = pos.coords.latitude;
  longitude = pos.coords.longitude;
  initMap();
  };
function error(){
  };

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    };
  };
};
function createMarker(res) {
    var marker = new google.maps.Marker({
      position: res.geometry.location,
      map: map
    });
    infoWindow = new google.maps.InfoWindow({
        content: ""
    });

////// end of portion from the google maps API

////// creating a favorite button to grab the location and put it in the database
    google.maps.event.addListener(marker, "click", function(){
      infoWindow.setContent(res.name + "<button type='button' id='fav'>Fav it!</button");
      infoWindow.open(map, this);
      document.querySelector("#fav").addEventListener("click", function(){
        var location = {
          name: res.name,
          address: res.formatted_address
        }
        console.log(location);
        $.post('http://localhost:3000/locations', location, function(response){
          console.log("Response:", response);
        });
      });
    });
  }; ////// end of Createmarker and placing the favorite button inside it.



   searchBtn.addEventListener("click", function(){
   navigator.geolocation.getCurrentPosition(success,error);
   userInput = document.querySelector("#location-text").value;
 });


 ////// view all the favoirtes
      document.getElementById("viewAll").addEventListener("click", function(){

        $.get('http://localhost:3000/locations', function(response){
          console.log("Response:", response);
        });
      });
 ////// end view all


 ////// start of delete
    document.getElementById('deleteBtn').addEventListener('click', function() {
    var deleteName = document.getElementById('locDel').value;
    console.log("deleting: ", deleteName);
    var data = {
      name: deleteName
    };
    $.ajax({
      url: 'http://localhost:3000/locations/' + deleteName,
      dataType: 'json',
      data: data,
      method: 'delete'
    }).done(function(response){
      console.log(deleteName + " has been deleted.");
      console.log(response);
    }); // end ajax
  }); // end delete button

 ////// start update button
    document.getElementById('updateBtn').addEventListener('click', function() {
      var descriptionToUpdate = document.querySelector('updateBtn').value;
      var newDescription = document.querySelector('newUpdate').value;
      var data = {
        name: descriptionToUpdate,
        newDescription: newDescription,
      };
        $.ajax({
          url: 'http://localhost:3000/locations/' + descriptionToUpdate,
          dataType: 'json',
          method: 'put',
          data: data
      }).done(function(response){
        console.log(response);
    }); // end ajax

  }); // end update button
// });



import { Controller } from "./Controller/controller";
import { GOOGLE_API_KEY } from "./config.js";
import { Restaurant } from "./Models/restaurant";

let script = document.createElement("script");
script.src =
  "https://maps.googleapis.com/maps/api/js?key=" +
  GOOGLE_API_KEY +
  "&libraries=places&callback=initMap";

script.async = true;
document.head.appendChild(script);

window.initMap = function () {
  navigator.geolocation.getCurrentPosition((position) => {
    // Une fois qu'on a la position, on peut créer la carte.
    const { latitude, longitude } = position.coords;
    /* const buttonAddRestaurant = document.createElement('button');
    buttonAddRestaurant.id = 'addRestaurant'; */
    let googleMap = new google.maps.Map(document.getElementById("map"), {
      center: { lat: latitude, lng: longitude },
      zoom: 14,
    });

    
   
    let service = new google.maps.places.PlacesService(googleMap);
    
    let controller = new Controller(googleMap, service);
    controller.showMain();
    window.controller = controller;
  });
};

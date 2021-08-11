import { Controller } from "./Controller/controller";

let script = document.createElement("script");
script.src =
  "https://maps.googleapis.com/maps/api/js?key=" +
  GOOGLE_API_KEY +
  "&callback=initMap";
script.async = true;
document.head.appendChild(script);

window.initMap = function () {
  navigator.geolocation.getCurrentPosition((position) => {
    // Une fois qu'on a la position, on peut créer la carte.
    const { latitude, longitude } = position.coords;
    let googleMap = new google.maps.Map(document.getElementById('map'), {
      center: { lat: latitude, lng: longitude },
      zoom: 11,
    });
    let controller = new Controller(googleMap);
    controller.showMain();
    window.controller = controller;
  });
};

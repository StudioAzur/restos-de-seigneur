import { RestaurantManager } from "../Models/restaurantManager";
import { View } from "../Views/view";

export class Controller {
  constructor(googleMap) {
    this.googleMap = googleMap;
    this.infoWindow = null;

    this.restaurantManager = new RestaurantManager();
    this.view = new View();
  }

  async initData() {
    await this.restaurantManager.fillInFromJson();
  }

  async showMain() {
    await this.initData();
    let myList = this.restaurantManager.getMyRestaurants();

    this.createMarker(myList, "ressources/img/sand.png");
    this.view.showListRestaurant(myList);
    this.getGeolocation();
  }

  createMarker(listRestaurant, image) {
    for(let currentRestaurant of listRestaurant){
      let marker = new google.maps.Marker({
        position: {
          lat: parseFloat(currentRestaurant.lat),
          lng: parseFloat(currentRestaurant.long),
        },
        map: this.googleMap,
        title: currentRestaurant.restaurantName,
        icon: new google.maps.MarkerImage(image),
        idRestaurant: currentRestaurant.id,
      });
      marker.addListener("click", () => {
        this.showDetails(marker.idRestaurant);
      });
    }
  }
 
  showDetails(idRestaurant) {
    let currentRestaurant = this.restaurantManager.getRestaurantById(idRestaurant);
    this.view.showDetailsRestaurant(currentRestaurant);
  }

  getGeolocation() {
    const contentString =
      '<div id="content">' + "<h4>Vous êtes ici</h4>" + "</div>";
    this.infoWindow = new google.maps.InfoWindow({
      content: contentString,
    });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.infoWindow.setPosition(pos);
          this.infoWindow.open(this.googleMap);
          this.googleMap.setCenter(pos);
        },
        () => {
          handleLocationError(
            true,
            this.infoWindow,
            this.googleMap.getCenter()
          );
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, this.infoWindow, this.googleMap.getCenter());
    }
  }
}

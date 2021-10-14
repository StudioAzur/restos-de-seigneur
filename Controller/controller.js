import { RestaurantManager } from "../Models/restaurantManager";
import { View } from "../Views/view";

export class Controller {
  constructor(googleMap) {
    this.googleMap = googleMap;
    this.infoWindow = null;
    this.image =  "ressources/img/sand.png";

    this.restaurantManager = new RestaurantManager();
    this.view = new View(googleMap, this.image);
  }

  async initData() {
    await this.restaurantManager.fillInFromJson();
  }

  async showMain() {
    await this.initData();
    this.view.map = this.googleMap;
    let myList = this.restaurantManager.getMyRestaurants();
    const restaurants = myList.map(restaurant => {
      restaurant.average = restaurant.calculateAverage();
      return restaurant;
    })
    sessionStorage.setItem('restaurants', JSON.stringify(restaurants));
    this.view.showListRestaurant(myList);
    this.view.createMarker(myList); 
    this.getGeolocation();
    this.view.showSelector();
    
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

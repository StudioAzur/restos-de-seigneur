import { RestaurantManager } from "../Models/restaurantManager";
import { View } from "../Views/view";
import { Rating } from "../Models/rating";
import { Restaurant } from "../Models/restaurant";

export class Controller {
  constructor(googleMap, googlePlaceService) {
    this.googleMap = googleMap;
    this.googlePlaceService = googlePlaceService;
    this.infoWindow = null;
    this.image = "ressources/img/sand.png";
    this.getGeolocation();

    this.restaurantManager = new RestaurantManager();
    this.view = new View(googleMap, this.image);
    this.view.addEventOnMap();
  }

  reset() {
    sessionStorage.removeItem("mesRestaurants");
  }

  async initData() {
    let resultJson = await this.restaurantManager.fillInFromJson();
    let center = this.googleMap.getCenter();
    let request = {
      query: "restaurant",
      radius: "10",
      location: { lat: center.lat(), lng: center.lng() },
    };
    this.googlePlaceService.textSearch(request, callback.bind(this));

    function callback(results, status) {
      //if (status == this.googleMap.places.PlacesServiceStatus.OK) {
      let newPlace = [];
      let place = {};
      for (let i = 0; i < 10; i++) {
        place = new Restaurant();
        place.withGoogle(results[i]);
        newPlace.push(place);
      }
      //}
      const initialList = resultJson.concat(newPlace);
      sessionStorage.setItem("mesRestaurants", JSON.stringify(initialList));
    }
    return resultJson;
  }

  async showMain() {
    await this.initData();
    this.view.map = this.googleMap;
    let myInitialList =
      this.restaurantManager.getMyRestaurantsFromSessionStorage();
      myInitialList.slice(0, 10).map((restaurant) => {
      restaurant.average = restaurant.calculateAverage(restaurant.ratings);
      return restaurant;
    });
    //TODO
    //sessionStorage.setItem("mesRestaurants", JSON.stringify(restaurants));
    this.view.showListRestaurant(myInitialList);
    this.view.createMarker(myInitialList);
    this.view.showSelector();
  }

  showDetails(idRestaurant) {
    let currentRestaurant =
      this.restaurantManager.getRestaurantById(idRestaurant);
    this.view.showComment(currentRestaurant);
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

  saveNewComment(idRestaurant, comment, star) {
    const listRestaurants = JSON.parse(
      sessionStorage.getItem("mesRestaurants")
    );
    //sessionStorage.removeItem("mesRestaurants");
    //trouver le bon restaurant
    for (let restaurant of listRestaurants) {
      if (restaurant.id == idRestaurant) {
        restaurant.ratings.push(new Rating(star, comment));
        //listRestaurants[index] = restaurant;
        let newList = JSON.stringify(restaurant);
        if (
          !listRestaurants.includes(newList) &&
          listRestaurants.length <= 20
        ) {
          sessionStorage.setItem("mesRestaurants", newList);
        }
        this.restaurantManager.listRestaurant = listRestaurants;
        return restaurant;
      }
    }
  }
  saveNewRestaurant(idRestaurant, address, name, latitude, longitude) {
    const listRestaurants = JSON.parse(
      sessionStorage.getItem("mesRestaurants")
    );
    const restaurant = new Restaurant();
    restaurant.id = idRestaurant;
    restaurant.address = address;
    restaurant.restaurantName = name;
    restaurant.lat = latitude;
    restaurant.long = longitude;
    listRestaurants.push(restaurant);
    let newList = JSON.stringify(listRestaurants);
    sessionStorage.setItem("mesRestaurants", newList);
    this.showMain();
    return restaurant;
  }

  createMarkerForNewRestaurant(list) {
    this.view.createMarker(list);
  }
  addListenerOnMap() {
    this.googleMap.addListener("dragend", () => {
      this.showMain();
    });
  }
}

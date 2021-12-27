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
    this.addListenerOnMap();
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
        let newIndex = i + 1;
        place = new Restaurant();
        place.withGoogle(results[i]);
        newPlace.push(place);
        place.id = newIndex;
      }
      //}
      if (sessionStorage.getItem("mesRestaurants")) {
        this.reset();
      }
      sessionStorage.setItem("mesRestaurants", JSON.stringify(newPlace));
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
    let myRestaurants;
    for (let restaurant of listRestaurants) {
      if (restaurant.id == idRestaurant) {
        if (!restaurant.ratings) {
          restaurant.ratings = [];
          restaurant.ratings.push({ stars: "", comment: "" });
        }
        restaurant.ratings.push(new Rating(star, comment));
        let newList = [...listRestaurants, restaurant];

        if (sessionStorage.getItem("mesRestaurants")) {
          //Storage.removeItem('mesRestaurants')
          //   this.reset()
          sessionStorage.setItem("mesRestaurants", JSON.stringify(newList));
        }
        this.restaurantManager.listRestaurant = listRestaurants;
        myRestaurants = restaurant;
      }
    }
    return myRestaurants;
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
    if (sessionStorage.getItem("mesRestaurants")) {
      //Storage.removeItem('mesRestaurants')
      this.reset();
    }
    sessionStorage.setItem("mesRestaurants", newList);
    this.showMain();
    return restaurant;
  }

  createMarkerForNewRestaurant(list) {
    this.view.createMarker(list);
  }
  addListenerOnMap() {
    this.reset();
    this.googleMap.addListener("dragend", (e) => {
      this.showMain();
    });
  }
}

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
        let newIndex = i + 1
        place = new Restaurant();
        console.log(results[i]);
        place.withGoogle(results[i]);
        newPlace.push(place);
        place.id = newIndex
      }
      //}
      if(sessionStorage.getItem('mesRestaurants')){
        console.log('clear 1')
        console.log(newPlace.length)
        Storage.removeItem('mesRestaurants')
        this.reset()
      }
      console.log('add ID', newPlace)
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
      console.log("before show comment", currentRestaurant)
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
    console.log('init save new comment input :', idRestaurant)
    const listRestaurants = JSON.parse(
      sessionStorage.getItem("mesRestaurants")
    );
    let toto
    console.log('inside loop all resto',listRestaurants)
    for (let restaurant of listRestaurants) {
      console.log('inside loop show ID',restaurant.id)

      if (restaurant.id == idRestaurant) {
        if(!restaurant.ratings){
          restaurant.ratings = []
          restaurant.ratings.push({stars : "", comment : ""})
        }
        restaurant.ratings.push(new Rating(star, comment));
       let newList = [...listRestaurants,restaurant]
       console.log('new list concat', newList)
        
          if(sessionStorage.getItem('mesRestaurants')){
            //Storage.removeItem('mesRestaurants')
            console.log('clear 2')
         //   this.reset()
          sessionStorage.setItem("mesRestaurants", JSON.stringify(newList));
        }
        this.restaurantManager.listRestaurant = listRestaurants;
        console.log('réassign restaurant toto', restaurant)
        toto = restaurant
      
      }
    }
    return toto
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
    if(sessionStorage.getItem('mesRestaurants')){
      //Storage.removeItem('mesRestaurants')
      console.log('clear 3')
      this.reset()
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

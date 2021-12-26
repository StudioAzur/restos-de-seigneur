import { Ajax } from "./ajax";
import { Restaurant } from "./restaurant";

export class RestaurantManager {
  constructor() {
    this.listRestaurant = [];
    this.initialized = false;
  }

  async fillInFromJson() {
    if (this.initialized == false) {
      let ajax = new Ajax();
      let data = await ajax.getListRestaurant();
      for (let currentRestaurant of data) {
        let newRestaurant = new Restaurant().withJson(
          currentRestaurant,
          this.listRestaurant.length + 1
        );
        this.listRestaurant.push(newRestaurant);
      }
    }
    this.initialized = true;
    return this.listRestaurant;
  }

  getMyRestaurantsFromSessionStorage() {
    let listRestaurantFromSessionStorage = sessionStorage.getItem("mesRestaurants");
    if (
      listRestaurantFromSessionStorage &&
      listRestaurantFromSessionStorage.length > 0
    ) {
      this.listRestaurant = [];
      let initialList = JSON.parse(listRestaurantFromSessionStorage);
      for (let currentRestaurant of initialList) {
        let newRestaurant = new Restaurant().withJson(
          currentRestaurant,
          this.listRestaurant.length + 1
        );
        this.listRestaurant.push(newRestaurant);
      }
    }
    console.log(this.listRestaurant);
    return this.listRestaurant;
  }

  getRestaurantById(idRestaurant) {
    for (let selectRestaurant of this.listRestaurant) {
      if (selectRestaurant.id == idRestaurant) {
        return selectRestaurant;
      }
    }
    return null;
  }
}

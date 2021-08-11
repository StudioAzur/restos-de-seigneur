import { Ajax } from "./ajax";
import { Restaurant } from "./restaurant";

export class RestaurantManager {
  constructor() {
    this.listRestaurant = [];
  }

  async fillInFromJson() {
    let ajax = new Ajax();
    let data = await ajax.getListRestaurant();
    for (let currentRestaurant of data) {
      let newRestaurant = new Restaurant(
        currentRestaurant,
        this.listRestaurant.length + 1
      );
      this.listRestaurant.push(newRestaurant);
    }
  }
  getMyRestaurants() {
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

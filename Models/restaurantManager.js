import { Ajax } from "./ajax";
import { Restaurant } from "./restaurant";




export class RestaurantManager {
  constructor() {
    this.listeRestaurant = [];
  }

  async fillInFromJson() {
    let ajax = new Ajax;
    let data = await ajax.getListRestaurant();
    for (let currentRestaurant of data) {
      let newRestaurant = new Restaurant(
        currentRestaurant,
        this.listeRestaurant.length + 1
      );
      this.listeRestaurant.push(newRestaurant);
    }
  }
  getMyRestaurants() {
    return this.listeRestaurant;
  }
}

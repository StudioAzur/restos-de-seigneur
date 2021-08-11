import { Rating } from "./rating";

/**
 * @class Restaurant
 *
 * Constructeur de la classe par défaut
 */
export class Restaurant {
  constructor(json, id) {
    if (json != "undefined") {
      this.id = id;
      this.restaurantName = json.restaurantName;
      this.address = json.address;
      this.lat = json.lat;
      this.long = json.long;
      this.ratings = [];
      for (let ongoingRating of json.ratings) {
        this.ratings.push(
          new Rating(ongoingRating.stars, ongoingRating.comment)
        );
      }
    }
  }
  calculateAverage() {
    if (this.ratings.length == 0) {
      return 0;
    }
    let total = 0;
    for (let rating of this.ratings) {
      total += rating.stars;
    }
    let result =  total / this.ratings.length;
    return result;
  }
}

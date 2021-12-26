import { Rating } from "./rating";
/**
 * @class Restaurant
 *
 * Constructeur de la classe Restaurant par défaut
 */
export class Restaurant {
  constructor() {}
  // Calcul la moyenne des étoiles de chaque restaurant
  calculateAverage(ratings) {
    if (ratings.length == 0) {
      return 0;
    }
    let total = 0;
    for (let rating of ratings) {
      total += rating.stars;
    }
    let result = total / ratings.length;
    return result;
  }

  withJson(json, id) {
    this.id = id;
    this.restaurantName = json.restaurantName;
    this.address = json.address;
    this.lat = json.lat;
    this.long = json.long;
    this.ratings = [];
    if (json.ratings) {
      for (let rate of json.ratings) {
        this.ratings.push(new Rating(rate.stars, rate.comment));
      }
    }
    this.source = "json";
    // Retourne l'objet courant
    return this;
  }

  withGoogle(result) {
    this.id = result.id;
    this.restaurantName = result.name;
    this.address = result.formatted_address;
    this.lat = result.geometry.location.lat();
    this.long = result.geometry.location.lng();
    this.ratings = [];
    this.ratings.push(new Rating(result.rating, ""));

    this.source = "google";
    return this;
  }

  resetRestaurant() {
    sessionStorage.clear();
  }
}

/**
 * @class Rating
 *
 * Manages the data of the application.
 */
export class Rating {

    constructor(stars, comment) {
        this.stars = stars;
        this.comment = comment;
    }

    setRating(value){
        this.comment = value;
    }
    
}
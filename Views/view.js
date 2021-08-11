export class View {
  constructor() {
    this.liste = document.getElementById("listeRestaurant");
    this.details = document.getElementById("details");
  }
  showListRestaurant(listeRestaurant) {
    let thisHtml = "";
    for (let currentRestaurant of listeRestaurant) {
      thisHtml += `<div id = restaurant${
        currentRestaurant.idRestaurant
      } class="vassaux">
       <h4>${currentRestaurant.restaurantName}</h4>
       <p class = "paragraph">${currentRestaurant.address}</p>
       <div>${currentRestaurant.calculateAverage()}</div>
      </div>`;
      this.liste.innerHTML = thisHtml;
    }
  }
  showDetailsRestaurant(restaurant) {
    this.showComment(restaurant);
    console.log(thisComment);
    const imgSrc = `https://maps.googleapis.com/maps/api/streetview?size=500x200&location=${restaurant.lat},${restaurant.long}&fov=80&heading=70&pitch=0&key=${GOOGLE_API_KEY}`;
    this.details.innerHTML = `<div id = "commentContainer">
    <img src=${imgSrc} alt="StreetView of restaurant"></div>`;

  }
  showComment(restaurant) {
    let content = '';
    restaurant.ratings.forEach((rating) => {
     content +=  `<span>${rating.stars}<span>
      <p>Commentaire :</p>
      <p class=comment>${rating.comment}</p>
      </div>`;
      this.details.innerHTML = content;
    });
    
  }
}

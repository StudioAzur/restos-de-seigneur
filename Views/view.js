export class View {
  constructor() {
    this.liste = document.getElementById("listeRestaurant");
  }
  showListRestaurant(listeRestaurant) {
    let thisHtml = "";
    for (let currentRestaurant of listeRestaurant) {
      thisHtml += `<div id = restaurant${currentRestaurant.idRestaurant} class="vassaux">
       <h4>${currentRestaurant.restaurantName}</h4>
       <p class = "paragraph">${currentRestaurant.address}</p>
       <div>${currentRestaurant.calculateAverage()}</div>
      </div>`;  
      this.liste.innerHTML = thisHtml;
    }
    
  }
}

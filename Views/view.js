export class View {
  constructor() {
    this.selector = document.getElementById("selector");
    this.liste = document.getElementById("listeRestaurant");
    this.details = document.getElementById("details");
    this.restaurants = "";
    this.initialListe = JSON.parse(sessionStorage.getItem("restaurants"));
  }

  createMarker(listRestaurant, image) {
    for(let currentRestaurant of listRestaurant){
      let marker = new google.maps.Marker({
        position: {
          lat: parseFloat(currentRestaurant.lat),
          lng: parseFloat(currentRestaurant.long),
        },
        map: this.googleMap,
        title: currentRestaurant.restaurantName,
        icon: new google.maps.MarkerImage(image),
        idRestaurant: currentRestaurant.id,
      });
      marker.addListener("click", () => {
        this.showDetails(marker.idRestaurant);
      });
    }
  }

  showListRestaurant(listeRestaurant) {
    if (listeRestaurant == null) {
      listeRestaurant = JSON.parse(sessionStorage.getItem("restaurants"));
    }
    let thisHtml = "";
    for (let currentRestaurant of listeRestaurant) {
      thisHtml += `<div id = restaurant${currentRestaurant.idRestaurant} class="vassaux">
       <h4>${currentRestaurant.restaurantName}</h4>
       <p class = "paragraph">${currentRestaurant.address}</p>
       <div>${currentRestaurant.average}</div>
      </div>`;
      this.liste.innerHTML = thisHtml;
    }
    this.restaurants = listeRestaurant;
  }
  showComment(restaurant) {
    let content = "";
    restaurant.ratings.forEach((rating) => {
      content += `<span>${rating.stars}<span>
      <p>Commentaire :</p>
      <p class=comment>${rating.comment}</p>
      </div>`;
    });
    this.details.innerHTML += content;
  }

  showDetailsRestaurant(restaurant) {
    const imgSrc = `https://maps.googleapis.com/maps/api/streetview?size=500x200&location=${restaurant.lat},${restaurant.long}&fov=80&heading=70&pitch=0&key=${GOOGLE_API_KEY}`;
    this.details.innerHTML = `<div id = "commentContainer">
    <img src=${imgSrc} alt="StreetView of restaurant">
    </div>`;
    this.showComment(restaurant);
  }

  showSelector() {
    let content = "";
    const nbStarsTotal = 5;
    let stars = "*";
    for (let nbStars = 1; nbStars <= nbStarsTotal; nbStars++) {
      let pyramid = stars.repeat(nbStars);
      content += `<div class="selector">
        <button id="btn${nbStars}" value="${nbStars}" class="i-button">${pyramid}</button>
      </div>`;
    }
    this.selector.innerHTML = content;
    this.addEventOnStarSelector();
  }

  filterRestaurant(event) {
    let liste = this.initialListe;
    let listeDisplay = [];
    const nbStar = event.target.value;
    liste.filter((restaurant) => {
      if (restaurant.average >= nbStar) {
        listeDisplay.push(restaurant);
      }
    });
    this.showListRestaurant(listeDisplay);
    return listeDisplay;
    
    // const restaurantFiltered = this.restaurants.filter(restaurant => restaurant.average >= nbStar );
    //this.showListRestaurant(restaurantFiltered);
  }

  

  addEventOnStarSelector() {
    const starButtons = document.getElementsByClassName("i-button");
    [...starButtons].forEach((button) => {
      button.addEventListener("click", () => this.filterRestaurant(event));
    });
    // Array.from(starButtons).map(button => {
    //   button.addEventListener('click', () => this.filterRestaurant(event));
    // });
  }
}

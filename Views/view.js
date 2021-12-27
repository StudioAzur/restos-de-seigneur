import { Modal } from "./modal";
import { GOOGLE_API_KEY } from "../config";
import { Restaurant } from "../Models/restaurant";
import { RestaurantManager } from "../Models/restaurantManager";
export class View {
  constructor(googleMap, image) {
    this.selector = document.getElementById("selector");
    this.liste = document.getElementById("listeRestaurant");
    this.details = document.getElementById("details");
    this.restaurants = "";
    this.googleMap = googleMap;
    this.image = image;
    this.allMarkers = [];
    let restaurantManager = new RestaurantManager();
    this.initialList = restaurantManager.getMyRestaurantsFromSessionStorage();
    this.restaurant = new Restaurant();
    this.modal = new Modal(this);
  }

  createMarker(listRestaurant) {
    this.removeAllMarkers();
    for (let currentRestaurant of listRestaurant) {
      let marker = new google.maps.Marker({
        position: {
          lat: parseFloat(currentRestaurant.lat),
          lng: parseFloat(currentRestaurant.long),
        },
        map: this.googleMap,
        title: currentRestaurant.restaurantName,
        icon: new google.maps.MarkerImage(this.image),
        idRestaurant: currentRestaurant.id,
      });
      this.allMarkers.push(marker);
      marker.addListener("click", () => {
        window.controller.showDetails(currentRestaurant.id);
        /* this.showComment(currentRestaurant); */
      });
    }
  }

  addEventOnMap() {
    const map = this.googleMap;
    map.addListener("click", (e) => {
      // Lancer la modal
      let lng = e.latLng.lng();
      let lat = e.latLng.lat();
      const geocoder = new google.maps.Geocoder();
      geocoder
        .geocode({ location: e.latLng })
        .then((response) => {
          if (response.results[0]) {
            this.modal.initModal();
            let idRestaurant = this.initialList.length + 1;
            this.modal.showModal();
            this.modal.setTitle("Ajouter votre restaurant");
            this.modal.setDescription("Ajoutez votre restaurant");
            let address = response.results[0].formatted_address;
            this.modal.setContentForAddRestaurant(
              address,
              lat,
              lng
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  // Refaire une fonction qui efface les markers
  setMapOnAll(map, markers) {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  removeAllMarkers() {
    this.setMapOnAll(null, this.allMarkers);
    this.allMarkers = [];
  }

  showListRestaurant(listeRestaurant) {
    if (listeRestaurant == null) {
      listeRestaurant = this.initialList;
    }
    let thisHtml = "";
    for (let currentRestaurant of listeRestaurant) {
      const imgSrc = `https://maps.googleapis.com/maps/api/streetview?size=500x200&location=${currentRestaurant.lat},${currentRestaurant.long}&fov=80&heading=70&pitch=0&key=${GOOGLE_API_KEY}`;
      thisHtml += `
      <div class="row">
        <div class="col s12 m6">
          <div class="card id = restaurant${
            currentRestaurant.idRestaurant
          } class="vassaux"">
            <div class="card-image">
              <img src="${imgSrc}">
              <span class="card-title">${
                currentRestaurant.restaurantName
              }</span>
              <a class="btn-floating halfway-fab waves-effect waves-light amber accent-4"><i class="material-icons">add</i></a>
            </div>
            <div class="card-content">
            <p class = "paragraph">${currentRestaurant.address}</p>
            <div>${this.restaurant.calculateAverage(
              currentRestaurant.ratings
            )}</div>
            </div>
          </div>
        </div>
      </div>`;
    }
    this.liste.innerHTML = thisHtml;
    this.restaurants = listeRestaurant;
  }

  showComment(restaurant) {
    let content = "";
    const title = document.getElementById("title");
    title.innerHTML = `${restaurant.restaurantName}`;
    const imgSrc = `https://maps.googleapis.com/maps/api/streetview?size=800x200&location=${restaurant.lat},${restaurant.long}&fov=80&heading=70&pitch=0&key=${GOOGLE_API_KEY}`;
    let imgView = document.createElement("img");
    imgView.src = imgSrc;
    if (restaurant.ratings.length > 0) {
      restaurant.ratings.forEach((rating) => {
        if(rating.stars){
        content += `<div id = "commentContainer">
        <span>${rating.stars}<span>
        <p>Commentaire :</p>
        <p class=comment>${rating.comment}</p>
        </div>`;
        }else{
          content = ``;
        }
      });
    } else {
      content += `<div id="commentContainer"></div>`;
    }
    this.details.innerHTML = content;
    let commentContainer = document.getElementById("commentContainer");
    commentContainer.insertAdjacentElement("beforebegin", title);
    commentContainer.insertAdjacentElement("afterbegin", imgView);
    this.addButton(restaurant.id, "addComment");
  }

  addButton(idRestaurant, action) {
    let content = "";
    content += `</hr><button data-target="modal" class="modal-trigger waves-effect waves-light btn-large teal button" id="${action}" 
    >Ajouter un commentaire</button>`;
    this.details.innerHTML += content;
    this.addEventOnButtonsComment(idRestaurant);
  }

  showSelector() {
    let content = "";
    const nbStarsTotal = 5;
    let stars = `<i class="material-icons">star</i>`;
    
    for (let nbStars = 1; nbStars <= nbStarsTotal; nbStars++) {
      let pyramid = stars.repeat(nbStars);
      content += `<div class="selector">
        <button data-filter="${nbStars}" class=" i-button waves-effect waves-light btn-large teal" id="btn${nbStars}" value="${nbStars}">${pyramid}</button>
      </div>`;
    }
    this.selector.innerHTML = content;
    this.addEventOnStarSelector();
  }

  filterRestaurant(nbStars) {
    let liste = this.initialList;
    let listeDisplay = [];
    liste.filter((restaurant) => {
      console.log('average calcul', restaurant.calculateAverage(restaurant.ratings))
      console.log(nbStars)
      if (restaurant.calculateAverage(restaurant.ratings) >= nbStars) {
        listeDisplay.push(restaurant);
      }
    });
    this.showListRestaurant(listeDisplay);
    return listeDisplay;
  }

  addEventOnStarSelector() {
    const starButtons = document.querySelectorAll('[data-filter]');
    [...starButtons].forEach((button) => {
      button.addEventListener("click", (event) =>
      
      {
        console.log('pure event', event)
        console.log('before call',event.target.value);
        this.createMarker(this.filterRestaurant(event.target.value))}
      );
    });
    // Array.from(starButtons).map(button => {
    //   button.addEventListener('click', () => this.filterRestaurant(event));
    // });
  }

  addEventOnButtonsComment(idRestaurant) {
    const commentButtons = document.getElementsByClassName("button");
    //console.log(commentButtons);
    [...commentButtons].forEach((button) => {
      button.addEventListener("click", (event) => {
        this.modal.initModal();
        this.modal.showModal();
        this.modal.setTitle("Ajouter votre commentaire");
        this.modal.setDescription(
          "Laissez votre avis sur les meilleures tavernes du coin"
        );
        this.modal.setContentForAddComment(idRestaurant);
      });
    });
  }
  setContentModal() {
    this.modal.setContentForAddComment();
  }
  addEventCloseModal() {
    const cross = document.getElementById("close");
    cross.addEventListener("click", () => {
      let modal = document.getElementById("modal");
      modal.setAttribute("aria-hidden", "true");
    });
  }
}

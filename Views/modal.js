export class Modal {
  constructor(view) {
    this.idRestaurant = "";
    this.addEventCloseButton();
    this.view = view;
    this.instance = "";
    this.elems = document.getElementById("modal");
    this.option = "";
  }

  initModal() {
    document.addEventListener("DOMContentLoaded", () => {
      this.instance = M.Modal.init(this.elems, this.option);
    });
  }

  addEventCloseButton() {
    const closeButton = document.getElementById("close");
    closeButton.addEventListener("click", () => {
      this.closeModal();
    });
  }

  addEventSendCommentButton() {
    const sendCommentButton = document.getElementById("sendComment");
    sendCommentButton.addEventListener("click", () => {
      this.saveCommentForRestaurant();
    });
  }

  showModal() {
    this.instance = M.Modal.init(this.elems, this.option);
    this.instance.open();
  }

  closeModal() {
    this.instance = M.Modal.init(this.elems, this.option);
    this.instance.close();
  }

  setDescription(text) {
    const description = document.getElementById("dialog-desc");
    description.innerText = text;
  }

  setTitle(text) {
    const title = document.getElementById("dialog-title");
    title.innerText = text;
  }

  getInputValue() {
    return document.getElementById("comment").value;
  }

  getRateValue() {
    return document.getElementById("stars").value;
  }

  getIdValue() {
    return document.getElementById("idRestaurant").value;
  }

  getIdModal(){
    return document.getElementById("idRestaurantComment").value;
  }

  getAdressValue() {
    return document.getElementById("address").value;
  }

  getNameValue() {
    return document.getElementById("name").value;
  }

  saveCommentForRestaurant() {
    const inputValue = this.getInputValue();
    const inputStarValue = this.getRateValue();
    const idRestaurant = this.getIdModal();

    let restaurant = window.controller.saveNewComment(
      idRestaurant,
      inputValue,
      inputStarValue
    );
    this.closeModal();
    this.view.showComment(restaurant);
  }

  saveRestaurant(latitude, longitude) {
    const inputId = parseInt(this.getIdValue());
    const inputAdress = this.getAdressValue();
    const inputName = this.getNameValue();
    window.controller.saveNewRestaurant(
      inputId,
      inputAdress,
      inputName,
      latitude,
      longitude
    );
    this.closeModal();
  }

  setContentForAddComment(idRestaurant) {
    const divComment = document.getElementById("content-modal-inset");
    divComment.innerHTML = `
    <div>
      <label for="stars">Entrez votre note : </label>
      <input type="number" id="stars" min="0" max="5">
      <label for="comment">Entrez votre commentaire : </label>
      <input type="text" id ="comment">
      <input type = "hidden" id="idRestaurantComment" value="${idRestaurant}">
      <button type="button" class="waves-effect waves-light amber accent-4" id="sendComment">Commenter</button>
    </div>`;
    this.addEventSendCommentButton();
  }

  setContentForAddRestaurant(address, latitude, longitude) {
    const divContent = document.getElementById("content-modal-inset");
    divContent.innerHTML = `
    <div>
      <label for="idRestaurant">Votre Id :</label>
      <input type="text" value="${JSON.parse(sessionStorage.getItem('mesRestaurants')).length + 1}" id="idRestaurant">
      <label for="address">Adresse du restaurant</label>
      <input type="text" value="${address}" id="address">
      <label for="name">Nom du restaurant</label>
      <input type="text" value="" id="name">
      <button id="buttonAddRestaurant" class="waves-effect waves-light amber accent-4">Ajouter votre restaurant</button>
    </div>
    `;
    const button = document.getElementById("buttonAddRestaurant");
    button.addEventListener("click", () => {
      this.saveRestaurant(latitude, longitude);
    });
  }
}

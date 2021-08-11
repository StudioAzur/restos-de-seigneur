/**
 * @class Ajax
 *
 * Manages the data of the application.
 */
export class Ajax{
    async getListRestaurant(){
        const response = await fetch('http://localhost:3000/ressources/liste.json');
        const data = await response.json();
        return data; 
    }
}

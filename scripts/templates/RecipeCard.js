import { templateClone } from "../utils/template.js";


//COMMENT:  cible le template html des items de la liste déroulante de tags
const cardTemplate           = document.getElementById('card-template');
const cardIngredientsTemplate= document.getElementById('card-ingredients-template');
//COMMENT: cible la galerie des cartes recettes
const cardGallery            = document.getElementById('card-gallery');

//COMMENT: créée les cartes recettes
class RecipeCard{
    constructor(index, data) {
        this.index      = index;
        this.data       = data;
        this.ingredients= data.ingredients;
        this.key        = data.id;
        this.card;
    }

    createRecipeCard() {
        this.insertTemplate();
        this.displayDrive();
    }
    // insert le template html de la carte recette
    insertTemplate() {
        const [ {clone}, {custom} ] = templateClone(cardTemplate, '.recipe-card');
        custom.querySelector('.card-title').textContent     = this.data.name;
        custom.querySelector('.worktime-recipe').textContent= this.data.time;
        custom.querySelector('.card-text').textContent      = this.data.description;
        custom.setAttribute('data-id', `${this.key}`);
        cardGallery.appendChild(clone);
        this.card = cardGallery.getElementsByClassName('recipe-card')[this.index];
        this.insertIngredients(this.card.querySelector('ul'));
    }
    //
    insertIngredients(target, index = 0) {
        if(index < this.ingredients.length) {
            const [{clone}, {custom}] = templateClone(cardIngredientsTemplate, 'li');
            let quantity= this.ingredients[index].quantity;
            quantity    = (this.ingredients[index].unit === undefined)?
                            quantity : 
                            quantity+this.ingredients[index].unit; 
            custom.insertAdjacentText('afterbegin', this.ingredients[index].ingredient);
            custom.querySelector('span').textContent = quantity;
            target.appendChild(clone);
            this.insertIngredients(target, ++index);
        }
    }

    displayDrive() {
        this.card.addEventListener('recipeOn', () => this.card.classList.remove('d-none'));
        this.card.addEventListener('recipeOff',() => this.card.classList.add('d-none'));
    }
}

export { RecipeCard, cardGallery }
import { templateClone } from "../utils/template.js";

// NOTE: deuxième version de l'agorithme de recherche

// COMMENT:  cible le template html des items de la liste déroulante de tags
const cardTemplate           = document.getElementById('card-template');
const cardIngredientsTemplate= document.getElementById('card-ingredients-template');
// COMMENT: cible la galerie des cartes recettes
const cardGallery            = document.getElementById('card-gallery');

// COMMENT: crée les cartes recettes
class RecipeCard{
    constructor(index, data) {
        this.index      = index;
        this.data       = data;
        this.ingredients= data.ingredients;
        this.key        = data.id;
        this.card;
    }

    createRecipeCard() {
        this.insertTemplate();  // insère le template html
        this.displayDrive();
    }
    // insère le template html de la carte recette
    insertTemplate() {
        const [ {clone}, {custom} ]                              = templateClone(cardTemplate, '.recipe-card');
        custom.     querySelector('.card-title').textContent     = this.data.name;
        custom.     querySelector('.worktime-recipe').textContent= this.data.time;
        custom.     querySelector('.card-text').textContent      = this.data.description;
        custom.     setAttribute ('data-id', `${this.key}`);
        cardGallery.appendChild(clone);
        this.card = cardGallery.getElementsByClassName('recipe-card')[this.index];
        this.insertIngredients(this.card.querySelector('ul'));
    }
    // insère la liste des ingrédient à l'aide ru template html dans la carte recette
    insertIngredients(target) {
        this.ingredients.forEach(item => {
            const [{clone}, {custom}] = templateClone(cardIngredientsTemplate, 'li');
            let quantity = (item.unit === undefined)? item.quantity : item.quantity + item.unit;
            custom.insertAdjacentText('afterbegin', item.ingredient);
            custom.querySelector     ('span').textContent = quantity;
            target.appendChild       (clone);
        });
    }
    // ordre d'affichage ou masquage des cartes recettes
    displayDrive() {
        this.card.addEventListener('recipeOn', () => this.card.classList.remove('d-none'));
        this.card.addEventListener('recipeOff',() => this.card.classList.add('d-none'));
    }
}

export { RecipeCard, cardGallery }
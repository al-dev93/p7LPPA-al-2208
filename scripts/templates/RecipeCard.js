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
        // this.enableWithTag = true;
        // this.enableWithSearch = true;
        this.card;
    }

    createRecipeCard() {
        this.insertTemplate();
        this.displayDrive();
        // this.enabledControl();
        // this.searchControl();
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

    // enabledControl() {
    //     this.card.addEventListener('enable-tag', (event) => {
    //         if(event.detail.length === 0 && this.enableWithSearch) {
    //             this.enableWithTag = true;
    //             this.card.classList.remove('d-none');
    //             return;
    //         }
    //         const selected = this.isSelected(event.detail, this.key);
    //         console.log(event.detail, selected)
    //         if(selected && !this.enableWithTag && this.enableWithSearch) {
    //             this.enableWithTag = true;
    //             this.card.classList.remove('d-none')
    //         } else if(!selected && this.enableWithTag && this.enableWithSearch) {
    //             this.enableWithTag = false;
    //             this.card.classList.add('d-none');
    //         }
    //     });
    // }

    displayDrive() {
        this.card.addEventListener('recipeOn', () => this.card.classList.remove('d-none'));
        this.card.addEventListener('recipeOff',() => this.card.classList.add('d-none'));
    }

    // isSelected(recipeList, key, id = 0) {
    //     while(id < recipeList.length && recipeList[id] !== key) {
    //         id++;
    //     }
    //     return(recipeList[id] === key)
    // }
}

export { RecipeCard, cardGallery }
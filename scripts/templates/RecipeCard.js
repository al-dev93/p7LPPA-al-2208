import { searchString, stringNormalize } from "../utils/string-convert.js";


//COMMENT:  cible le template html des items de la liste déroulante de tags
const cardTemplate = document.getElementById('card-template');
const cardIngredientsTemplate = document.getElementById('card-ingredients-template');
//COMMENT: cible la galerie des cartes recettes
const cardGallery = document.getElementById('card-gallery');

//COMMENT: créée les cartes recettes
class RecipeCard{
    constructor(index, data) {
        this.index = index;
        this.data = data;
        this.ingredients = data.ingredients;
        this.key = data.id;
        this.enableWithTag = true;
        this.enableWithSearch = true;
        this.card;
        this.searchInput = document.getElementById('recipes-search');
    }

    createRecipeCard() {
        this.insertTemplate();
        this.enabledControl();
        this.searchControl();
    }
    // insert le template html de la carte recette
    insertTemplate() {
        const clone = document.importNode(cardTemplate.content, true);
        const insert = clone.querySelector('.recipe-card');
        insert.querySelector('.card-title').textContent = this.data.name;
        insert.querySelector('.worktime-recipe').textContent = this.data.time;
        insert.querySelector('.card-text').textContent = this.data.description;
        insert.setAttribute('data-id', `${this.key}`);
        cardGallery.appendChild(clone);
        this.card = cardGallery.getElementsByClassName('recipe-card')[this.index];
        this.insertIngredients(this.card.querySelector('ul'));
    }
    //
    insertIngredients(target, index = 0) {
        if(index < this.ingredients.length) {
            const clone = document.importNode(cardIngredientsTemplate.content, true);
            const insert = clone.querySelector('li');
            let quantity = this.ingredients[index].quantity;
            quantity = (this.ingredients[index].unit === undefined)? quantity : quantity+this.ingredients[index].unit; 
            insert.insertAdjacentText('afterbegin', this.ingredients[index].ingredient);
            insert.querySelector('span').textContent = quantity;
            target.appendChild(clone);
            this.insertIngredients(target, ++index);
        }
    }

    enabledControl() {
        this.card.addEventListener('enable-tag', (event) => {
            if(event.detail.length === 0 && this.enableWithSearch) {
                this.enableWithTag = true;
                this.card.classList.remove('d-none');
                return;
            }
            const selected = this.isSelected(event.detail, this.key);
            if(selected && !this.enableWithTag && this.enableWithSearch) {
                this.enableWithTag = true;
                this.card.classList.remove('d-none')
            } else if(!selected && this.enableWithTag && this.enableWithSearch) {
                this.enableWithTag = false;
                this.card.classList.add('d-none');
            }
        });
    }

    searchControl() {
        this.card.addEventListener('search-recipe', () => {
            const searchInput = stringNormalize(`${this.searchInput.value}`);
            const name = searchString(this.data.normalizeName, searchInput);
            console.log(name, this.data.normalizeName, searchInput)
            //const description = searchString(this.data.normalizeDescription, searchInput);
            if(!name && this.enableWithTag && searchInput !== "") {
                this.card.classList.add('d-none');
                this.enableWithSearch = false;
            } else if(name && this.enableWithTag && searchInput !== "") {
                this.card.classList.remove('d-none');
                this.enableWithSearch = true;
            } else if(searchInput === "" && this.enableWithTag) {
                this.card.classList.remove('d-none');
                this.enableWithSearch = true;
            }
        });
    }

    isSelected(recipeList, key, id = 0) {
        while(id < recipeList.length && recipeList[id] !== key) {
            id++;
        }
        return(recipeList[id] === key)
    }
}

export { RecipeCard, cardGallery }
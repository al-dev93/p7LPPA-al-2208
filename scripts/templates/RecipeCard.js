

//COMMENT:  cible le template html des items de la liste déroulante de tags
const cardTemplate = document.getElementById('card-template');
const cardIngredientsTemplate = document.getElementById('card-ingredients-template');


//COMMENT: créée les cartes recttes
class RecipeCard{
    constructor(index, data) {
        this.index = index;
        this.data = data;
        this.ingredients = data.ingredients;
        this.key = data.id;
        this.parent = document.getElementById('card-gallery');
        this.card;
    }

    createRecipeCard() {
        this.insertTemplate();
    }
    // insert le template html de la carte recette
    insertTemplate() {
        const clone = document.importNode(cardTemplate.content, true);
        const insert = clone.querySelector('.recipe-card');
        insert.querySelector('.card-title').textContent = this.data.name;
        insert.querySelector('.worktime-recipe').textContent = this.data.time;
        insert.querySelector('.card-text').textContent = this.data.description;
        insert.setAttribute('data-id', `${this.key}`);
        this.parent.appendChild(clone);
        this.card = this.parent.getElementsByClassName('recipe-card')[this.index];
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
}

export { RecipeCard }
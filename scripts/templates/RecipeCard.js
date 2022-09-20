

//COMMENT:  cible le template html des items de la liste déroulante de tags
const cardTemplate = document.getElementById('card-template');
const cardIngredientsTemplate = document.getElementById('card-ingredients-template');

//COMMENT:  cible où insérer la carte recette
const insertTarget = document.getElementById('card-gallery');

//COMMENT: créée les cartes recttes
class RecipeCard{
    constructor(data) {
        this.data = data;
    }

    createRecipeCard(index = 0) {
        if(index < this.data.length) {
            this.insertTemplate(index);
            this.card = insertTarget.getElementsByClassName('recipe-card').item(index);
            const insertIngredient = this.card.querySelector('ul');
            this.insertIngredients(insertIngredient, index);
            this.createRecipeCard(++index);
        }
    }
    // insert le template html de la carte recette
    insertTemplate(id) {
        const clone = document.importNode(cardTemplate.content, true);
        const insert = clone.querySelector('.recipe-card');
        insert.querySelector('.card-title').textContent = this.data[id].name;
        insert.querySelector('.worktime-recipe').textContent = this.data[id].time;
        insert.querySelector('.card-text').textContent = this.data[id].description;
        insert.setAttribute('data-id', `${id}`);
        insertTarget.appendChild(clone);
    }
    //
    insertIngredients(target, id, index = 0) {
        if(index < this.data[id].ingredients.length) {
            const clone = document.importNode(cardIngredientsTemplate.content, true);
            const insert = clone.querySelector('li');
            let quantity = this.data[id].ingredients[index].quantity;
            quantity = (this.data[id].ingredients[index].unit === undefined)? quantity : quantity+this.data[id].ingredients[index].unit; 
            insert.insertAdjacentText('afterbegin', this.data[id].ingredients[index].ingredient);
            insert.querySelector('span').textContent = quantity;
            target.appendChild(clone);
            this.insertIngredients(target, id, ++index);
        }
    }
}

export { RecipeCard }
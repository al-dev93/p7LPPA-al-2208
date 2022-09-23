import { loadData } from "../../scripts/api/api.js";
import { allRecipes } from "../store/data.js";
import { DEVICE, INGREDIENT, UTENSIL } from "../../scripts/utils/naming.js";
import { SearchTag } from "../templates/SearchTag.js";
import { Tag, tagBank } from "../templates/Tag.js";
import { RecipeCard } from "../templates/RecipeCard.js";


function eventEnabled(recipes) {
    const eventEnabled = new CustomEvent (
        'enabled', {
            bubbles: true,
            detail: recipes
        });
    return eventEnabled;
}

function sendToAllRecipes(recipeCards, event, id = 0) {
    if(id < recipeCards.length) {
        recipeCards[id].dispatchEvent(event);
        sendToAllRecipes(recipeCards, event, ++id)
    }
}

function enabledRecipes(recipes) {
    const recipeCards = document.querySelectorAll('.recipe-card');
    const tags = tagBank.getElementsByClassName('badge');
    const event = eventEnabled(recipes)
    if(tags.length == 1) {
        sendToAllRecipes(recipeCards, event)
    }
    else {

    }
}

function controlTagBank() {
    tagBank.addEventListener('addtag', (event) => {
        const data = event.detail;
        const newTag = new Tag(data.link, data.theme, data.name, data.recipes)
        newTag.addTag();
        enabledRecipes(newTag.recipeList);
    })
}

function loadSearchTag(ingredients, devices, utensils) {
    const ingredientsTagList = new SearchTag(INGREDIENT, ingredients);
    const devicesTagList = new SearchTag(DEVICE, devices);
    const utensilsTagList = new SearchTag(UTENSIL, utensils);
    ingredientsTagList.createTagList();
    devicesTagList.createTagList();
    utensilsTagList.createTagList();
}

function loadRecipeCard(recipeList, id = 0, recipeCard = []) {
    if(id < recipeList.length) {
        recipeCard[id] = new RecipeCard(id, recipeList[id]);
        recipeCard[id].createRecipeCard();
        loadRecipeCard(recipeList, ++id, recipeCard);
    }
}


function run() {
    const [{ingredients}, {devices}, {utensils}, {recipeList}] = loadData() ; 
    loadSearchTag(ingredients, devices, utensils);
    loadRecipeCard(recipeList);
    console.log(ingredients);
    controlTagBank();
}

run();
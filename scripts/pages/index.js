import { loadData } from "../../scripts/api/api.js";
import { DEVICE, INGREDIENT, UTENSIL } from "../../scripts/utils/naming.js";
import { TagBank } from "../templates/TagBank.js";
import { SearchTag } from "../templates/SearchTag.js";
import { RecipeCard, cardGallery } from "../templates/RecipeCard.js";
//import { stringNormalize } from "../utils/string-convert.js";

const recipeCards = cardGallery.getElementsByClassName('recipe-card');

function sendAllEnableRecipes(event, list, idRecipe = 0, idKey = 0) {
    if(idRecipe < recipeCards.length) {
        if(list !== undefined && idKey < list.length) {
            if(+recipeCards[idRecipe].getAttribute('data-id') === list[idKey]) {
                recipeCards[idRecipe].dispatchEvent(event);
                ++idKey;
            }
        } else {
            recipeCards[idRecipe].dispatchEvent(event);
        }
        sendAllEnableRecipes(event, list, ++idRecipe, idKey);
    }
}

function searchRecipe (bank) {
    const inputSearch = document.getElementById('recipes-search');
    const searchEvent = new Event('search-recipe');
    inputSearch.addEventListener('input',(event) => {
        const value = `${inputSearch.value}`
        console.log(value)
        if(value === "" || value.length >= 3 || event.inputType === "deleteContentBackward") {
            sendAllEnableRecipes(searchEvent, (bank.countTags)? bank.enabledRecipes : undefined);
        }
    });
}

function loadSearchTag(ingredients, devices, utensils, tagsBank) {
    const ingredientsTagList = new SearchTag(INGREDIENT, ingredients, tagsBank);
    const devicesTagList = new SearchTag(DEVICE, devices, tagsBank);
    const utensilsTagList = new SearchTag(UTENSIL, utensils, tagsBank);
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
    const onTags = new TagBank();
    loadSearchTag(ingredients, devices, utensils, onTags);
    loadRecipeCard(recipeList);
    console.log(recipeList)
    searchRecipe(onTags);

}

run();
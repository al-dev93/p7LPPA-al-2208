import { loadData } from "../../scripts/api/api.js";
import { DEVICE, INGREDIENT, UTENSIL } from "../../scripts/utils/naming.js";
import { TagBank, tagBank } from "../templates/TagBank.js";
import { SearchTag } from "../templates/SearchTag.js";
import { RecipeCard } from "../templates/RecipeCard.js";
import { stringNormalize } from "../utils/string-convert.js";

const inputSearch = document.getElementById('recipes-search');

function searchRecipe () {
    inputSearch.addEventListener('input',(event) => {
        const value = stringNormalize(`${inputSearch.value}`);
        if(value === "" || value.length >= 3 || event.inputType === "deleteContentBackward") {
            const searchEvent = new CustomEvent (
                'search-recipe', {
                    bubbles: true,
                    detail: value
                });
            tagBank.dispatchEvent(searchEvent);
        }
    });
}

function loadSearchTag(ingredients, devices, utensils, tagsBank) {
    const ingredientsTagList = new SearchTag(INGREDIENT, ingredients, tagsBank);
    const devicesTagList = new SearchTag(DEVICE, devices, tagsBank);
    const utensilsTagList = new SearchTag(UTENSIL, utensils, tagsBank);
    ingredientsTagList.createSearchTag();
    devicesTagList.createSearchTag();
    utensilsTagList.createSearchTag();
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
    console.log(recipeList)
    const onTags = new TagBank(recipeList);
    onTags.initTagBank();
    loadSearchTag(ingredients, devices, utensils, onTags);
    loadRecipeCard(recipeList);
    searchRecipe();
}

run();
import { DEVICE, INGREDIENT, UTENSIL } from "../../scripts/utils/naming.js";
import { loadData }        from "../../scripts/api/api.js";
import { SearchDrive }     from "../templates/SearchDrive.js";
import { SearchTag }       from "../templates/SearchTag.js";
import { RecipeCard }      from "../templates/RecipeCard.js";
import { stringNormalize } from "../utils/string-convert.js";

const inputSearch = document.getElementById('recipes-search');

function searchRecipe (searchDrive) {
    inputSearch.addEventListener('input',(event) => {
        const value = stringNormalize(`${inputSearch.value}`);
        if(value === "" || value.length >= 3 || event.inputType === "deleteContentBackward") {
            searchDrive.inputWord = value;
        }
    });
}

function loadSearchTag(ingredients, devices, utensils, searchDrive) {
    const ingredientsTagList= new SearchTag(INGREDIENT, ingredients, searchDrive);
    const devicesTagList    = new SearchTag(DEVICE, devices, searchDrive);
    const utensilsTagList   = new SearchTag(UTENSIL, utensils, searchDrive);
    ingredientsTagList.createSearchTag();
    devicesTagList.    createSearchTag();
    utensilsTagList.   createSearchTag();
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
    //const onTags = new TagBank(recipeList);
    //onTags.initTagBank();
    const searchDrive = new SearchDrive(recipeList);
    loadSearchTag(ingredients, devices, utensils, searchDrive);
    loadRecipeCard(recipeList);
    searchRecipe(searchDrive);
}

run();
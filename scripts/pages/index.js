import { loadData } from "../../scripts/api/api.js";
import { DEVICE, INGREDIENT, UTENSIL } from "../../scripts/utils/naming.js";
import { TagBank } from "../templates/TagBank.js";
import { SearchTag } from "../templates/SearchTag.js";
import { RecipeCard } from "../templates/RecipeCard.js";



function loadSearchTag(ingredients, devices, utensils) {
    const onTags = new TagBank();
    const ingredientsTagList = new SearchTag(INGREDIENT, ingredients, onTags);
    const devicesTagList = new SearchTag(DEVICE, devices, onTags);
    const utensilsTagList = new SearchTag(UTENSIL, utensils, onTags);
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

}

run();
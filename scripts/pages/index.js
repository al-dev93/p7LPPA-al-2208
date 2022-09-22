import { loadData } from "../../scripts/api/api.js";
import { DEVICE, INGREDIENT, UTENSIL } from "../../scripts/utils/naming.js";
import { SearchTag } from "../templates/SearchTag.js";
import { Tag, tagBank } from "../templates/Tag.js";
import { RecipeCard } from "../templates/RecipeCard.js";


function controlTagBank() {
    tagBank.addEventListener('insert', (event) => {
        const data = event.detail;
        const newTag = new Tag(data.link, data.theme, data.name)
        newTag.insertTag();
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
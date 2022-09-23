import { recipes } from "../../data/recipes.js";
import { allRecipes } from "../store/data.js";
import { getNode } from "../../scripts/utils/data-handler-v1.js";
import { stringCapitalize, stringNormalize, unitSymbol, agreementConvert } from "../../scripts/utils/string-convert.js";

const pathToIngredients = [recipes, 'ingredients', 'ingredient'];
const pathToDevices = [recipes, 'appliance'];
const pathToUtensils = [recipes, 'ustensils'];
const pathToRecipes = { first: [recipes, 'name'], last: [recipes, 'ingredients', 'ingredient'] }

const pathToData = [
    pathToIngredients,
    pathToDevices,
    pathToUtensils,
    pathToRecipes
];


//! //TODO commenter la fonction
function pushTagListItem(list, value, key) {
    const strNormalize = stringNormalize(value);
    if(!list.length) {
        list[0] = {id: [key], value: stringCapitalize(value), normalize: strNormalize};
        return;
    }
    let id = 0, isDuplicate = false;
    while (id < list.length) {
        if(strNormalize === list[id].normalize) {
        isDuplicate = true;
        list[id].id[list[id].id.length] = key;
        }
        id++;
    }
    if(!isDuplicate) {
        list[list.length] = {id: [key], value: stringCapitalize(value), normalize: strNormalize};
    }
}

//! //TODO commenter la fonction
function pushRecipe(list, value, key, idPath, path, idValue, headRecipes, record) { 
    if(idPath == 1) {
        list[list.length] = {
                    id: key, 
                    name: value,
                    time: path[idPath-1][idValue].time, 
                    description: path[idPath-1][idValue].description,
                    ingredients: []
                };
        allRecipes[allRecipes.length] = key;
    }
    if(idPath == 2 && headRecipes !== undefined) {
        list[list.length] = key;
        headRecipes[record].ingredients[idValue] = path[idPath-2][record].ingredients[idValue];
        const thisRecord = headRecipes[record].ingredients[idValue];
        if(thisRecord.unit !== undefined) {
            thisRecord.unit = unitSymbol(thisRecord.unit);
            if(thisRecord.quantity !== undefined && thisRecord.unit.length > 2) {
                thisRecord.unit = agreementConvert(thisRecord.quantity, thisRecord.unit);
            }
        }
    }
}

//! //TODO commenter la fonction
function loadData(path = pathToData, stack = [], id = 0) {
    if(id < path.length) {
        if(id < path.length - 1) {
            stack[id] = getNode(path[id], pushTagListItem);
        } else {
            stack[id] = getNode(path[id].last, pushRecipe, getNode(path[id].first, pushRecipe));
        }
        loadData(path, stack, ++id)
    }
    return ([
        {ingredients: [... stack[0]]},
        {devices: [...stack[1]]}, 
        {utensils: [... stack[2]]}, 
        {recipeList: [...stack[3]]}
    ]);
}

export { loadData, pushRecipe }
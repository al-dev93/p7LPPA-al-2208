import { DEVICE, INGREDIENT, UTENSIL } from "../../scripts/utils/naming.js";
import { loadData }                    from "../../scripts/api/api.js";
import { templateClone }               from "../utils/template.js";
import { SearchDrive }                 from "../templates/SearchDrive.js";
import { SearchTag }                   from "../templates/SearchTag.js";
import { RecipeCard }                  from "../templates/RecipeCard.js";
import { stringNormalize }             from "../utils/string-convert.js";

// COMMENT: cible le champ de recherche principale
const inputSearch         = document.getElementById('recipes-search');
// COMMENT: cible template html et insertion du message recherche vide
const searchAlert         = document.getElementById('search-alert');
const searchAlertTemplate = document.getElementById('search-alert-template');


// insère le message d'alerte dans la page
searchAlert.addEventListener('emptySearch', () =>{
    const [{clone}] = templateClone(searchAlertTemplate, '.alert');
    searchAlert.appendChild(clone);
    addAlertEvent();
});

// retire le message d'alerte
function addAlertEvent() {
    const closeSearchAlert = document.querySelector('.alert .bi-x-circle');
    closeSearchAlert.addEventListener('click',   (event) => removeAlert(event));
    closeSearchAlert.addEventListener('keydown', (event) => removeAlert(event));
    closeSearchAlert.focus();
}

function removeAlert(event) {
    if((event.type === 'keydown' && event.key === 'Enter') || event.type === 'click') {
        searchAlert.innerHTML = "";
        event.preventDefault();
        event.stopPropagation();
        inputSearch.focus();
    }
}

// gestion du champ de recherche principale
function searchRecipe (searchDrive) {
    inputSearch.addEventListener('input',(event) => {
        const value = stringNormalize(`${inputSearch.value}`);
        if(value === "" || value.length >= 3 || event.inputType === "deleteContentBackward") {
            searchDrive.inputWord = value; // transmission de l'expression recherchée à l'objet gestionnaire
        }
    });
}
// création des objets de recherche par tags
function loadSearchTag(ingredients, devices, utensils, searchDrive) {
    new SearchTag(INGREDIENT, ingredients, searchDrive).createSearchTag();
    new SearchTag(DEVICE, devices, searchDrive).createSearchTag();
    new SearchTag(UTENSIL, utensils, searchDrive).createSearchTag();
}
// création des cartes recettes
function loadRecipeCard(recipeList, id = 0) {
    if(id < recipeList.length) {
        new RecipeCard(id, recipeList[id]).createRecipeCard();
        loadRecipeCard(recipeList, ++id);
    }
}

function run() {
    // chargement des données
    const [ {ingredients}, 
            {devices}, 
            {utensils}, 
            {recipeList}]  = loadData() ;
    // création de l'objet gestionnaire de recherche
    const searchDrive      = new SearchDrive(recipeList);
    // chargement des widgets de recherche par tag
    loadSearchTag( ingredients, devices, utensils, searchDrive);
    // chargement des cartes recettes
    loadRecipeCard(recipeList);
    // chargement du gestionnaire de recherche
    searchRecipe  (searchDrive);
}

run();
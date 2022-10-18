import { ALLTAGS }                      from "../utils/naming.js";
import { getItemInActiveTags, junctionArray, junctionListOfArray, removeInActiveTags, 
        substractArray } from "../utils/array-handler.js";
import { searchString }                 from "../utils/string-convert.js";
import { eventAtAll }                   from "../utils/template.js";
import { cardGallery }                  from "../templates/RecipeCard.js";

// NOTE: deuxième version de l'agorithme de recherche

// COMMENT: cibles des éléments utilisés par la classe SearchDrive
const recipeCards= cardGallery.getElementsByClassName('recipe-card'); // cible la galerie des cartes recettes
const tagBank    = document.   getElementById('tag-bank');            // cible la banque des tags
const addedTags  = tagBank.    getElementsByClassName('badge');       // contient la collection des tags en banque

// COMMENT: classe de l'objet gestionnaire de recherche
class SearchDrive {
    constructor(recipes) {
        // données sur les recettes
        this.recipes           = recipes;
        this.idRecipes         = [...recipes.keys()];
        this.idRecipesOn       = this.idRecipes;      // recettes affichées
        this.idRecipesOff      = [];                  // recettes non affichées
        // données sur la recherche principale
        this.wordSearched      = "";
        this.isSearched        = 0;  // indicateur de recherche en cours
        this.idSearchRecipesOn = []; // recettes sorties suite à une recherche
        this.idSearchRecipesOff= []; // recettes non sorties
        // données sur la recherche par tag
        this.addedTag          = []; // dernier tag ajouté
        this.removedTag        = []; // dernier tag retiré
        this.isTagged          = 0;  // nombre de tags actifs
        this.activeTags        = []; // banque des tags
        this.idTaggedRecipesOn = []; // recettes sorties suite à une recherche par tag        
        // évènements pour affichage - masquage des recettes
        this.eventOnRecipes    = new Event('recipeOn');
        this.eventOffRecipes   = new Event('recipeOff');
        this.eventEmptySearch  = new Event('emptySearch');
    }
    // tableau des recettes associées aux tags placés en banque
    setTaggedRecipes() {
        this.idTaggedRecipesOn = junctionListOfArray(this.activeTags);
        this.setDisplayRecipes();
    }
    // tableaux on et off des recettes sorties suite à une recherche
    setSearchedRecipes() {
        if(this.isSearched) {
            this.idSearchRecipesOn = this.idRecipes.filter(recipe => this.getQuery(recipe));
            this.idSearchRecipesOff = substractArray(this.idRecipes, this.idSearchRecipesOn)
        } else {
            this.idSearchRecipesOn = this.idRecipes
            this.idSearchRecipesOff= [] 
        }
        this.setDisplayRecipes();
    }

    // recherche le mot transmis dans les recettes selon les critères: nom, ingrédients, description
    getQuery(recipe) {
        let query = searchString(this.recipes[recipe].normalizeName, this.wordSearched);
        if(query) {
            return query;
        }
        query = searchString(this.recipes[recipe].listIngredients, this.wordSearched);
        return (query)? query : searchString(this.recipes[recipe].normalizeDescription, this.wordSearched)
    }

    // affichage des recettes prenant en compte la recherche par tags et la recherche principale
    setDisplayRecipes() {
        switch (true) {
            case (this.isSearched > 0) && (this.isTagged > 0):
                this.idRecipesOn = junctionArray(this.idSearchRecipesOn, this.idTaggedRecipesOn);
                break;
            case (this.isSearched > 0) && (this.isTagged == 0):
                this.idRecipesOn = this.idSearchRecipesOn;
                break;
            case (this.isSearched == 0) && (this.isTagged > 0):
                this.idRecipesOn = this.idTaggedRecipesOn;
                break;
            default:
                this.idRecipesOn = this.idRecipes;
                break;
        }
        this.idRecipesOff = substractArray(this.idRecipes, this.idRecipesOn);
        this.sendToRecipes();
        this.sendToTagsList();
        if(!this.idRecipesOn.length) {
            document.getElementById('search-alert').dispatchEvent(this.eventEmptySearch);
        }
    }
    // transmission de l'ordre d'affichage / masquage aux cartes recettes
    sendToRecipes() {
        if(this.idRecipesOn.length)  {
            eventAtAll(recipeCards, this.eventOnRecipes, this.idRecipesOn);
        }
        if(this.idRecipesOff.length) {
            eventAtAll(recipeCards, this.eventOffRecipes, this.idRecipesOff);
        }
    }
    // transmission de l'ordre d'affichage aux listes de tags
    sendToTagsList() {
        ALLTAGS.forEach(item => {
            const tagElement = document.getElementById(item + '-tag-list').querySelectorAll('span');
            eventAtAll(tagElement, this.eventOnRecipes);
        })
    }
    // retourne le contenu de la banque des tags
    get listOfAddedTags() {
        return this.activeTags;
    }
    // ajoute un tag en banque
    set pushTag(tag) {
        this.addedTag                          = tag;
        this.activeTags[this.activeTags.length]= tag;
        ++this.isTagged;
        this.setTaggedRecipes();
    }
    // retourne le dernier tag ajouté
    get pushTag() {
        return this.addedTag;
    }
    // retire un tag de la banque
    set pullTag(idTag) {
        this.removedTag = getItemInActiveTags(this.activeTags, idTag);
        removeInActiveTags(this.activeTags, idTag);
        --this.isTagged;
        this.setTaggedRecipes();
    }
    // retourne le dernier tag retiré
    get pullTag() {
        return this.removedTag;
    }
    // transmet le contenu de la recherche principale
    set inputWord(word) {
        this.wordSearched= word;
        this.isSearched  = word.length;
        this.setSearchedRecipes();
    }
    // retourne l'expression à rechercher du champ de recherche principale
    get inputWord() {
        return this.wordSearched;
    }
    // retourne le tableau des recettes actives à l'affichage
    get idRecipesOnBoard() {
        return this.idRecipesOn;
    }
    // indique qu'une recherche est en cours
    get isOnSearch() {
        return (this.isSearched && this.idSearchRecipesOff.length);
    }
}

export { SearchDrive, tagBank, addedTags }
import { INGREDIENT, DEVICE, UTENSIL } from "../utils/naming.js";
import { cardGallery } from "../templates/RecipeCard.js";
import { mergeArray, junctionArray } from "../utils/array-handler-v1.js";
import { eventAtAll } from "../utils/template.js";
import { searchString } from "../utils/string-convert.js";

//COMMENT cible la banque des tags
const tagBank = document.getElementById('tag-bank');

const recipeCards = cardGallery.getElementsByClassName('recipe-card');

class TagBank {
    constructor(recipes) {
        this.recipes = recipes;
        this.tagsInBank = {};
        this.mergeBank = [];
        this.stock = 0;
        this.idRecipes = [...recipes.keys()];
        this.keysRecipes = [];
        this.enableIdRecipesBySearch = [];
        this.enableKeysRecipesBySearch = [];
        this.disableIdRecipesBySearch = [];
        this.disableKeysRecipesBySearch = [];
        this.eventEnableSearchRecipe = new Event('search-enable');
        this.eventDisableSearchRecipe = new Event ('search-disable');
        this.eventSelectTag = new Event ('select-tag');
    }

    initTagBank(idRecipe = 0){
        while(idRecipe < this.recipes.length) {
            this.keysRecipes[idRecipe] = this.recipes[idRecipe].id;
            ++idRecipe;
        }
        this.addSearchEvent();
    }
    
    addSearchEvent() {
        tagBank.addEventListener('search-recipe', (event) => {
            let idRecipe = 0;
            this.enableIdRecipesBySearch = []
            this.enableKeysRecipesBySearch = [] 
            this.disableIdRecipesBySearch = [] 
            this.disableKeysRecipesBySearch = [];
            if(event.detail.length > 0) {
                while(idRecipe < this.idRecipes.length) {
                    //const name = searchString(this.recipes[idRecipe].normalizeName, event.detail);
                    if(this.query(idRecipe, event.detail)) {
                        this.enableIdRecipesBySearch[this.enableIdRecipesBySearch.length] = this.idRecipes[idRecipe];
                        this.enableKeysRecipesBySearch[this.enableKeysRecipesBySearch.length] = this.recipes[idRecipe].id;
                    } else {
                        this.disableIdRecipesBySearch[this.disableIdRecipesBySearch.length] = this.idRecipes[idRecipe];
                        this.disableKeysRecipesBySearch[this.disableKeysRecipesBySearch.length] = this.recipes[idRecipe].id;
                    }
                    ++idRecipe;
                }
            } else {
                this.enableIdRecipesBySearch = this.idRecipes
                this.enableKeysRecipesBySearch = this.keysRecipes
                this.disableIdRecipesBySearch = [] 
                this.disableKeysRecipesBySearch = []
            }
            this.sendSearchToRecipes(this.enableIdRecipesBySearch, this.disableIdRecipesBySearch);
            //FIXME voir pour adopter meme affichage que recettes pour tags
            this.sendSearchToTagList(this.enableKeysRecipesBySearch, this.disableKeysRecipesBySearch);
        });
    }

    query(idRecipe, inputSearch) {
        const name = searchString(this.recipes[idRecipe].normalizeName, inputSearch);
        const description = searchString(this.recipes[idRecipe].normalizeDescription, inputSearch);
        const listIngredients = searchString(this.recipes[idRecipe].listIngredients, inputSearch);
        return name || description || listIngredients;
    }

    sendSearchToRecipes(enable, disable = []) {
        if(enable.length) {
            eventAtAll(recipeCards, this.eventEnableSearchRecipe, enable.length, enable);
        }
        if(disable.length){
            eventAtAll(recipeCards, this.eventDisableSearchRecipe, disable.length, disable);
        }
    }

    sendSearchToTagList(enable, disable) {
        const ingredient = document.getElementById(INGREDIENT+'-tag-list').querySelectorAll('span');
        const device = document.getElementById(DEVICE+'-tag-list').querySelectorAll('span');
        const utensil = document.getElementById(UTENSIL+'-tag-list').querySelectorAll('span');
        eventAtAll(ingredient, this.eventSelectTag);
        eventAtAll(device, this.eventSelectTag);
        eventAtAll(utensil, this.eventSelectTag);
    }

    enableEvent() {
        const enableEvent = new CustomEvent (
            'enable-tag', {
                bubbles: true,
                detail: this.mergeBank
            });
        return enableEvent;
    }

    mergeTagsInBank() {
        let id = 0, merge = [], enableKeys = this.enableKeysRecipesBySearch; 
        if(this.stock) {
            for (const tag in this.tagsInBank) {
                merge = (!id)?  this.tagsInBank[tag] : mergeArray(merge, this.tagsInBank[tag]);
                ++id;
            }
            this.mergeBank = (enableKeys.length)? junctionArray(enableKeys, merge) : merge;
        } else {
            this.mergeBank = [];
        }
        (enableKeys.length)?  eventAtAll(recipeCards, this.enableEvent(), this.enableIdRecipesBySearch.length, this.enableIdRecipesBySearch)
                            : eventAtAll(recipeCards, this.enableEvent());
    }
    
    pushInBank(tag) {
        if(!(tag.tagIndex in this.tagsInBank)) {
            this.tagsInBank[tag.tagIndex] = tag.tagRecipes;
            ++this.stock;
            this.mergeTagsInBank();
        }
    }

    pullOutBank(tag) {
        if(tag.tagIndex in this.tagsInBank) {
            delete this.tagsInBank[tag.tagIndex];
            --this.stock;
            this.mergeTagsInBank();
        }
    }
    //!//COMMENT: tableau des clés recettes affichées (recherche)
    get enableKeysRecipes() {
        return this.enableKeysRecipesBySearch; 
    }

    get listOfTags() {
        return this.tagsInBank;
    }

    get countTags() {
        return this.stock;
    }

    get enabledRecipes() {
        return this.mergeBank;
    }
}

export { TagBank, tagBank }
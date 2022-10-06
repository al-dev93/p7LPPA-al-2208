import { ALLTAGS }      from "../utils/naming.js";
import { addInArray, getItemInActiveTags, junctionArray, junctionListOffArray, removeInActiveTags, removeInArray, substractArray } from "../utils/array-handler-v1.js";
import { searchString } from "../utils/string-convert.js";
import { eventAtAll }   from "../utils/template.js";
import { cardGallery }  from "../templates/RecipeCard.js";

const recipeCards= cardGallery.getElementsByClassName('recipe-card');
const tagBank    = document.getElementById('tag-bank');
const addedTags  = tagBank.getElementsByClassName('badge');

class SearchDrive {
    constructor(recipes) {
        //!//TODO commenter
        this.recipes           = recipes;
        this.idRecipes         = [...recipes.keys()];
        //!//TODO commenter
        this.wordSearched      = "";
        this.isSearched        = 0;
        this.idSearchRecipesOn = [];
        this.idSearchRecipesOff= [];
        //!//TODO commenter
        this.addedTag          = [];
        this.removedTag        = [];
        this.isTagged          = 0;
        this.activeTags        = [];
        //!//TODO commenter
        this.idTaggedRecipesOn = [];
        //!//TODO commenter
        this.idRecipesOn       = this.idRecipes;
        this.idRecipesOff      = [];
        //!//TODO commenter
        this.eventOnRecipes    = new Event('recipeOn');
        this.eventOffRecipes   = new Event('recipeOff');
    }

    setTaggedRecipes() {
        this.idTaggedRecipesOn = junctionListOffArray(this.activeTags);
        this.setDisplayRecipes();
    }

    setSearchedRecipes(recipe = 0) {
        if(this.isSearched) {
            while(recipe < this.idRecipes.length) {
                if(this.getQuery(recipe)) {
                    this.idSearchRecipesOn = addInArray(this.idSearchRecipesOn, this.idRecipes[recipe]);
                    this.idSearchRecipesOff = removeInArray(this.idSearchRecipesOff, this.idRecipes[recipe]);
                } else {
                    this.idSearchRecipesOff = addInArray(this.idSearchRecipesOff, this.idRecipes[recipe]);
                    this.idSearchRecipesOn = removeInArray(this.idSearchRecipesOn, this.idRecipes[recipe]);
                }
                ++recipe;
            }
        } else {
            this.idSearchRecipesOn = this.idRecipes
            this.idSearchRecipesOff= [] 
        }
        this.setDisplayRecipes();
    }

    getQuery(recipe) {
        const name           = searchString(this.recipes[recipe].normalizeName, this.wordSearched);
        const description    = searchString(this.recipes[recipe].normalizeDescription, this.wordSearched);
        const listIngredients= searchString(this.recipes[recipe].listIngredients, this.wordSearched);
        return name || description || listIngredients;
    }

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
    }

    sendToRecipes() {
        if(this.idRecipesOn.length)  {
            eventAtAll(recipeCards, this.eventOnRecipes, this.idRecipesOn.length, this.idRecipesOn);
        }
        if(this.idRecipesOff.length) {
            eventAtAll(recipeCards, this.eventOffRecipes, this.idRecipesOff.length, this.idRecipesOff);
        }
    }

    sendToTagsList(tag = 0) {
        while (tag < ALLTAGS.length) {
            const tagElement = document.getElementById(ALLTAGS[tag] + '-tag-list').querySelectorAll('span');
            eventAtAll(tagElement, this.eventOnRecipes);
            ++tag;
        }
    }

    get listOfAddedTags() {
        return this.activeTags;
    }

    set pushTag(tag) {
        this.addedTag                          = tag;
        this.activeTags[this.activeTags.length]= tag;
        ++this.isTagged;
        this.setTaggedRecipes();
    }

    get pushTag() {
        return this.addedTag;
    }

    set pullTag(idTag) {
        this.removedTag = getItemInActiveTags(this.activeTags, idTag);
        this.activeTags = removeInActiveTags(this.activeTags, idTag);
        --this.isTagged;
        this.setTaggedRecipes();
    }

    get pullTag() {
        return this.removedTag;
    }

    set inputWord(word) {
        this.wordSearched= word;
        this.isSearched  = word.length;
        this.setSearchedRecipes();
    }

    get inputWord() {
        return this.wordSearched;
    }

    get idRecipesOnBoard() {
        return this.idRecipesOn;
    }

    get searchedRecipesOn() { //HACK voir si utile
        return this.idSearchRecipesOn;
    }

    get searchedRecipesOff() { //HACK voir si utile
        return this.idSearchRecipesOff;
    }

    get isOnSearch() {
        return (this.isSearched && this.idSearchRecipesOff.length); //TODO a vérifier 
    }
}

export { SearchDrive, tagBank, addedTags }
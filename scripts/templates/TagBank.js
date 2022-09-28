import { cardGallery } from "../templates/RecipeCard.js";
import { mergeArray } from "../utils/array-handler-v1.js";

//COMMENT cible la banque des tags
const tagBank = document.getElementById('tag-bank')

class TagBank {
    constructor() {
        this.tagsInBank = {};
        this.mergeBank = [];
        this.stock = 0;
        this.cards = cardGallery.getElementsByClassName('recipe-card');
    }

    enableEvent() {
        const enableEvent = new CustomEvent (
            'enable-tag', {
                bubbles: true,
                detail: this.mergeBank
            });
        return enableEvent;
    }

    sendBank(id = 0) {
        if(id < this.cards.length) {
            this.cards[id].dispatchEvent(this.enableEvent());
            this.sendBank(++id);
        }
    }

    mergeTagsInBank() {
        if(this.stock) {
            let id = 0;
            for (const tag in this.tagsInBank) {
                const merge = (!id)?  this.tagsInBank[tag] : mergeArray(this.mergeBank, this.tagsInBank[tag]);
                this.mergeBank = merge;
                ++id;
            }
        } else {
            this.mergeBank.length = 0;
        }
        this.sendBank();
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
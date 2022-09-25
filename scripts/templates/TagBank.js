import { cardGallery } from "../templates/RecipeCard.js";
import { mergeArray } from "../utils/array-handler-v1.js";

//COMMENT cible la banque des tags
const tagBank = document.getElementById('tag-bank')

class TagBank {
    constructor() {
        this.tagsInBank = {};
        this.mergeBank = [];
        this.stock = 0;
        this.cards = cardGallery.getElementsByClassName('recipe-card')
    }

    enableEvent() {
        const enableEvent = new CustomEvent (
            'enable-tag', {
                bubbles: true,
                detail: this.mergeBank
            });
        return enableEvent;
    }

    sendBank(cards, id = 0) {
        if(id < cards.length) {
            cards[id].dispatchEvent(this.enableEvent());
            this.sendBank(cards, ++id);
        }
    }

    mergeTagsInBank() {
        if(this.stock) {
            let id = 0;
            for (const tag in this.tagsInBank) {
                if (!id) {
                    this.mergeBank = this.tagsInBank[tag];
                } else {
                    const merge = mergeArray(this.mergeBank, this.tagsInBank[tag]);
                    this.mergeBank = merge;
                }
                ++id;
            }
        } else {
            this.mergeBank.length = 0;
        }
        this.sendBank(this.cards);
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
}

export { TagBank, tagBank }
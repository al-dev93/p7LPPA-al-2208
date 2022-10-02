import { DESIGN } from "../../scripts/utils/naming.js";
import { tagBank} from "../../scripts/templates/TagBank.js";
import { templateClone } from "../utils/template.js";

//COMMENT  cible le template html des tags insérés en banque
const tagTemplate = document.getElementById('tag-template');

//COMMENT créée les tags qui sont insérés dans la banque
class Tag {
    constructor(index, theme, name, recipes, bank){
        this.index = index;
        this.theme = theme;
        this.name = name;
        this.recipes = recipes;
        this.bank = bank;
        this.background = DESIGN.tbg + this.theme;
        this.tags = tagBank.getElementsByClassName('badge');
        this.tag;
    }

    // insert un tag dans la banque de tags
    createTag(){
        this.insertTemplate();
        this.tag = this.tags[this.tags.length-1];
        this.controlTag();
        this.bank.pushInBank(this);
    }

    insertTemplate() {
        const [{clone}, {custom}] = templateClone(tagTemplate, '.badge');
        const label = this.name;
        custom.classList.add(this.background);
        custom.insertAdjacentText('afterbegin', label);
        tagBank.appendChild(clone);
    }

    // gestion des évènements pour le retrait du tag en banque
    controlTag(){
        const closeTag = this.tag.querySelector('.bi-x-circle');
        closeTag.addEventListener('click', (event) => this.outTagBank(event));
        closeTag.addEventListener('keydown', (event) => this.outTagBank(event));
    }

    outTagBank(event) {
        if((event.type === 'keydown' && event.key === 'Enter') || event.type === 'click') {
            this.bank.pullOutBank(this);
            this.tag.remove();
        }
    }

    get tagIndex() {
        return this.index;
    }

    get tagRecipes() {
        return this.recipes;
    }
}


export { Tag }
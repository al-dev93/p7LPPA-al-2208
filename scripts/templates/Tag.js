import { DESIGN } from "../../scripts/utils/naming.js";
import { tagBank} from "../../scripts/templates/TagBank.js";

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
        this.tag;
    }

    // insert un tag dans la banque de tags
    createTag(){
        this.insertTemplate();
        const index = tagBank.getElementsByClassName('badge').length - 1;
        this.tag = tagBank.getElementsByClassName('badge')[index];
        this.controlTag();
        this.bank.pushInBank(this);
    }

    insertTemplate() {
        const clone = document.importNode(tagTemplate.content, true);
        const insert = clone.querySelector('.badge');
        const label = this.name;
        insert.classList.add(this.background);
        insert.insertAdjacentText('afterbegin', label);
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
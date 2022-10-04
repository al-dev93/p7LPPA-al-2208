import { DESIGN }             from "../../scripts/utils/naming.js";
import { templateClone }      from "../utils/template.js";
import { tagBank, addedTags } from "../templates/SearchDrive.js";

//COMMENT  cible le template html des tags
const tagTemplate = document.getElementById('tag-template');

//COMMENT créée les tags qui sont insérés dans la banque
class Tag {
    constructor(theme, name, idAttr){
        this.theme     = theme;
        this.name      = name;
        this.idTagAttr = idAttr;
        this.background= DESIGN.tbg + this.theme;
        this.searchTag = document.getElementById(this.theme + '-tag-search');
        this.idTag;
        this.tag;
    }

    // insère un nouveau tag
    addTag(){
        this.insertTemplate(); // template html
        this.idTag= addedTags.length-1
        this.tag  = addedTags[this.idTag];
        this.controlTag();
    }

    // utilise le template html pour créer le tag
    insertTemplate() {
        const [{clone}, {custom}] = templateClone(tagTemplate, '.badge');
        const label = this.name;
        custom. classList.add(this.background);
        custom. insertAdjacentText('afterbegin', label);
        custom. setAttribute('data-id', this.idTagAttr);
        tagBank.appendChild(clone);
    }

    // gestion de l'évènement retrait du tag
    controlTag(){
        const closeTag = this.tag.querySelector('.bi-x-circle');
        closeTag.addEventListener('click',  (event) => this.removeTag(event));
        closeTag.addEventListener('keydown',(event) => this.removeTag(event));
    }

    // retire le tag de l'affichage
    removeTag(event) {
        const enableEvent = new CustomEvent (
            'tagOff', {
                bubbles: true,
                detail: {
                    idListOfTag: this.idTagAttr,
                    idInTagBank: this.idTag
                }
            });
        if((event.type === 'keydown' && event.key === 'Enter') || event.type === 'click') {
            this.searchTag.dispatchEvent(enableEvent);
        }
    }
}


export { Tag }
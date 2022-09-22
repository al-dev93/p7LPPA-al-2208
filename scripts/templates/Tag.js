import { DESIGN } from "../../scripts/utils/naming.js";

//COMMENT  cible le template html des tags insérés en banque
const tagTemplate = document.getElementById('tag-template');
//COMMENT cible la banque des tags
const tagBank = document.getElementById('tag-bank')

//COMMENT créée les tags qui sont insérés dans la banque
class Tag {
    constructor(link, theme, name){
        this.theme = theme;
        this.name = name;
        this.background = DESIGN.tbg + this.theme;
        this.link = link;
    }

    // insert un tag dans la banque de tags
    insertTag(){
        const clone = document.importNode(tagTemplate.content, true);
        const insert = clone.querySelector('.badge');
        const label = this.name;
        insert.classList.add(this.background);
        insert.insertAdjacentText('afterbegin', label);
        tagBank.appendChild(clone);
        this.controlTag();
    }
    // gestion des évènements pour le retrait du tag en banque
    controlTag(){
        const tags = tagBank.getElementsByClassName('badge');
        const index = tags.length - 1;
        const lastTag = tags.item(index);
        const closeTag = lastTag.querySelector('.bi-x-circle');
        closeTag.addEventListener('click', () => lastTag.remove());
        closeTag.addEventListener('keydown', (event) => {
            if(event.key === 'Enter'){
                lastTag.remove();
            }
        })
    }
}


export { Tag, tagBank }
import { DESIGN } from "../../scripts/utils/naming.js";
import { tagBank } from "../../scripts/templates/Tag.js";

//COMMENT:  cible le template html des items de la liste déroulante de tags
const tagListTemplate = document.getElementById('tag-list-template');

//COMMENT: créée les listes déroulantes de tags 
class SearchTag {
    constructor(theme, data) {
        this.theme = theme;
        this.data = data;
        this.target = document.getElementById(this.theme + '-tag-list');
        this.tagSearch = document.getElementById(this.theme + '-tag-search');
        this.tagGroup = document.getElementById(this.theme + '-tag-group');
        this.background = DESIGN.bg + this.theme;

    }
    // créé la liste déroulante de tags
    createTagList(index = 0) {
        if(index < this.data.length) {
            this.insertTemplate(index, this.data[index].value);
            this.tags = this.target.querySelectorAll('span');
            this.addTagControl(this.tags[index], index);
            this.createTagList(++index);
        }
        this.controlsWidget();
    }
    // insert le template html des tags de la liste déroulante
    insertTemplate(id, value) {
        const clone = document.importNode(tagListTemplate.content, true);
        const insert = clone.querySelector('span');
        insert.insertAdjacentText('beforeend', value);
        insert.setAttribute('data-id', `${id}`);
        this.target.appendChild(clone);
    }
    // gestion de l'évènement insérant un tag dans la banque
    addTagControl(tag, index) {
        tag.addEventListener('click', () => this.eventInsertTag(index));
        tag.addEventListener('keydown', (event) => {
            if(event.key === 'Enter') {
                this.eventInsertTag(index);
            }
        });
    }
    //! //TODO: commenter la méthode
    eventInsertTag(index) {
        const eventInsert = new CustomEvent (
            'insert', {
                bubbles: true,
                detail:{
                    link: index,
                    theme: this.theme,
                    name: this.data[index].value,
                    recipes: this.data[index].id
                }});
        tagBank.dispatchEvent(eventInsert);
    }
    // gestion des évènement pour l'ouverture et la fermeture de la liste déroulante 
    controlsWidget() {
        const tagInput = this.tagSearch.querySelector('input');
        const labelInput = this.tagSearch.querySelector('label');
        this.tagSearch.addEventListener('focusin', () => this.openWidget(this.tagSearch, this.tagGroup, tagInput, labelInput));
        this.tagSearch.addEventListener('focusout', () => this.closeWidget(this.tagSearch, this.tagGroup, tagInput, labelInput));
        this.tagSearch.addEventListener('keydown', (event) => this.escapeWidget(event, this.tagSearch));
        tagInput.addEventListener('keydown', (event) => this.escapeWidget(event, this.tagSearch));
        this.tagGroup.addEventListener('keydown', (event) => this.escapeWidget(event, this.tagSearch));
        labelInput.addEventListener('click', (event) => this.escapeWidget(event, this.tagSearch));
    }    

    // ouvre la liste déroulante
    openWidget(tag, list, input, label) {
        list.classList.remove('visually-hidden-focusable');
        input.value = "";
        label.classList.toggle('rotate-caret');
        tag.setAttribute('aria-expanded', 'true');
    }

    // retire le focus
    escapeWidget(event, item) {
        if(event.type === 'keypress' && event.key !== 'Escape') {
            return;
        }
        else if(event.type === 'click' || event.key === 'Escape') {
            if(item.getAttribute('aria-expanded') === 'true'){
                event.preventDefault();
                event.stopPropagation();
                item.focus();
                item.blur();
            }
        }
    }

    // ferme la liste déroulante
    closeWidget(tag, list, input, label) {
        list.classList.add('visually-hidden-focusable');
        input.value = input.defaultValue;
        label.classList.toggle('rotate-caret');
        tag.setAttribute('aria-expanded', 'false');
    }

}

export { SearchTag }
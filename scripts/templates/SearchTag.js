import { DESIGN } from "../../scripts/utils/naming.js";
import { Tag } from "../../scripts/templates/Tag.js";
import { searchString, stringNormalize } from "../utils/string-convert.js";

//COMMENT:  cible le template html des items de la liste déroulante de tags
const tagListTemplate = document.getElementById('tag-list-template');

//COMMENT: créée les listes déroulantes de tags 
class SearchTag {
    constructor(theme, data, bank) {
        this.theme = theme;
        this.data = data;
        this.bank = bank;
        this.target = document.getElementById(this.theme + '-tag-list');
        this.tagSearch = document.getElementById(this.theme + '-tag-search');
        this.tagGroup = document.getElementById(this.theme + '-tag-group');
        this.tagInput = document.getElementById(this.theme + '-list');
        this.tags;
        this.background = DESIGN.bg + this.theme;
        this.SearchEvent = new Event('search-tag');
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
        tag.addEventListener('click', () => this.addTag(index));
        tag.addEventListener('keydown', (event) => {
            if(event.key === 'Enter') {
                this.addTag(index);
            }
        });
        tag.addEventListener('search-tag', () => this.searchInput(index));
    }

    addTag(index) {
        const idTag = this.theme+index;
        if (!(idTag in this.bank.listOfTags)) {
            const recipes = JSON.parse(JSON.stringify(this.data[index].id));
            const newTag = new Tag(idTag, this.theme, this.data[index].value, recipes, this.bank);
            newTag.createTag();
        }
    }

    //!//TODO commenter la méthode
    searchInput(index) {
        const search = searchString(this.data[index].normalize, stringNormalize(`${this.tagInput.value}`)) || this.tagInput.value === "";
        if(search) {
            this.tags[index].classList.remove('d-none');
        } else {
            this.tags[index].classList.add('d-none');
        }
    }

    // gestion des évènement pour l'ouverture et la fermeture de la liste déroulante 
    controlsWidget() {
        const labelInput = this.tagSearch.querySelector('label');
        this.tagInput.addEventListener('focusin', () => this.enableAllTags());
        this.tagInput.addEventListener('input', () => this.sendSearchTag());
        this.tagSearch.addEventListener('focusin', () => this.openWidget(labelInput));
        this.tagSearch.addEventListener('focusout', () => this.closeWidget(labelInput));
        this.tagSearch.addEventListener('keydown', (event) => this.escapeWidget(event));
        this.target.addEventListener('keydown', (event) => this.escapeWidget(event));
        this.tagGroup.addEventListener('keydown', (event) => this.escapeWidget(event));
        labelInput.addEventListener('click', (event) => this.escapeWidget(event));
    }    

    sendSearchTag(id = 0) {
        if(id < this.tags.length) {
            this.tags[id].dispatchEvent(this.SearchEvent);
            this.sendSearchTag(++id);
        }
    }

    enableAllTags(id = 0) {
        if( id < this.tags.length) {
            this.tags[id].classList.remove('d-none');
            this.enableAllTags(++id);
        }
    }
    // ouvre la liste déroulante
    openWidget(label) {
        this.tagGroup.classList.remove('visually-hidden-focusable');
        label.classList.add('rotate-caret');
        this.tagInput.value = "";
        this.tagSearch.setAttribute('aria-expanded', 'true');
    }

    // retire le focus
    escapeWidget(event) {
        if(event.type === 'keypress' && event.key !== 'Escape') {
            return;
        }
        else if(event.type === 'click' || event.key === 'Escape') {
            if(this.tagSearch.getAttribute('aria-expanded') === 'true'){
                event.preventDefault();
                event.stopPropagation();
                this.tagSearch.focus();
                this.tagSearch.blur();
            }
        }
    }

    closeWidget(label) {
        this.tagGroup.classList.add('visually-hidden-focusable');
        label.classList.remove('rotate-caret');
        this.tagInput.value = this.tagInput.defaultValue;
        this.tagSearch.setAttribute('aria-expanded', 'false');
    }

}

export { SearchTag }
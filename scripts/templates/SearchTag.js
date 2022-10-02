import { DESIGN } from "../../scripts/utils/naming.js";
import { Tag } from "../../scripts/templates/Tag.js";
import { eventAtAll, templateClone } from "../utils/template.js";
import { junctionArray } from "../utils/array-handler-v1.js";
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
        this.enableRecipes = [];
        this.background = DESIGN.bg + this.theme;
        this.eventSearch = new Event('search-tag');
    }

    createSearchTag() {
        this.createTagList();
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
        const [{clone}, {custom} ] = templateClone(tagListTemplate, 'span');
        custom.insertAdjacentText('beforeend', value);
        custom.setAttribute('data-id', `${id}`);
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
        tag.addEventListener('select-tag', () => this.enabledTagBySearch(tag, index))
    }
    //FIXME problème de recherche dans le bon tableau si affiche suite à recherche générale ou pas
    //!//TODO commenter la méthode
    searchInput(index) {
        const search = searchString(this.data[index].normalize, stringNormalize(`${this.tagInput.value}`)) || this.tagInput.value === "";
        if(search) {
            this.tags[index].classList.remove('d-none');
        } else {
            this.tags[index].classList.add('d-none');
        }
    }

    enabledTagBySearch(tag, index) {
        if(this.bank.enableKeysRecipes.length) { //FIXME remplacer par enableIdRecipes
            //  et keysRecipeInTag par idRecipesInTag
            const keysRecipeInTag = junctionArray(this.data[index].id, this.bank.enableKeysRecipes); //FIXME remplacer id par idRecipes et enableIdRecipes
            (keysRecipeInTag.length == 0)? tag.classList.add('d-none') : tag.classList.remove('d-none');
        } else {
            tag.classList.remove('d-none');
        }
    }
    
    addTag(index) {
        const idTag = this.theme+index;
        if (!(idTag in this.bank.listOfTags)) {
            const recipes = JSON.parse(JSON.stringify(this.data[index].id)); //FIXME remplacer id par idRecipes
            const newTag = new Tag(idTag, this.theme, this.data[index].value, recipes, this.bank);
            newTag.createTag();
        }
    }

    // gestion des évènement pour l'ouverture et la fermeture de la liste déroulante 
    //FIXME quand cherche dans searchtag, l'affichage de la liste des taches reste verrouillée sur résultat recherche
    controlsWidget() {
        const labelInput = this.tagSearch.querySelector('label');
        this.tagInput.addEventListener('focusin', () => {
            if(this.tagInput.value === "") {
                this.enableAllTags();
            }
        });
        this.tagInput.addEventListener('input', () => eventAtAll(this.tags, this.eventSearch));
        this.tagSearch.addEventListener('focusin', () => this.openWidget(labelInput));
        this.tagSearch.addEventListener('focusout', () => this.closeWidget(labelInput));
        this.tagSearch.addEventListener('keydown', (event) => this.escapeWidget(event));
        this.target.addEventListener('keydown', (event) => this.escapeWidget(event));
        this.tagGroup.addEventListener('keydown', (event) => this.escapeWidget(event));
        labelInput.addEventListener('click', (event) => this.escapeWidget(event));
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
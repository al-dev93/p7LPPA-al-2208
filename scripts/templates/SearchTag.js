import { DESIGN }    from "../../scripts/utils/naming.js";
import { addedTags } from "../templates/SearchDrive.js";
import { Tag }       from "../../scripts/templates/Tag.js";
import { eventAtAll, templateClone }     from "../utils/template.js";
import { junctionArray, inActiveTags, inArray }   from "../utils/array-handler-v1.js";
import { searchString, stringNormalize } from "../utils/string-convert.js";

//COMMENT:  cible le template html des items de la liste déroulante de tags
const tagListTemplate = document.getElementById('tag-list-template');


//COMMENT: créée les listes déroulantes de tags 
class SearchTag {
    constructor(theme, data, searchDrive) {
        this.theme= theme;
        this.data = data;
        this.searchDrive = searchDrive;
        this.tagSearch   = document.getElementById(this.theme + '-tag-search');
        this.tagInput    = document.getElementById(this.theme + '-list');
        this.tagGroup    = document.getElementById(this.theme + '-tag-group');
        this.target      = document.getElementById(this.theme + '-tag-list');
        this.tagListElem = [];
        this.idTagList   = [...data.keys()];
        this.idTagListOn = [];
        this.idTagListOff= [];
        this.background  = DESIGN.bg + this.theme;
        this.eventSearch = new Event('searchTag');
    }

    // créé la liste déroulante de tags
    createSearchTag(index = 0) {
        if(index < this.data.length) {
            this.insertTemplate(index, this.data[index].value);
            this.tagListElem = this.target.querySelectorAll('span');
            this.addTagListControl(this.tagListElem[index], index);
            this.createSearchTag(++index);
        }
        this.controlsWidget();
    }

    // insère le template html des tags de la liste déroulante
    insertTemplate(id, value) {
        const [{clone}, {custom} ] = templateClone(tagListTemplate, 'span');
        custom.insertAdjacentText('beforeend', value);
        custom.setAttribute('data-id', this.theme + "-" + id);
        this.  target.appendChild(clone);
    }

    // gestion de l'évènement insérant un tag dans la banque
    addTagListControl(tag, index) {
        tag.addEventListener('click',  ()      => this.addTag(index));
        tag.addEventListener('keydown',(event) => {
            if(event.key === 'Enter') {
                this.addTag(index);
            }
        });
        // actualise la liste des tag en fonction de la recherche de recette
        tag.addEventListener('recipeOn', () => this.setTagListOnSearchRecipe(tag, index))
        // actualise la liste des tag en fonction de la recherche de tag
        tag.addEventListener('searchTag',() => this.setTagListOnSearchTag(index));
    }

    // ajoute un tag dans la banque des tags
    addTag(index) {
        const idTag = this.theme + "-" + index;
        if(!inActiveTags(this.searchDrive.listOfAddedTags, idTag)) {
            new Tag(this.theme, this.data[index].value, idTag).addTag();
            this.searchDrive.pushTag = [idTag, this.data[index].idRecipes];
        }
    }

    // actualise la liste des tags suite à une recherche lancée dans le champ de recherche de recette
    setTagListOnSearchRecipe(tag, index) {
        if(this.searchDrive.isOnSearch) {
            const enableTags = junctionArray(this.searchDrive.searchedRecipesOn, this.data[index].idRecipes);
            if(!enableTags.length) {
                tag. classList.add('d-none');
                this.idTagListOff[this.idTagListOff.length]= index;
            } else {
                tag. classList.remove('d-none');
                this.idTagListOn[this.idTagListOn.length]  = index;
            }
        } else {
            tag. classList.remove('d-none');
            this.idTagListOn[index] = this.idTagList[index];
        }
    }

    //!//TODO commenter la méthode
    setTagListOnSearchTag(index) {
        if(this.searchDrive.isOnSearch && inArray(this.idTagListOff, index)) {
            return;
        } else {
            (searchString(this.data[index].normalize, stringNormalize(`${this.tagInput.value}`)))?
                this.tagListElem[index].classList.remove('d-none') :
                this.tagListElem[index].classList.add('d-none');
        }
    }

    // gestion des évènement pour l'ouverture et la fermeture de la liste déroulante 
    //FIXME quand cherche dans searchtag, l'affichage de la liste des taches reste verrouillée sur résultat recherche
    controlsWidget() {
        const labelInput = this.tagSearch.querySelector('label');
        this.tagInput.addEventListener('focusin', () => {
            if(this.tagInput.value === "") {
                this.enableAllTagList();
            }
        });
        this.tagInput.addEventListener ('input',   ()      => eventAtAll(this.tags, this.eventSearch));
        this.tagSearch.addEventListener('focusin', ()      => this.openWidget(labelInput));
        this.tagSearch.addEventListener('focusout',()      => this.closeWidget(labelInput));
        this.tagSearch.addEventListener('keydown', (event) => this.escapeWidget(event));
        this.tagSearch.addEventListener('tagOff',  (event) => this.removeTagInBank(event));
        this.target.addEventListener   ('keydown', (event) => this.escapeWidget(event));
        this.tagGroup.addEventListener ('keydown', (event) => this.escapeWidget(event));
        labelInput.addEventListener    ('click',   (event) => this.escapeWidget(event));
    }    

    enableAllTagList(id = 0) {
        if( id < this.tagListElem.length) {
            this.tagListElem[id].classList.remove('d-none');
            this.enableAllTagList(++id);
        }
    }

    //!//TODO commenter la méthode
    removeTagInBank(event) {
        if(inActiveTags(this.searchDrive.listOfAddedTags, event.detail.idListOfTag)) {
            addedTags[event.detail.idInTagBank].remove();
            this.searchDrive.pullTag = event.detail.idListOfTag;
        }
    }

    // ouvre la liste déroulante
    openWidget(label) {
        this. tagSearch.setAttribute('aria-expanded', 'true');
        this. tagInput. value = "";
        this. tagGroup. classList.remove('visually-hidden-focusable');
        label.classList.add('rotate-caret');
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
                this. tagSearch.focus();
                this. tagSearch.blur();
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
import { DESIGN }                                                            from "../../scripts/utils/naming.js";
import { tagBank }                                                           from "../templates/SearchDrive.js";
import { Tag }                                                               from "../../scripts/templates/Tag.js";
import { eventAtAll, templateClone }                                         from "../utils/template.js";
import { addInArray, junctionArray, inActiveTags, inArray, removeInArray }   from "../utils/array-handler.js";
import { searchString, stringNormalize }                                     from "../utils/string-convert.js";

// COMMENT:  cible le template html des items de la liste déroulante de tags
const tagListTemplate = document.getElementById('tag-list-template');


// COMMENT: créée les listes déroulantes de tags 
class SearchTag {
    constructor(theme, data, searchDrive) {
        this.theme       = theme;
        this.background  = DESIGN.bg + this.theme;
        this.data        = data;
        this.searchDrive = searchDrive;
        // cible les différents éléments constituant le widget
        this.tagSearch     = document.getElementById(this.theme + '-tag-search');
        this.tagInput      = document.getElementById(this.theme + '-list');
        this.tagGroup      = document.getElementById(this.theme + '-tag-group');
        this.target        = document.getElementById(this.theme + '-tag-list');
        this.dropDownArrow = this.tagSearch.querySelector('label');
        // gestion du panneau de la liste des tags
        this.tagListWidth         = 0;
        this.tagListElem          = [];
        this.idTagList            = [...data.keys()];
        this.idTagListOn          = this.idTagList;
        this.itemTagListSearchOff = [];
        // évènement activé pour la recherche par tag
        this.eventSearch  = new Event('searchTag');
    }

    // créé la liste déroulante de tags
    createSearchTag(index = 0) {
        if(index < this.data.length) {
            this.insertTemplate (index, this.data[index].value); // insère le template html
            this.tagListElem = this.target.querySelectorAll('span');
            this.addTagListEvent(this.tagListElem[index], index);
            this.createSearchTag(++index);
        }
        this.tagListWidth = this.target.offsetWidth;
        this.addWidgetEvent();
    }

    // insère le template html des tags de la liste déroulante
    insertTemplate(id, value) {
        const [{clone}, {custom} ] = templateClone(tagListTemplate, 'span');
        custom.insertAdjacentText('beforeend', value);
        custom.setAttribute      ('data-id', this.theme + "-" + id);
        this.  target.appendChild(clone);
    }

    /*  COMMENT: ajoute un tag dans la banque des tags -             //
    //  un tag est un array dont l'indice [0] contient la clé du tag //
    //  et l'indice [1] un array avec les indices des recettes qui   //
    //  l'utilisent (ingrédient ou appareil ou ustensile)            */
    addTag(index) {
        const idTag = this.theme + "-" + index;
        if(!inActiveTags(this.searchDrive.listOfAddedTags, idTag)) {
            new Tag(this.theme, this.data[index].value, idTag).addTag();
            this.searchDrive.pushTag = [idTag, this.data[index].idRecipes];
            this.setWidthTagList();
            this.tagInput.focus();
        }
    }

    // retire un tag de la banque des tags
    removeTagInBank(event) {
        const targetTag = tagBank.querySelector("[data-id ="+event.detail.idListOfTag+"]");
        if(inActiveTags(this.searchDrive.listOfAddedTags, event.detail.idListOfTag)) {
            targetTag.remove();
            this.searchDrive.pullTag = event.detail.idListOfTag;
        }
    }

    // gestion de l'évènement insérant un tag dans la banque
    addTagListEvent(tag, index) {
        tag.addEventListener('click',    ()      => this.addTag(index));
        tag.addEventListener('keydown',  (event) => {
            if(event.key === 'Enter') {
                this.addTag(index);
            }
        });
        // actualise la liste des tag en fonction de la recherche de recette
        tag.addEventListener('recipeOn', ()      => this.setTagListOnSearchRecipe(tag, index));
        // actualise la liste des tag en fonction de la recherche de tag
        tag.addEventListener('searchTag',()      => this.setTagListOnSearchTag(index));
    }

    // actualise la liste des tags suite à une recherche lancée dans le champ de recherche principale
    setTagListOnSearchRecipe(tag, index) {
        const enableTag = junctionArray(this.data[index].idRecipes, this.searchDrive.idRecipesOnBoard);
        if(enableTag.length) {
            tag. classList.remove('d-none');
            this.idTagListOn = addInArray   (this.idTagListOn, index);
        } else {
            tag. classList.add('d-none');
            this.idTagListOn = removeInArray(this.idTagListOn, index);
        }
    }

    // actualise la liste des tags suite à une recherche dans le widget de la liste
    setTagListOnSearchTag(index) {
        const enableTag = inArray(this.idTagListOn, index);
        if(!enableTag) {
            return;
        }
        const searchTag = searchString(this.data[index].normalize, stringNormalize(this.tagInput.value));
        if((this.tagInput.value === "" && !this.searchDrive.isOnSearch) || (this.tagInput.value === "" && enableTag))  {
            this.tagListElem[index].classList.remove('d-none');
            this.itemTagListSearchOff = removeInArray(this.itemTagListSearchOff, index);
        } else if((!this.searchDrive.isOnSearch && !searchTag) || (!searchTag && enableTag)) {
            this.tagListElem[index].classList.add('d-none');
            this.itemTagListSearchOff = addInArray(this.itemTagListSearchOff, index);
        } else if((!this.searchDrive.isOnSearch && searchTag) || (searchTag && enableTag)) {
            this.tagListElem[index].classList.remove('d-none');
            this.itemTagListSearchOff = removeInArray(this.itemTagListSearchOff, index);
        }
    }
    // vide la recherche en cours lorsqu'elle n'a pas été suivie d'un click sur un tag
    clearTagListSearch() {
        if(this.idTagListOn.length === (this.idTagList.length - this.itemTagListSearchOff.length)
        || !this.itemTagListSearchOff.length) {
            return;
        }
        for (const key in this.itemTagListSearchOff) {
            if(inArray(this.idTagListOn, this.itemTagListSearchOff[+key])){
                this.tagListElem[this.itemTagListSearchOff[+key]].classList.remove('d-none');
            }
        }
    }

    /*  COMMENT: dimmensionne le panneau de la liste des tags en fonction du nombre de tags //
    //  restant à afficher suite à une recherche et en fonction de la taille du viewport    */
    setWidthTagList() {
        const column = (667 - 14) / 3;          // largeur d'une colonne du panneau liste de tags
        const width  = this.target.offsetWidth; // largeur du panneau
        if(width < 170) {                       // plus de tags à afficher
            this.tagGroup.classList.add('visually-hidden-focusable');
            return;
        }
        if(width !== this.tagGroup.offsetWidth) {
            let n       = 1;
            const ratio = Math.round((width - 14) / column);
            this.tagGroup.classList.add   ('width-'+`${ratio}`);
            this.tagGroup.classList.remove('visually-hidden-focusable');
            while(ratio > n ) {
                this.tagGroup.classList.remove('width-'+`${n}`);
                ++n;
            }
        }
    }

    // gestion des évènement pour l'ouverture et la fermeture de la liste déroulante 
    addWidgetEvent() {
        this.tagInput.addEventListener ('input',   ()      => {
            eventAtAll(this.tagListElem, this.eventSearch);
            this.setWidthTagList();
        });
        this.tagInput,     addEventListener('keydown', (event) => this.escapeWidget(event));
        this.tagSearch.    addEventListener('focusin', ()      => this.openWidget());
        this.tagSearch.    addEventListener('focusout',(event) => this.closeWidget(event));
        this.tagSearch.    addEventListener('keydown', (event) => this.escapeWidget(event));
        this.tagSearch.    addEventListener('tagOff',  (event) => this.removeTagInBank(event));
        this.target.       addEventListener('keydown', (event) => this.escapeWidget(event));
        this.tagGroup.     addEventListener('keydown', (event) => this.escapeWidget(event));
        this.dropDownArrow.addEventListener('click',   (event) => this.escapeWidget(event));
    }    

    // ouvre la liste déroulante
    openWidget() {
        this. tagSearch.    setAttribute('aria-expanded', 'true');
        this. tagInput.     value = '';
        this. tagGroup.     classList.remove('visually-hidden-focusable');
        this. dropDownArrow.classList.add('rotate-caret');
        this. setWidthTagList();
    }

    // commande la fermeture avec escape ou un click sur la flèche du widget
    escapeWidget(event) {
        if(event.type === 'keydown' && event.key !== 'Escape') {
            return;
        }
        if(event.type === 'click' || event.key === 'Escape') {
            if(this.tagSearch.getAttribute('aria-expanded') === 'true'){
                this.closeWidget(event)
            }
        }
    }

    // ferme la liste déroulante
    closeWidget(event) {
        if(event.relatedTarget !== null 
        && event.relatedTarget !== undefined 
        && event.relatedTarget.hasAttribute('data-id')) {
            return;
        }
        this.tagGroup.     classList.add('visually-hidden-focusable');
        this.dropDownArrow.classList.remove('rotate-caret');
        if(this.tagInput.value.length) {
            this.clearTagListSearch();
        }
        this.    tagInput. value = this.tagInput.defaultValue;
        this.    tagSearch.setAttribute('aria-expanded', 'false');
        event.   preventDefault();
    }

}

export { SearchTag }
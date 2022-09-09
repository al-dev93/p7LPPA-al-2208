const INGREDIENTS = [
    'riz',
    'pommes de terre',
    'haricots verts',
    'sel',
    'poivre',
    'huile',
    'spaghetti',
    'maccaroni',
    'semoule',
    'coquillettes',
    'carottes',
    'échalottes',
    'oignons',
    'ail',
    'vinaigre',
    'poivre',
    'graines de moutarde',
    'pois chiche',
    'aubergine',
    'courgettes',
    'concombres',
    'laitue',
    'salade feuille de chêne',
    'emmental râpé',
    'farine',
    'sucre en poudre',
    'levure',
    'oeuf'
];

const DEVICES = [
    'blender',
    'laminoire',
    'gauffrier',
    'crêpière électrique',
    'mixer plongeant',
    'pétrin',
    'bouilloire',
    'hachoir',
    'appareil à râclette',
    'éminceur',
    'râpe électrique',
    'four électrique',
    'four micro-ondes',
    'congélateur',
    'réfrigérateur',
    'grill électrique',
    'fouet électrique',
    'plancha électrique',
    'turbine à glace'
]

const UTENSILS = [
    'petite cuillère',
    'cuillère à soupe',
    'couteau',
    'fourchette',
    'râpe à fromage',
    'couteau éplucher',
    'couteau à découper',
    'ciseau',
    'presse ail',
    'presse citron',
    'mandoline',
    'verre mesureur',
    'maryse',
    'casse-noisette',
    'louche',
    'écumoire',
    'pinceau',
    'spatule ajourée',
    'spatule à raclette',
    'spatule',
    'pince',
    'couteau à huitres',
    'cuillère à pâte',
    'passoire',
    'chinois',
    'entonnoir',
    'essoreuse à salade'
];

const DESIGN = {
    theme : ['ingredients', 'devices', 'utensils'],
    data : [INGREDIENTS, DEVICES, UTENSILS],
    bg : 'bg-',
    bo : 'border-', 
    tbg: 'text-bg-'
};

const tplSearchDropdownTagList = document.getElementById('tpl-search-dropdown-tag-list');
const tplInsertTagBank = document.getElementById('tpl-insert-tag-bank');
const tagSearch = document.getElementsByClassName('tag-search');
const tagBank = document.getElementById('tag-bank')
const suffixDropdownTaglist = "-tag-list";


function searchDropdownTagList() {
    for (let index = 0; index < DESIGN.theme.length; index++) {
        const theme = DESIGN.theme[index];
        const data = DESIGN.data[index];
        const target = document.getElementById(theme + suffixDropdownTaglist);
        let id = 0;
        
        data.forEach(element => {
            const clone = document.importNode(tplSearchDropdownTagList.content, true);
            const attrBackground = DESIGN.bg + theme;
            const insert = clone.querySelector('span');
            insert.insertAdjacentText('beforeend', element);
            insert.setAttribute('data-background', attrBackground);
            insert.setAttribute('data-id', `${id}`);
            target.appendChild(clone);
            id++;
        });
        addListenerList(target);
    }
}

function addListenerList(parent){
    const list = parent.querySelectorAll('span');
    for (const item of list) {
        item.addEventListener('click', () => insertTag(item));
        item.addEventListener('keydown', (event) => {
            if(event.key === 'Enter') {
                insertTag(item);
            }
        });
    }
}

function insertTag(element){
    const theme = element.parentNode.getAttribute('data-theme');
    const backgroundClass = DESIGN.tbg + theme;
    const target = document.getElementById('tag-bank');
    const clone = document.importNode(tplInsertTagBank.content, true);
    const label = element.textContent;
    const insert = clone.querySelector('.badge');
    insert.classList.add(backgroundClass);
    insert.insertAdjacentText('afterbegin', label);
    target.appendChild(clone);
    controlTag();
}

function controlTag(){
    const tagBankContent = tagBank.getElementsByClassName('badge');
    const lastTag = tagBankContent.length - 1;
    const lastTagAdded = tagBankContent.item(lastTag);
    const closeLastTag = lastTagAdded.querySelector('.bi-x-circle');
    closeLastTag.addEventListener('click', () => lastTagAdded.remove());
    closeLastTag.addEventListener('keydown', (event) => {
        if(event.key === 'Enter'){
            lastTagAdded.remove();
        }
    })
}

function controlDropdownTagList(){
    for (const item of tagSearch) {
        const tagList = item.querySelector('.tag-group');
        const tagInput = item.querySelector('input');
        const labelInput = item.querySelector('label');
        item.addEventListener('focusin', () => openDropdownTagList(item, tagList, tagInput, labelInput));
        item.addEventListener('focusout', () => closeDropdownTagList(item, tagList, tagInput, labelInput));
        item.addEventListener('keydown', (event) => escapeDropdownTagList(event, item));
        tagInput.addEventListener('keydown', (event) => escapeDropdownTagList(event, item));
        tagList.addEventListener('keydown', (event) => escapeDropdownTagList(event, item));
        labelInput.addEventListener('click', (event) => escapeDropdownTagList(event, item));
    }
}

function openDropdownTagList(tag, list, input, label){
    list.classList.remove('visually-hidden-focusable');
    input.value = "";
    label.classList.toggle('rotate-caret');
    tag.setAttribute('aria-expanded', 'true')
}

function closeDropdownTagList(tag, list, input, label){
    list.classList.add('visually-hidden-focusable');
    input.value = input.defaultValue;
    label.classList.toggle('rotate-caret');
    tag.setAttribute('aria-expanded', 'false')
}

function escapeDropdownTagList(event, item){
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
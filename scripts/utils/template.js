// COMMENT: fonctions utilitaires pour les classes

// envoie un custom Event à une collection d'éléments
function eventAtAll(arr, event, max = arr.length, paramArr, id = 0) {
    if(id < max) {
        (paramArr === undefined)? arr[id].dispatchEvent(event) : arr[paramArr[id]].dispatchEvent(event)
        eventAtAll(arr, event, max, paramArr, ++id);
    }
}

// clonage d'un template html
function templateClone(template, element) {
    const clone = document.importNode(template.content, true);
    return [{ clone: clone }, { custom: clone.querySelector(element) }]
}


export { eventAtAll, templateClone }
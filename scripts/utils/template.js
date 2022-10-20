// NOTE: deuxième version de l'agorithme de recherche

// COMMENT: fonctions utilitaires pour les classes

// envoie un custom Event à une collection d'éléments
function eventAtAll(arr, event, id) {
    id === undefined
        ? arr.forEach(item => item.dispatchEvent(event))
        : id.forEach(item => arr[item].dispatchEvent(event));
}


// clonage d'un template html
function templateClone(template, element) {
    const clone = document.importNode(template.content, true);
    return [{ clone: clone }, { custom: clone.querySelector(element) }]
}


export { eventAtAll, templateClone }
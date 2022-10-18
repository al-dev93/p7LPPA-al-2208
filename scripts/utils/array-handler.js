// NOTE: deuxième version de l'agorithme de recherche

/*  COMMENT: fonctions utilisées pour la manipulation de tableaux              
//  utilisent des fonctions récursives, des boucles for ou des boucles while */

// teste si une valeur est présente dans un tableau
function inArray(arr, value) {
    return arr.includes(value);
}

// ajoute une valeur dans un tableau sans doublon
function addInArray(arr, value) {
    if(arr.includes(value)) {
        return;
    }
    if(!arr.length) {
        arr.push(value);
        return;
    }
    arr.every((item, index, array) => {
        if(value < item) {
            array.splice(index, 0, value);
        } else if(value > item && index === array.length-1) {
            array.push(value);
            return value < item;
        }
        return value > item;
    });
}

// retire une valeur d'un tableau
function removeInArray(arr, value) {
    const index = arr.indexOf(value);
    if(index === -1 || !arr.length) {
        return;
    }
    arr.splice(index, 1);
}

// réalise l'intersection de deux tableaux
function junctionArray(arr1, arr2) {
    return arr1.filter(item => arr2.includes(item));
}

// réalise la soustraction de deux tableaux
function substractArray(arr1, arr2) {
    return arr1
    .filter(item => !arr2.includes(item))
    .concat(arr2.filter(item => !arr1.includes(item)));
}

// teste si un tag, dont la clé passée en paramètre, est présent dans la banque des tags
function inActiveTags(arr, id) {
    return arr.flat().includes(id);
}

// retourne le tag dont la clé est transmise en paramètre, false si le tag n'est pas en banque
function getItemInActiveTags(arr, id) {
    return arr.filter(item => item[0] === id).flat();
}

// retire le tag, dont la clé est transmise, de la banque et retourne sa valeur 
function removeInActiveTags(arr, id) {
    arr.every((item, index) => {
        if(item[0] !== id) {
            return item[0] !== id;
        } else {
            arr.splice(index, 1);
        }
    });
}

/*  COMMENT: réalise l'intersection des listes de recettes contenues dans les tags //
//  pour l'ensemble des tags en banque                                             */
function junctionListOfArray(arrays) {
    return arrays
        .flatMap(item => [item[1]])
        .reduce((prevItem, currItem, index) => index === 0 ? currItem : junctionArray(prevItem, currItem),[]);  
}


export { addInArray, getItemInActiveTags, inActiveTags, inArray, junctionArray, junctionListOfArray, 
        removeInActiveTags, removeInArray, substractArray }
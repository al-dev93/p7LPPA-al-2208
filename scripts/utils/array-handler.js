/*  COMMENT: fonctions utilisées pour la manipulation de tableaux              
//  utilisent des fonctions récursives, des boucles for ou des boucles while */

// teste si une valeur est présente dans un tableau
function inArray(arr, value) {
    for(const item of arr) {
        if(item === value) {
            return true;
        }
    }
    return false;
}

// ajoute une valeur dans un tableau sans doublon
function addInArray(arr, value, added = []) {
    let isAdded = false, isIn = false;
    if(!arr.length) { 
        added[added.length] = value; 
    }
    // parcourt chaque élément du tableau
    for(const item in arr) {
        if(arr[+item] <= value) {
            added[+item]       = arr[+item];
            if(arr[+item] == value) { 
                ++isIn; 
            }
            if(+item == arr.length-1 && !isIn) { 
                added[+item+1] = value; 
            }
        } else if(arr[+item] > value && !isAdded && !isIn) {
            added[+item]       = value;
            added[+item+1]     = arr[+item]
            ++isAdded;
        } else if(arr[+item] > value && isAdded && !isIn) {
            added[+item+1]     = arr[+item]
        } else if(arr[+item] > value && !isAdded && isIn) {
            added[+item]       = arr[+item];
        }
    }
    return added;
}

// retire une valeur d'un tableau
function removeInArray(arr, value, removed = []) {
    let isRemoved = false;
    for(const item in arr) {
        if(arr[+item] < value) {
            removed[+item] = arr[+item];
        } else if(arr[+item] === value) {
            ++isRemoved;
        } else if(arr[+item] > value) {
            (isRemoved)? removed[+item-1] = arr[+item] : removed[+item] = arr[+item];
        }
    }
    return removed;
}

// fusionne deux tableaux sans doublons
function mergeArray(arr1, arr2, id1=0, id2=0, arr=[]) {
    if(id1 < arr1.length && id2 < arr2.length && arr1[id1] == arr2[id2]) {
        arr[arr.length] = arr1[id1];
        mergeArray(arr1, arr2, ++id1, ++id2, arr);
    } else if(id1 < arr1.length && (id2 == arr2.length || arr1[id1] < arr2[id2])) {
        arr[arr.length] = arr1[id1];
        mergeArray(arr1, arr2, ++id1, id2, arr);
    } else if(id2 < arr2.length && (id1 == arr1.length || arr2[id2] < arr1[id1])) {
        arr[arr.length] = arr2[id2];
        mergeArray(arr1, arr2, id1, ++id2, arr);
    }
    return arr;
}

// réalise l'intersection de deux tableaux
function junctionArray(arr1, arr2, id1=0, id2=0, arr=[]) {
    if(id1 < arr1.length && id2 < arr2.length) {
        if(arr1[id1] < arr2[id2]) {
            junctionArray(arr1, arr2, ++id1, id2, arr);
        } else if (arr1[id1] > arr2[id2]) {
            junctionArray(arr1, arr2, id1, ++id2, arr);
        } else if(arr1[id1] == arr2[id2]){
            arr[arr.length] = arr2[id2];
            junctionArray(arr1, arr2, ++id1, ++id2, arr);
        } 
    } else if (id1 == arr1.length-1 && id2 < arr2.length) {
        junctionArray(arr1, arr2, 0, id2, arr);
    }
    return arr;
}

// réalise la soustraction de deux tableaux
function substractArray(arr1, arr2, arr=[]) {
    const duplicate    = junctionArray(arr1, arr2);
    const noDuplicate1 = extractDuplicate(arr1, duplicate);
    const noDuplicate2 = extractDuplicate(arr2, duplicate);
    arr = mergeArray(noDuplicate1, noDuplicate2);
    return arr;
}

// extrait les doublons d'un tableau
function extractDuplicate(arr1, arr2, id1 = 0, id2 = 0, arr = []) {
    if(id1 < arr1.length && id2 <= arr2.length) {
        if(arr1[id1] == arr2[id2]) {
            extractDuplicate(arr1, arr2, ++id1, ++id2, arr);
        } else {
            arr[arr.length] = arr1[id1];
            extractDuplicate(arr1, arr2, ++id1, id2, arr);
        }
    }
    return arr;
}

// teste si un tag, dont la clé passée en paramètre, est présent dans la banque des tags
function inActiveTags(arr, id) {
    for(const item in arr) {
        if(arr[+item][0] === id) {
            return true;
        }
    }
    return false;
}

// retourne le tag dont la clé est transmise en paramètre, false si le tag n'est pas en banque
function getItemInActiveTags(arr, id) {
    for(const item in arr) {
        if(arr[+item][0] === id) {
            return arr[+item];
        }
    }
    return false;
}

// retire le tag, dont la clé est transmise, de la banque et retourne sa valeur 
function removeInActiveTags(arr, id, removed = []) {
    for(const item in arr) {
        if(arr[+item][0] !== id) {
            removed[removed.length] = arr[+item];
        }
    }
    return removed;
}

/*  COMMENT: réalise l'intersection des listes de recettes contenues dans les tags //
//  pour l'ensemble des tags en banque                                             */
function junctionListOfArray(arrays) {
    let id = 0, junction = [];
    for(const arr of arrays) {
        junction = (!id)? arr[1] : junctionArray(junction, arr[1]);
        ++id;
    }
    return junction;
}


export { addInArray, getItemInActiveTags, inActiveTags, inArray, junctionArray, junctionListOfArray, 
        removeInActiveTags, removeInArray, substractArray }
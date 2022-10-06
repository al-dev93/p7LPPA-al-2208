
//! //TODO commenter la méthode
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

//! //TODO commenter la méthode
function mergeListOfArray(arrays) {
    let id = 0, merge = [];
    for(const arr of arrays) {
        merge = (!id)? arr[1] : mergeArray(merge, arr[1]);
        ++id;
    }
    return merge;
}

//! //TODO commenter la méthode
function inActiveTags(arr, id) {
    for(const item in arr) {
        if(arr[+item][0] === id) {
            return true;
        }
    }
    return false;
}

//! //TODO commenter la méthode
function getItemInActiveTags(arr, id) {
    for(const item in arr) {
        if(arr[+item][0] === id) {
            return arr[+item];
        }
    }
    return false;
}

//! //TODO commenter la méthode
function removeInActiveTags(arr, id, removed = []) {
    for(const item in arr) {
        if(arr[+item][0] !== id) {
            removed[removed.length] = arr[+item];
        }
    }
    return removed;
}

// function isEqualItem(arr, thisArr, id = 0) {
//     while(id < thisArr.length) {
//         if(arr[id] === thisArr[id]) {
//             ++id;
//         } else break;
//     }
//     return (id === thisArr.length)
// }
// function removeInListOfArray(arrays, pullarr, remove = []) {
//     for(const arr of arrays) {
//         if(arr.length !== pullarr.length || !isEqualItem(arr, pullarr)) {
//             remove[remove.length] = arr;
//         }
//     }
//     return remove;
// }
// function inListOfArray(arrays, thisArr) {
//     for(const arr of arrays) {
//         if(arr.length === thisArr.length && isEqualItem(arr, thisArr)) {
//             return true;
//         }
//     }
//     return false;
// }
// function idInListOfArray(arrays, id) {
//     for(const item in arrays) {
//         if(+item === id) {
//             return true;
//         }
//     }
//     return false;
// }
// function removeIdInListOfArray(arrays, id, removed = []) {
//     for(const item in arrays) {
//         if(+item !== id) {
//             removed[removed.length] = arrays[item];
//         }
//     }
//     return removed;
// }
                        
//! //TODO commenter la méthode
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

function junctionListOffArray(arrays) {
    let id = 0, junction = [];
    for(const arr of arrays) {
        junction = (!id)? arr[1] : junctionArray(junction, arr[1]);
        ++id;
    }
    return junction;
}

//! //TODO commenter la méthode
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

//! //TODO commenter la méthode
function substractArray(arr1, arr2, arr=[]) {
    const duplicate = junctionArray(arr1, arr2);
    const noDuplicate1 = extractDuplicate(arr1, duplicate);
    const noDuplicate2 = extractDuplicate(arr2, duplicate);
    arr = mergeArray(noDuplicate1, noDuplicate2);
    return arr;
}

//! //TODO commenter la méthode
function inArray(arr, value) {
    for(const item of arr) {
        if(item === value) {
            return true;
        }
    }
    return false;
}


function addInArray(arr, value, added = []) {
    
    let isAdded = false, isIn = false;
    
    if(!arr.length) { 
        added[added.length] = value; 
    }

    for(const item in arr) {
        if(arr[+item] <= value) {
            added[+item] = arr[+item];
            if(arr[+item] == value) { 
                ++isIn; 
            }
            if(+item == arr.length-1 && !isIn) { 
                added[+item+1] = value; 
            }
        } else if(arr[+item] > value && !isAdded && !isIn) {
            added[+item] = value;
            added[+item+1] = arr[+item]
            ++isAdded;
        } else if(arr[+item] > value && isAdded && !isIn) {
            added[+item+1] = arr[+item]
        } else if(arr[+item] > value && !isAdded && isIn) {
            added[+item] = arr[+item];
        }
    }
    return added;
}


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

function onoffArray(arrMaster, arrSlave, value) {
    const master = inArray(arrMaster, value);
    const slave = inArray(arrSlave, value);
    const on = addInArray(arrMaster, value);
    const off = removeInArray(arrSlave, value);
    switch (true) {
        case !master && !slave:
            arrMaster = on;
            break;
        case !master && slave:
            arrMaster = on;
            arrSlave  = off;
            break;
        case master && slave:
            arrSlave  = off;
            break;
    }
    return {master: arrMaster, slave: arrSlave};
}



export { addInArray, getItemInActiveTags, inActiveTags, inArray, junctionArray, junctionListOffArray, mergeArray, mergeListOfArray, 
        onoffArray,removeInActiveTags, removeInArray, substractArray }
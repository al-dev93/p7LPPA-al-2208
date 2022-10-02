
//! //TODO commenter la méthode
function mergeArray(arr1, arr2, id1=0, id2=0, arr=[]) {
    if(id1 < arr1.length && id2 < arr2.length && arr1[id1] == arr2[id2]) {
        arr[arr.length] = arr1[id1];
        mergeArray(arr1, arr2, ++id1, ++id2, arr)
    } else if(id1 < arr1.length && (id2 == arr2.length || arr1[id1] < arr2[id2])) {
        arr[arr.length] = arr1[id1];
        mergeArray(arr1, arr2, ++id1, id2, arr)
    } else if(id2 < arr2.length && (id1 == arr1.length || arr2[id2] < arr1[id1])) {
        arr[arr.length] = arr2[id2];
        mergeArray(arr1, arr2, id1, ++id2, arr)
    }
    return arr;
}

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

function eventAtAll(arr, event, max = arr.length, paramArr, id = 0) {
    if(id < max) {
        (paramArr === undefined)? arr[id].dispatchEvent(event) : arr[paramArr[id]].dispatchEvent(event)
        eventAtAll(arr, event, max, paramArr, ++id);
    }
}

export { mergeArray, junctionArray, substractArray, eventAtAll}
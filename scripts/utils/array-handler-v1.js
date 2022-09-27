
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

export { mergeArray, junctionArray}
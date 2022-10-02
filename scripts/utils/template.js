

function eventAtAll(arr, event, max = arr.length, paramArr, id = 0) {
    if(id < max) {
        (paramArr === undefined)? arr[id].dispatchEvent(event) : arr[paramArr[id]].dispatchEvent(event)
        eventAtAll(arr, event, max, paramArr, ++id);
    }
}

function templateClone(template, element) {
    const clone = document.importNode(template.content, true);
    // const target = clone.querySelector(element);
    return [{ clone: clone }, { custom: clone.querySelector(element) }]
}


export { eventAtAll, templateClone }
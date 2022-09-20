//COMMENT: fonctions testant le type des données traitées par le module data-handle

// teste si une value: valeur simple de type number, string, boolean
function isValue(value) {
    return (typeof value !== 'object' && typeof value !== "undefined");
}
// teste si une liste de value: array de value
function isValueList(value) {
    return (value.length !== undefined && typeof value !== 'string' && typeof value[0] !== 'object' && typeof value !== "undefined");
}
// teste si un node: noeud simple qui est un objet mais pas un array
function isNode(value) {
    return(typeof value === 'object' && value.length === undefined);
}
// teste si une liste de node: array de node
function isNodeList(value) {
    return(value.length !== undefined && typeof value === 'object' && value[0].length === undefined);
}

export { isValue, isValueList, isNode, isNodeList }
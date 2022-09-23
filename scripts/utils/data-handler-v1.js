import { isValue, isValueList, isNode, isNodeList } from "../../scripts/utils/typeof-data.js";
import { pushRecipe } from "../api/api.js";


//! //TODO: donner un commentaire général


//! //TODO commenter la fonction
function getNode(path, getValue, recipes, currentPath, idNode, key, record, stack=[], idPath = 0) {
    //! //TODO commenter node
    const node = (!idPath && idNode === undefined)? path[idPath] : currentPath;
    switch (true) {
        case isValue(node):
            getValue(stack, node, key, idPath, path, idNode, recipes, record);
            break;
        case isValueList(node):
            foreachValue(stack, node, key, getValue, idPath, path, recipes, record);
            break;
        case isNode(node): {
            const nextPath = (idNode >= 0)? node[path[++idPath]] : node;
            if(idNode !== undefined && idPath === 1){
                key = currentPath.id  //COMMENT: récupère la clé de la recette
            }
            getNode(path, getValue, recipes, nextPath, idNode, key, record, stack, idPath);
            break;
        }
        case isNodeList(node):
            foreachNode(path, node, idPath, key, stack, getValue, recipes, record);
            break;
        default:
    }
    if (getValue == pushRecipe && recipes !== undefined){
        return recipes;
    }
    return stack;
}

// Appelle getValue pour chaque valeur
function foreachValue(stack, list, key, getValue, property, path, recipes, record, idValue = 0) {
    if (idValue < list.length) {
        getValue(stack, list[idValue], key, property, path, idValue, recipes, record);
        foreachValue(stack, list, key, getValue, property, path, recipes, record, ++idValue);
    }
}

// Appelle getNode pour chaque noeud
function foreachNode(path, list, idPath, key, stack, getValue, recipes, record, idNode = 0) {
    if(idNode < list.length) {
        const idRecord = (!idPath)? idNode : record;
        getNode(path, getValue, recipes, list[idNode], idNode, key, idRecord, stack, idPath);
        foreachNode(path, list, idPath, key, stack, getValue, recipes, idRecord, ++idNode);
    }
}

export { getNode }
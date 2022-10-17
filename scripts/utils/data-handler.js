import { isValue, isValueList, isNode, isNodeList } from "./typeof-data.js";
import { pushRecipe }                               from "../api/api.js";


// COMMENT: extrait les données présentes dans un tableau d'objets selon le chemin indiqué dans path

function getNode(path, getValue, recipes, currentPath, idNode, key, record, stack=[], idPath = 0) {
    // pointe les données pour chaque membre du chemin
    const node = (!idPath && idNode === undefined)? path[idPath] : currentPath;
    switch (true) {
        case isValue(node):
            // retourne une valeur
            getValue     (stack, node, key, record, idPath, path, idNode, recipes);
            break;
        case isValueList(node):
            // retourne une collection de valeurs
            foreachValue (stack, node, key, getValue, idPath, path, recipes, record);
            break;
        case isNode(node): {
            // membre suivant du chemin (path) à traiter
            const nextPath = (idNode >= 0)? node[path[++idPath]] : node;
            if(idNode !== undefined && idPath === 1){
                key = currentPath.id  // récupère la clé de la recette
            }
            // positionne sur le noeud suivant (appel récursif)
            getNode      (path, getValue, recipes, nextPath, idNode, key, record, stack, idPath);
            break;
        }
        case isNodeList(node):
            // traite une collection de noeuds
            foreachNode  (path, node, idPath, key, stack, getValue, recipes, record);
            break;
        default:
    }
    // sortie pour la récupération des recettes
    if (getValue == pushRecipe && recipes !== undefined){
        return recipes;
    }
    // sortie pour la liste des tags
    return stack;
}

// Appel récursif de getValue pour chaque valeur
function foreachValue(stack, list, key, getValue, property, path, recipes, record, idValue = 0) {
    if (idValue < list.length) {
        getValue     (stack, list[idValue], key, record, property, path, idValue, recipes);
        foreachValue (stack, list, key, getValue, property, path, recipes, record, ++idValue);
    }
}

// Appel récursif de getNode pour chaque noeud
function foreachNode(path, list, idPath, key, stack, getValue, recipes, record, idNode = 0) {
    if(idNode < list.length) {
        const idRecord = (!idPath)? idNode : record;
        getNode     (path, getValue, recipes, list[idNode], idNode, key, idRecord, stack, idPath);
        foreachNode (path, list, idPath, key, stack, getValue, recipes, idRecord, ++idNode);
    }
}

export { getNode }
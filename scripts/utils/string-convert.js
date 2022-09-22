//! //TODO commentaire général 

// convertit le premier caractère en majuscule
function stringCapitalize(string) {
    return (string).charAt(0).toUpperCase()+string.substr(1);
}

/* convertit la chaine de caratère en majuscule 
   et remplace les caratères diacritiques */
function stringNormalize(string) {
    return (string).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
}

export { stringCapitalize, stringNormalize }
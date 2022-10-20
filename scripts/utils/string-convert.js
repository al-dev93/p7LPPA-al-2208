// NOTE: deuxième version de l'agorithme de recherche

// COMMENT: fonctions de manipulation de chaînes de caractères 

// convertit le premier caractère en majuscule
function stringCapitalize(string) {
    return (string).charAt(0).toUpperCase()+string.substr(1);
}

/* convertit la chaine de caratère en majuscule //
// et remplace les caratères diacritiques       */
function stringNormalize(string) {
    return (string).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
}

// retourne le symbole de l'unité
function unitSymbol(unit) {
    switch (true) {
        case unit === 'gramme' || unit === 'grammes':
            return 'g';
        case unit === 'litre' || unit === 'litres':
            return 'l';
    }
    return unit;
}

// extrait le premier mot d'une expression
function extractFirstWord(string){
    const index = string.indexOf(' ');
    if(index > -1) {
        return string.substring(0, index);
    }
    return string; 
}

// retourne le pluriel du mot
function pluralWord(word) {
    const str           = stringNormalize(word);
    const twoLastChar   = str.substring(str.length-2);
    const threeLastChar = str.substring(str.length-3);
    if(twoLastChar === 'AU' || (twoLastChar === 'EU' && str !== 'BLEU') || threeLastChar === 'EAU' || str === 'CHOU') {
        return word+'x';
    }
    if(twoLastChar === 'AL' ) {
            return word.substring(0, word.length-2)+'aux';
    }
    return word+'s';
}

// indique si une chaîne est présente dans une autre
function searchString(str1, str2) {
    return str1.includes(str2);
} 

// retourne le singulier du mot 
function singularWord(word) {
    const str = stringNormalize(word);
    const threeLastChar = str.substring(str.length-3);
    if(threeLastChar === 'AUX'&& (str === 'BAUX' || str === 'CORAUX' || str === 'EMAUX' || str === 'SOUPIRAUX' || str === 'TRAVAUX' || 
        str === 'VENTAUX' || str === 'VITRAUX')) {
        return word.substring(0, word.length-2)+'il'
    }
    return word.substring(0, word.length-1);
}

// applique le pluriel ou le singulier en fonction de la quantité
function agreementConvert(quantity, string) {
    const word     = extractFirstWord(string);
    const str      = stringNormalize(word);
    const lastChar = str[str.length-1];
    if(quantity > 1 && (lastChar === 'S' || lastChar === 'X')) {
        return word;
    } else if(quantity > 1) {
        return pluralWord(word);
    }
    if(quantity <= 1 && (lastChar === 'S' || lastChar === 'X')) {
        return singularWord(word)
    } else if(quantity <=1) {
        return word;
    }
}

export { stringCapitalize, stringNormalize, searchString, unitSymbol, agreementConvert }
const parse = window.HTMLReactParser;

function parseTranslationConfig(obj) {
    Object.keys(obj).forEach((key) => {
        const currentObj = obj[key];
        if (Array.isArray(currentObj)) {
            const newObj = currentObj.map((ele) => {
                if (typeof ele === 'object' && ele !== null) {
                    parseTranslationConfig(ele);
                    return ele;
                } else if (typeof ele === 'string') {
                    return parse(ele);
                } else {
                    throw `Unable to parse ${ele}`;
                }
            });
            obj[key] = newObj;
        } else if (typeof currentObj === 'object' && currentObj !== null) {
            parseTranslationConfig(currentObj);
        } else if (typeof currentObj === 'string') {
            obj[key] = parse(currentObj);
        } else {
            throw `Unable to parse ${currentObj}.`;
        }
    });
}

export { parseTranslationConfig };

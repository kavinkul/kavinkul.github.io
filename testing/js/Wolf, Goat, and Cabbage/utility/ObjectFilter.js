function tryObjectFilter(obj, predicate) {
    const test = Object.keys(obj)
        .filter((key) => predicate(obj[key]))
        .reduce((res, key) => ((res[key] = obj[key]), res), {});
    return test;
}

export default tryObjectFilter;

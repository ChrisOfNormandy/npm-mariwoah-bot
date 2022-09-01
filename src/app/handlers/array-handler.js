/**
 *
 * @param {Array} array
 * @param {number} size
 * @returns
 */
function divideArray(array, size) {
    if (array.length < 2 || array.length <= size)
        return array;

    let toReturn = [];

    let i = 0;
    while (i < array.length) {
        if (i + size < array.length)
            toReturn.push(array.slice(i, i + size));
        else
            toReturn.push(array.slice(i));

        i += size;
    }

    return toReturn;
}

/**
 *
 * @param {Array} array
 * @returns
 */
function shuffle(array) {
    if (array.length < 2)
        return array;

    let j;
    const arr = array;

    for (let i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

/**
 *
 * @param {Map<*, *>} map
 * @returns {Object.<string, *>}
 */
function mapToJson(map) {
    let obj = {};
    for (let [key, val] of map)
        obj[key] = val;

    return obj;
}

module.exports = {
    divideArray,
    shuffle,
    mapToJson
};

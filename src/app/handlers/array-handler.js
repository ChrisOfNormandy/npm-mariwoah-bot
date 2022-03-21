function divideArray(array, size) {
    if (!array.length)
        return Promise.reject(array);

    if (array.length <= size)
        return Promise.resolve([array]);

    return new Promise((resolve) => {
        let arraySize = Math.ceil(array.length / size);
        let toReturn = new Array(arraySize);

        for (let i = 0; i < arraySize; i++) {
            if (i < arraySize - 1)
                toReturn[i] = new Array(size);
            else
                toReturn[i] = new Array(array.length % size);

            for (let k = size * i; k < size * (i + 1); k++) {
                if (array[k])
                    toReturn[i][k - size * i] = array[k];
            }
        }

        resolve(toReturn);
    });
}

/**
 * 
 * @param {*[]} array 
 * @returns {*[]}
 */
function shuffle(array) {
    if (!array.length)
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
 * @param {*[]} array 
 * @returns {Promise<*[]>}
 */
function shuffleAsync(array) {
    if (!array.length)
        return Promise.reject(array);

    return new Promise((resolve) => {
        let j;
        const arr = array;

        for (let i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        resolve(arr);
    });
}

/**
 * 
 * @param {Map<*, *>} map 
 * @returns {object}
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
    shuffleAsync,
    mapToJson
};

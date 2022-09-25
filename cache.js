function Coin(obj) {
    for (let prop in obj) {
        this[prop] = obj[prop];
    }
    this[`fetchTimestamp`] = new Date();
}


const CACHE = {};
function getMoreInfo(id,data) {
    if (CACHE[id])
        return CACHE[id];
    CACHE[id] = new Coin(data);
    return CACHE[id];
}
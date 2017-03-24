var setMarkerId = function (data) {
    let markerArr = [];
    for (let item of data) {
        markerArr[item.id] = item;
    }
    return markerArr;
}

module.exports = setMarkerId;
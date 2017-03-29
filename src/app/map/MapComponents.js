var map = require('./SetMap');
var markerTmpl = require('./_marker_common.jade');

var showMarkers = require('./ShowMarkers');
var infoWind = showMarkers.infoWind;
var markerListCurrent = showMarkers.markerListCurrent;

var Emitter = require('../index');
var emitter = new Emitter;

//generate mark time
var setIdTime = function () {
    return moment().valueOf()
};

AddMarker = function () {
    this.setMarker = function (position, name, type, review, comfort, square, service) {
        var marker = new google.maps.Marker({
            // random ending to avoid replacing the same mark time id
            id: setIdTime() + Math.floor(Math.random() * 128)
            , position: position
            , lat: position.lat
            , lng: position.lng
            , title: name
            , nameInfo: name
            , typeInfo: type
            , comfortableInfo: comfort
            , squareInfo: square
            , serviceInfo: service
            , reviewInfo: review
        });
        var createInfoWind = function () {
            marker.addListener('click', function () {
                infoWind.setContent(markerTmpl({
                    name: this.nameInfo
                    , type: this.typeInfo
                    , field: {
                        comfortable: this.comfortableInfo
                        , square: this.squareInfo
                        , service: this.serviceInfo
                        , review: this.reviewInfo
                    }
                }));
                infoWind.open(map, this);
            });
        };
        createInfoWind();
        marker.setMap(map);
        markerListCurrent[marker.id] = marker;

        return markerListCurrent;
    };

    this.setMarkerClick = function (name, type, review, comfort, square, service) {
        map.addListener('click', function (e) {
            var marker = new google.maps.Marker({
                id: setIdTime() + Math.floor(Math.random() * 128)
                , position: e.latLng
                , lat: e.latLng.lat()
                , lng: e.latLng.lng()
                , title: name
                , nameInfo: name
                , typeInfo: type
                , comfortableInfo: comfort
                , squareInfo: square
                , serviceInfo: service
                , reviewInfo: review
            });
            var createInfoWind = function () {
                marker.addListener('click', function() {
                    infoWind.setContent(markerTmpl({
                        name: this.nameInfo
                        , type: this.typeInfo
                        , field: {
                            comfortable: this.comfortableInfo
                            , square: this.squareInfo
                            , service: this.serviceInfo
                            , review: this.reviewInfo
                        }
                    }));
                    infoWind.open(map, this);
                });
            };
            createInfoWind();
            marker.setMap(map);
            markerListCurrent[marker.id] = marker;
        });
        console.log(markerListCurrent);
        return markerListCurrent;
    }
}
var markerAdded = new AddMarker();
emitter.on('addMarker', markerAdded.setMarker);
emitter.on('addMarkerClick', markerAdded.setMarkerClick);

var deleteMarker = function (propName, propVal) {
    for (var item in markerListCurrent) {
        if (markerListCurrent[item][propName] == propVal) {
            markerListCurrent[item].setMap(null);
            delete markerListCurrent[item];
        }
    }
    return markerListCurrent;
};
emitter.on('deleteMarker', deleteMarker);

var changeMarker = function (propName, propVal, markerArr, propNameChange, propValNew, idNew) {
    if (propNameChange === undefined) propNameChange = propName;
    for (var item in markerArr) {
        var elem = markerArr[item];
        if (elem[propName] == propVal) {
            if (idNew !== undefined) elem.id = setIdTime() + '_' + Math.floor(Math.random() * 128);
            elem[propNameChange] = propValNew;
            markerArr[elem.id] = elem;
        }
    }
    return markerArr;
};
//create marker for DB
var getMarkerToDb = function (markerArr) {
    var markerArrTemp = [];
    for (var item in markerArr) {
        if (markerArr.hasOwnProperty(item)) {
            var elem = markerArr[item];
            var markerToDb = {
                id: elem.id
                , position: {lat: elem.lat, lng: elem.lng}
                , title: elem.nameInfo
                , name: elem.nameInfo
                , type: elem.typeInfo
                , field: {
                    comfortable: elem.comfortableInfo
                    , square: elem.squareInfo
                    , service: elem.serviceInfo
                    , review: elem.reviewInfo
                }
            };
            markerArrTemp[markerToDb.id] = markerToDb;
        }
    }
    return markerArrTemp
}

markerListCurrent.__proto__.changeMarker = changeMarker;
markerListCurrent.__proto__.getMarkerToDb = getMarkerToDb;

var res = Promise.resolve(markerListCurrent);
res
    .then(function (markerListCurrent) {
        emitter.emit('addMarker', {lat: 50.446246, lng: 30.520878}, 'The Little pony', 'Cafe', 'Amazing', '5', '42', '5');
        emitter.emit('addMarker', {lat: 50.444534, lng: 30.516146}, 'Entertainment', 'Playground', 'Not bad', '4', '64', '2');
        emitter.emit('addMarkerClick', 'Parents&kids', 'Playground', 'Cool', '5', '52', '4');
        console.log(markerListCurrent);
        return Promise.resolve(markerListCurrent)
    })
    //     .then(function (markerListCurrent) {
    //         emitter.emit('deleteMarker', 'title', 'Snacks', markerListCurrent)
    //         console.log(markerListCurrent)
    //         return Promise.resolve(markerListCurrent);
    //     })
    // .then(function (markerListCurrent) {
    //     markerListCurrent.changeMarker('typeInfo', 'Pizzeria', markerListCurrent, undefined, 'Pizza Bar', null);
    //     console.log(markerListCurrent);
    //     return Promise.resolve(markerListCurrent);
    // })
    // .then(function(markerListCurrent){
    //     var resArrToDb = markerListCurrent.getMarkerToDb(markerListCurrent);
    //     console.log(resArrToDb);
    //     return Promise.resolve(markerListCurrent);
    // })
    .then(function (markerListCurrent) {
        emitter.emit('addMarker', { lat: 50.447458, lng: 30.525717}, 'Varenik`s', 'Restaurant', 'Excellent', '5', '67', '5');
        console.log(markerListCurrent)
        return Promise.resolve(markerListCurrent)
    })
    .then(function (markerListCurrent) {
        emitter.emit('deleteMarker', 'title', 'The Little pony');
        // emitter.emit('deleteMarker', 'comfortableInfo', 5, markerListCurrent);
        console.log(markerListCurrent)
        return Promise.resolve(markerListCurrent);
    })
    // .then(function(markerListCurrent){
    //     var resultToDb = markerListCurrent.getMarkerToDb(markerListCurrent);
    //     console.log(resultToDb)
    //     return Promise.resolve(markerListCurrent);
    // })
    .then(function (markerListCurrent) {
        emitter.emit('addMarker', {lat: 50.446201, lng: 30.520288}, 'Kids', 'Kids area', 'Rather poorly', '2', '30', '3');
        // emitter.emit('addMarkerClick', undefined, 'Parents&kids', 'Playground', 'Cool', '5', '52', '4');
        console.log(markerListCurrent)
        return Promise.resolve(markerListCurrent)
    })
.then(function (markerListCurrent) {
   emitter.emit('deleteMarker','title', 'Porter pub', markerListCurrent);
    console.log(markerListCurrent)
    return Promise.resolve(markerListCurrent);
})
// .then(function(markerListCurrent){
//     var resultToDb = markerListCurrent.getMarkerToDb(markerListCurrent);
//     console.log(resultToDb)
// })

module.exports.AddMarker = AddMarker;
module.exports.changeMarker = changeMarker;
module.exports.deleteMarker = deleteMarker;
//
//     return markerArr;
// };
// emitter.on('deleteMarker', deleteMarker);
//
// var changeMarker = function (propName, propVal, markerArr, propNameChange, propValNew, idNew) {
//     if (propNameChange === undefined) propNameChange = propName;
//     for(var item in markerArr) {
//         var elem = markerArr[item];
//         if (elem[propName] == propVal) {
//             if(idNew !== undefined) elem.id = setIdTime() + '_' + Math.floor(Math.random() * 128);
//             elem[propNameChange] = propValNew;
//             markerArr[elem.id] = elem;
//         }
//     }
//     return markerArr;
// };
// //create marker for DB
// var getMarkerToDb = function (markerArr) {
//     var markerArrTemp = [];
//     for (var item in markerArr) {
//         if(markerArr.hasOwnProperty(item)) {
//             var elem = markerArr[item];
//             var markerToDb = {
//                 id: elem.id
//                 , position: {lat: elem.lat, lng: elem.lng}
//                 , title: elem.nameInfo
//                 , name: elem.nameInfo
//                 , type: elem.typeInfo
//                 , field: {
//                     comfortable: elem.comfortableInfo
//                     , square: elem.squareInfo
//                     , service: elem.serviceInfo
//                     , review: elem.reviewInfo
//                 }
//             };
//             markerArrTemp[markerToDb.id] = markerToDb;
//         }
//     }
//     return markerArrTemp
// }
//
//
// markerListCurrent.__proto__.changeMarker = changeMarker;
// markerListCurrent.__proto__.getMarkerToDb = getMarkerToDb;

// var res = Promise.resolve(data);
// res
//     .then(function(markerListCurrent){
//         emitter.emit('addMarker', {lat: 50.446246, lng: 30.520878}, 'The Little pony', 'Cafe', 'Amazing', '5', '42', '5');
//         emitter.emit('addMarker', {lat: 50.444534, lng: 30.516146}, 'Entertainment', 'Playground', 'Not bad', '4', '64', '2');
//         emitter.emit('addMarkerClick', undefined, 'Parents&kids', 'Playground', 'Cool', '5', '52', '4');
//         console.log(markerListCurrent)
//         return Promise.resolve(markerListCurrent)
//     })
//     .then(function (markerListCurrent) {
//         emitter.emit('deleteMarker', 'title', 'Snacks', markerListCurrent)
//         console.log(markerListCurrent)
//         return Promise.resolve(markerListCurrent);
//     })
//     .then(function (markerListCurrent) {
//         markerListCurrent.changeMarker('typeInfo', 'Pizzeria', markerListCurrent, undefined, 'Pizza Bar', null);
//         console.log(markerListCurrent);
//         return Promise.resolve(markerListCurrent);
//     })
//     .then(function(markerListCurrent){
//         var resArrToDb = markerListCurrent.getMarkerToDb(markerListCurrent);
//         console.log(resArrToDb);
//         return Promise.resolve(markerListCurrent);
//     })
//     .then(function(markerListCurrent){
//         emitter.emit('addMarker', {lat: 50.447458, lng: 30.525717}, 'Varenik`s', 'Restaurant', 'Excellent', '5', '67', '5');
//         console.log(markerListCurrent)
//         return Promise.resolve(markerListCurrent)
//     })
//     .then(function (markerListCurrent) {
//         emitter.emit('deleteMarker', 'title', 'The Little pony', markerListCurrent)
//         // emitter.emit('deleteMarker','title', 'Entertainment', markerListCurrent);
//         // emitter.emit('deleteMarker', 'comfortableInfo', 5, markerListCurrent);
//         console.log(markerListCurrent)
//         return Promise.resolve(markerListCurrent);
//     })
//     .then(function(markerListCurrent){
//         var resultToDb = markerListCurrent.getMarkerToDb(markerListCurrent);
//         console.log(resultToDb)
//         return Promise.resolve(markerListCurrent);
//     })
//     .then(function(markerListCurrent){
//         emitter.emit('addMarker', {lat: 50.446201, lng: 30.520288}, 'Kids', 'Kids area', 'Rather poorly', '2', '30', '3');
//         emitter.emit('addMarkerClick', undefined, 'Parents&kids', 'Playground', 'Cool', '5', '52', '4');
//         console.log(markerListCurrent)
//         return Promise.resolve(markerListCurrent)
//     })
//     .then(function (markerListCurrent) {
//         emitter.emit('deleteMarker', 'title', 'The best pizza', markerListCurrent)
//         emitter.emit('deleteMarker','title', 'Porter pub', markerListCurrent);
//         console.log(markerListCurrent)
//         return Promise.resolve(markerListCurrent);
//     })
//     .then(function(markerListCurrent){
//         var resultToDb = markerListCurrent.getMarkerToDb(markerListCurrent);
//         console.log(resultToDb)
//     })

// module.exports.AddMarker = AddMarker;
// module.exports.changeMarker = changeMarker;
// module.exports.deleteMarker = deleteMarker;

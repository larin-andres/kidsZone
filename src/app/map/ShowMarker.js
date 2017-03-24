
var map = require('./SetMap');
var setMarkerId = require('./setMarkerId');

var markerTmpl = require('./_marker_common.jade');

//create info wind in global
var infoWind = new google.maps.InfoWindow();

var Emitter = require('../index');
var emitter = new Emitter;

//generate mark time
var setIdTime = function () {
    return moment().valueOf()
};
var markerListCurrent = [];

//input data
var data = [{
    "id": 0
    , "position": {"lat": 50.4546600, "lng": 30.5238000}
    , "title": "The best pizza"
    , "name": "The best pizza"
    , "type": "Pizzeria"
    , "review": "Cool place"
    , "field": {
        "comfortable": 4
        , "square": 65
        , "service": 4
    }
}, {
    "id": 1
    , "position": {"lat": 50.450413, "lng": 30.535083}
    , "title": "Snacks"
    , "name": "Snacks"
    , "type": "Snack bar"
    , "review": "Not so good"
    , "field": {
        "comfortable": 2
        , "square": 30
        , "service": 3
    }
}, {
    "id": 2
    , "position": {"lat": 50.442092, "lng": 30.510364}
    , "title": "Porter pub"
    , "name": "Porter pub"
    , "type": "Pub"
    , "review": "Perfectly"
    , "field": {
        "comfortable": 5
        , "square": 45
        , "service": 5
    }
}];

var createMarker = function(position, name, type, review,comfort, square, service) {
    var marker = new google.maps.Marker({
        // random ending to avoid replacing the same mark time id
        id: setIdTime() + Math.floor(Math.random() * 128)
        , lat: position.lat
        , lng: position.lng
        , position: position
        , map: map
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
    markerListCurrent[marker.id] = marker;

    return markerListCurrent;
};

//set marker from input data
var showMarker = function(markerArrInput){
    markerArrInput.forEach(function (val){
        createMarker(val.position, val.name, val.type, val.review, val.field.comfortable, val.field.square, val.field.service);
    })
    return markerListCurrent;
}

AddMarker = function() {
    this.setMarker = function (position, name, type, review, comfort, square, service){
        createMarker(position, name, type, review, comfort, square, service);
        return markerListCurrent;
    };

    this.setMarkerClick = function (position, name, type, review,comfort, square, service) {
        map.addListener('click', function (e) {
            position = e.latLng;
            createMarker(position, name, type, review, comfort, square, service);
            // console.log(position.lat());
            console.log(markerListCurrent);
            return markerListCurrent;
        });
    }
}
var markerAdded = new AddMarker();
emitter.on('addMarker', markerAdded.setMarker);
emitter.on('addMarkerClick', markerAdded.setMarkerClick);

var deleteMarker = function (propName, propVal, markerArr) {
    for(var item in markerArr) {
        let elem = markerArr[item];
        if (elem[propName] == propVal) {
            markerArr[item].setMap(null);
            delete markerArr[item];
        }
    }

    return markerArr;
};
emitter.on('deleteMarker', deleteMarker);

var changeMarker = function (propName, propVal, markerArr, propNameChange, propValNew, idNew) {
    if (propNameChange === undefined) propNameChange = propName;
    for(var item in markerArr) {
        var elem = markerArr[item];
        if (elem[propName] == propVal) {
            if(idNew !== undefined) elem.id = setIdTime() + '_' + Math.floor(Math.random() * 128);
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
        if(markerArr.hasOwnProperty(item)) {
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

markerListCurrent.__proto__.showMarker = showMarker;
markerListCurrent.__proto__.changeMarker = changeMarker;
markerListCurrent.__proto__.getMarkerToDb = getMarkerToDb;

var res = Promise.resolve(data);
res
    .then(function(data){
        markerListCurrent.showMarker(data);
        console.log(markerListCurrent);
        return Promise.resolve(markerListCurrent)
    })
    .then(function(markerListCurrent){
        emitter.emit('addMarker', {lat: 50.446246, lng: 30.520878}, 'The Little pony', 'Cafe', 'Amazing', '5', '42', '5');
        emitter.emit('addMarker', {lat: 50.444534, lng: 30.516146}, 'Entertainment', 'Playground', 'Not bad', '4', '64', '2');
        emitter.emit('addMarkerClick', undefined, 'Parents&kids', 'Playground', 'Cool', '5', '52', '4');
        console.log(markerListCurrent)
        return Promise.resolve(markerListCurrent)
    })
    .then(function (markerListCurrent) {
        emitter.emit('deleteMarker', 'title', 'Snacks', markerListCurrent)
        console.log(markerListCurrent)
        return Promise.resolve(markerListCurrent);
    })
    .then(function (markerListCurrent) {
        markerListCurrent.changeMarker('typeInfo', 'Pizzeria', markerListCurrent, undefined, 'Pizza Bar', null);
        console.log(markerListCurrent);
        return Promise.resolve(markerListCurrent);
    })
    .then(function(markerListCurrent){
        var resArrToDb = markerListCurrent.getMarkerToDb(markerListCurrent);
        console.log(resArrToDb);
        return Promise.resolve(markerListCurrent);
    })
    .then(function(markerListCurrent){
        emitter.emit('addMarker', {lat: 50.447458, lng: 30.525717}, 'Varenik`s', 'Restaurant', 'Excellent', '5', '67', '5');
        console.log(markerListCurrent)
        return Promise.resolve(markerListCurrent)
    })
    .then(function (markerListCurrent) {
        emitter.emit('deleteMarker', 'title', 'The Little pony', markerListCurrent)
        // emitter.emit('deleteMarker','title', 'Entertainment', markerListCurrent);
        // emitter.emit('deleteMarker', 'comfortableInfo', 5, markerListCurrent);
        console.log(markerListCurrent)
        return Promise.resolve(markerListCurrent);
    })
    .then(function(markerListCurrent){
        var resultToDb = markerListCurrent.getMarkerToDb(markerListCurrent);
        console.log(resultToDb)
        return Promise.resolve(markerListCurrent);
    })
    .then(function(markerListCurrent){
        emitter.emit('addMarker', {lat: 50.446201, lng: 30.520288}, 'Kids', 'Kids area', 'Rather poorly', '2', '30', '3');
        emitter.emit('addMarkerClick', undefined, 'Parents&kids', 'Playground', 'Cool', '5', '52', '4');
        console.log(markerListCurrent)
        return Promise.resolve(markerListCurrent)
    })
    .then(function (markerListCurrent) {
        emitter.emit('deleteMarker', 'title', 'The best pizza', markerListCurrent)
        emitter.emit('deleteMarker','title', 'Porter pub', markerListCurrent);
        console.log(markerListCurrent)
        return Promise.resolve(markerListCurrent);
    })
    .then(function(markerListCurrent){
        var resultToDb = markerListCurrent.getMarkerToDb(markerListCurrent);
        console.log(resultToDb)
    })

module.exports.AddMarker = AddMarker;
module.exports.changeMarker = changeMarker;
module.exports.deleteMarker = deleteMarker;

var map = require('./SetMap');
var markerTmpl = require('./_marker_common.jade');
var setMarkerId = require('./setMarkerId');
//create info wind in global
var infoWind = new google.maps.InfoWindow();

var markerListCurrent = [];

//input data

//data0 for checking to avoid doubling the same markers
var data0 = [{
    "id": 1300616747200
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
    "id": 1300616747201
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
    "id": 1300616747202
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
var data = [{
    "id": 1300616747200
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
    "id": 1300616747201
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
    "id": 1300616747202
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

//set marker from input data
var showMarker = function (markerArrInput) {
    for(var i = 0; i < markerArrInput.length; i++) {
        var elem = markerArrInput[i];
        //avoid to double the same markers
        if (markerListCurrent[elem.id]) {
            // console.log(elem.id + ' ' + 'already exist');
            continue;
        }
        var marker = new google.maps.Marker({
            id: elem.id
            , lat: elem.position.lat
            , lng: elem.position.lng
            , position: elem.position
            , map: map
            , title: elem.name
            , nameInfo: elem.name
            , typeInfo: elem.type
            , comfortableInfo: elem.field.comfortable
            , squareInfo: elem.field.square
            , serviceInfo: elem.field.service
            , reviewInfo: elem.review
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
            markerListCurrent[marker.id] = marker;
    }
    return markerListCurrent;
}

markerListCurrent.__proto__.showMarker = showMarker;

var res = Promise.resolve(data0);
res
    .then(function (data0) {
        markerListCurrent.showMarker(data0);
        // console.log(markerListCurrent);
        return Promise.resolve(data)
    })
    .then(function (data) {
        markerListCurrent.showMarker(data);
        // console.log(markerListCurrent);
        return Promise.resolve(markerListCurrent)
    })

module.exports.markerListCurrent = markerListCurrent;
module.exports.infoWind = infoWind;
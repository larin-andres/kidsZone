var map = require('./SetMap');
var markerTmpl = require('./_marker_common.jade');

var infoWind = require('./ShowMarkers').infoWind;
var markerListCurrent = require('./ShowMarkers').markerListCurrent;

var emitter = require('./MapCtrl').emitter;

//generate mark time
var setIdTime = function () {
    return moment().valueOf()
};

AddMarker = function () {
    //take out marker to send to Db and receive from users
    var that = this;

    this.setMarker = function (position, name, type, review, comfort, square, service) {
        that.marker = new google.maps.Marker({
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
            that.marker.addListener('click', function () {
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
        that.marker.setMap(map);
        markerListCurrent[that.marker.id] = that.marker;

        return markerListCurrent;
    };

    this.setMarkerClick = function (name, type, review, comfort, square, service) {
        map.addListener('click', function (e) {
            marker = new google.maps.Marker({
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
            // console.log(markerListCurrent);
        })
    }

}
var markerAdded = new AddMarker();

var changeMarker = function (propName, propVal, propNameChange, propValNew, idNew) {
    if (propNameChange === undefined) propNameChange = propName;
    for (var item in markerListCurrent) {
        var elem = markerListCurrent[item];
        if (elem[propName] == propVal) {
            if (idNew !== undefined) {
                elem.id = setIdTime() + '_' + Math.floor(Math.random() * 128);
                delete markerListCurrent[item];
                markerListCurrent[elem.id] = elem;
            }
            elem[propNameChange] = propValNew;
        }
    }
    return markerListCurrent;
};

var deleteMarker = function (propName, propVal) {
    for (var item in markerListCurrent) {
        if (markerListCurrent[item][propName] == propVal) {
            markerListCurrent[item].setMap(null);
            delete markerListCurrent[item];
        }
    }
    return markerListCurrent;
};

//create marker for DB
var getMarkerToDb = function (marker) {
    var markerToDb = {
        id: marker.id
        , position: {lat: marker.lat, lng: marker.lng}
        , title: marker.nameInfo
        , name: marker.nameInfo
        , type: marker.typeInfo
        , field: {
            comfortable: marker.comfortableInfo
            , square: marker.squareInfo
            , service: marker.serviceInfo
            , review: marker.reviewInfo
        }
    };
    // console.log(markerToDb);
    return markerToDb
}

markerListCurrent.__proto__.markerAdded = markerAdded;
markerListCurrent.__proto__.changeMarker = changeMarker;
markerListCurrent.__proto__.deleteMarker = deleteMarker;


emitter.emit('addNewMarker');

var res = Promise.resolve(markerListCurrent);
res
    .then(function (markerListCurrent) {
        markerListCurrent.markerAdded.setMarker({lat: 50.446246, lng: 30.520878}, 'The Little pony', 'Cafe', 'Amazing', '5', '42', '5');
        var markerToDb = getMarkerToDb(markerListCurrent.markerAdded.marker);
        // console.log(markerToDb);
        // emitter.on('addMarker3', function(){
        //     console.log(markerToDb);
        // });
        markerListCurrent.markerAdded.setMarker({lat: 50.444534, lng: 30.516146}, 'Entertainment', 'Playground', 'Not bad', '4', '64', '2');
        console.log(markerListCurrent);
        return Promise.resolve(markerListCurrent)
    })
    .then(function(markerListCurrent){
        markerListCurrent.markerAdded.setMarkerClick('Parents&kids', 'Playground', 'Cool', '5', '52', '4')
        return Promise.resolve(markerListCurrent)
    })
    .then(function(markerListCurrent){
        console.log(markerListCurrent)
        return Promise.resolve(markerListCurrent)
    })
    // .then(function (markerListCurrent) {
    //     markerListCurrent.deleteMarker('title','Snacks')
    //     // console.log(markerListCurrent)
    //     return Promise.resolve(markerListCurrent);
    // })
    // .then(function (markerListCurrent) {
    //     markerListCurrent.changeMarker('typeInfo', 'Pizzeria', undefined, 'Pizza Bar', null);
    //     // console.log(markerListCurrent);
    //     return Promise.resolve(markerListCurrent);
    // })
    // .then(function (markerListCurrent) {
    //     markerListCurrent.changeMarker('typeInfo', 'Pizza Bar', 'reviewInfo', 'Extremely cool place', null);
    //     // console.log(markerListCurrent);
    //     return Promise.resolve(markerListCurrent);
    // })
    // // .then(function (markerListCurrent) {
    // //     markerListCurrent.markerAdded.setMarker({ lat: 50.447458, lng: 30.525717}, 'Varenik`s', 'Restaurant', 'Excellent', '5', '67', '5');
    // //     // console.log(markerListCurrent)
    // //     return Promise.resolve(markerListCurrent)
    // // })
    // .then(function (markerListCurrent) {
    //     markerListCurrent.markerAdded.setMarker({lat: 50.446201, lng: 30.520288}, 'Kids', 'Kids area', 'Rather poorly', '2', '30', '3');
    //     console.log(markerListCurrent);
    //     return Promise.resolve(markerListCurrent)
    // })

module.exports.markerAdded = markerAdded.setMarker;
module.exports.changeMarker = changeMarker;
module.exports.deleteMarker = deleteMarker;


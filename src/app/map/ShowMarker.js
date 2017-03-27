module.exports = function(){
    require('./style.scss');

    var latLng = new google.maps.LatLng({lat: 50.448853, lng: 30.513346});
    var mapOption = {
        zoom: 12
        , center: latLng
        , mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById('map'), mapOption);

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
        "id": 1200608270300
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
        "id": 1200608270301
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
        "id": 1200608270302
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

    var createMarker = function(id, position, name, type, review,comfort, square, service) {
        var marker = new google.maps.Marker({
            // random ending to avoid replacing the same mark time id
            id: id
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
            createMarker(val.id, val.position, val.name, val.type, val.review, val.field.comfortable, val.field.square, val.field.service);
        })
        return markerListCurrent;
    }
    markerListCurrent.__proto__.showMarker = showMarker;

    var res = Promise.resolve(data);
    res
        .then(function(data){
            markerListCurrent.showMarker(data);
            console.log(markerListCurrent);
            return Promise.resolve(markerListCurrent)

        })



}


// module.exports.AddMarker = AddMarker;
// module.exports.changeMarker = changeMarker;
// module.exports.deleteMarker = deleteMarker;
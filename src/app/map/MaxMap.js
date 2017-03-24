/**
 * Created by BondarenkoMaksim on 04.03.2017.
 */
var map = require('./SetMap');
var socket = io();
var markerTmpl = require('./_marker_common.jade');

//create info wind in global
var infoWind = new google.maps.InfoWindow();

var createMarker = function(position, name, type, review,comfort, square, service) {
    var marker = new google.maps.Marker({
        // random ending to avoid replacing the same mark time id
        id: Math.floor(Math.random() * 128)
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
    return marker
};
socket.on('connection', function(data){
    console.log(data);
})
var AddMarker = function () {
    var newMarkerForm = {};
    /* for (var key in marker) {
     if (!marker.hasOwnProperty(key)) continue;
     newMarkerForm[key] =  marker[key];
     }*/
    // newMarkerForm.title = marker.title;
    // newMarkerForm.id_ = marker.id;
    // newMarkerForm.position = marker.position;
    // console.log(newMarkerForm);

    var newMarker = createMarker ({lat: 50.446246, lng: 30.520878}, 'The Little pony', 'Cafe', 'Amazing', '5', '42', '5');
    console.log(newMarker)
    socket.emit('AddMarker', newMarker, function (successful) {
        console.log("addition was succsful: " + successful);
        if (!successful) {
            return Promise.reject(successful);
        } else {
            return Promise.resolve(successful);
        }
    });
}
// AddMarker();
module.exports.AddNewMarker = AddMarker;

// var UpdateMarker = function (marker) {
//     var newMarkerForm = {};
//     /* for (var key in marker) {
//      if (!marker.hasOwnProperty(key)) continue;
//      newMarkerForm[key] =  marker[key];
//      }*/
//
//     newMarkerForm.title = marker.title;
//     newMarkerForm.id_ = marker.id;
//     newMarkerForm.position = marker.position;
//
//     console.log(newMarkerForm);
//
//     var newMarker = JSON.stringify(newMarkerForm);
//
//     socket.emit('UpdateMarker', newMarker, function (successful) {
//         console.log("Update was succsful: " + successful);
//         if (!successful) {
//             return Promise.reject(successful);
//         } else {
//             return Promise.resolve(successful);
//         }
//     });
// }
// module.exports.UpdateMarker = UpdateMarker;
//
// var DeleteMarker = function (marker) {
//     var newMarkerForm = {};
//
//
//     //   newMarkerForm.title = marker.title;
//     newMarkerForm.id_ = marker.id;
//     //  newMarkerForm.position = marker.position;
//
//     console.log(newMarkerForm);
//
//     var newMarker = JSON.stringify(newMarkerForm);
//
//     socket.emit('DeleteMarker', newMarker, function (answare) {
//         console.log("Delete was succsful: " + answare);
//         if (!answare) {
//             return answare;
//         } else {
//             return answare;
//         }
//     });
// }
// module.exports.DeleteMarker = DeleteMarker;
// ////////////////////////////////////////////////////
// var GetAllMarkers = function () {
//     socket.emit('GetAllMarkers', true, function (AllMarkers) {
//         console.log("AllMarkers: " + AllMarkers);
//         var Markers = JSON.parse(AllMarkers);
//         if (Markers instanceof Error) {
//             return new Error('Reqvest not was succsful');
//         } else {
//             return AllMarkers;
//         }
//     });
// }
// module.exports.GetAllMarkers = GetAllMarkers;

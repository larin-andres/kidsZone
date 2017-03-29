require('./style.scss');

var latLng = new google.maps.LatLng({lat: 50.448853, lng: 30.513346});
var mapOption = {
    zoom: 12
    , center: latLng
    , mapTypeId: google.maps.MapTypeId.ROADMAP
};

var map = new google.maps.Map(document.getElementById('map'), mapOption);

module.exports = map;

import mapboxgl from 'mapbox-gl'
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'

mapboxgl.accessToken = 'pk.eyJ1IjoibWlqdW9za2EiLCJhIjoiY2tjcmM3MTNqMGNmOTJ4anZ4dmZpaXRtcCJ9.47nXKdL555B6Bddfjwje1g';

const map = new mapboxgl.Map({
    container: 'mapbox',
    style: 'mapbox://styles/mapbox/streets-v11',
});

let geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
    enableHighAccuracy: true
    },
    showUserLocation: true
});

const directions = new MapboxDirections({
    accessToken: 'pk.eyJ1IjoibWlqdW9za2EiLCJhIjoiY2tjcmM3MTNqMGNmOTJ4anZ4dmZpaXRtcCJ9.47nXKdL555B6Bddfjwje1g',
    unit: 'metric',
    profile: 'mapbox/walking',
    controls: {
        inputs: false,
        instructions: false,
        profileSwitcher: false
    }
});



export { map, geolocate, directions }

import mapboxgl from 'mapbox-gl'
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'



mapboxgl.accessToken = 'pk.eyJ1IjoibWlqdW9za2EiLCJhIjoiY2tjcmM3MTNqMGNmOTJ4anZ4dmZpaXRtcCJ9.47nXKdL555B6Bddfjwje1g';

class Map {
    constructor() {
        this.map = new mapboxgl.Map({
            container: 'mapbox',
            style: 'mapbox://styles/mapbox/streets-v11',
        });

        this.geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            showUserLocation: true
        });
       
        this.directions = new MapboxDirections({
            accessToken: 'pk.eyJ1IjoibWlqdW9za2EiLCJhIjoiY2tjcmM3MTNqMGNmOTJ4anZ4dmZpaXRtcCJ9.47nXKdL555B6Bddfjwje1g',
            unit: 'metric',
            profile: 'mapbox/walking',
            controls: {
                inputs: false,
                instructions: false,
                profileSwitcher: false
            }
        });

        this.options = {
                enableHighAccuracy: true,
                timeout: 10000
            };
    }

    geolocationTrigger() {
         this.geolocate.trigger()
    }

    initMap ()  {
        this.map.addControl(this.geolocate)
        this.map.addControl(this.directions)
    }
    getInitialDirections ({
        myStreetName,
        myStreetNumber,
        myCity,
        stationStreet,
        stationStreetNum,
        stationCity
    })  {
        this.geolocationTrigger()
        this.directions.setOrigin(`${myStreetName} ${myStreetNumber}, ${myCity}`)
        this.directions.setDestination(`${stationStreet}, ${stationStreetNum}, ${stationCity}`)
    }
    getDirections ({ myStreetName, myStreetNumber, myCity, stationStreet, stationStreetNum, stationCity }) {
    this.directions.setOrigin(`${myStreetName} ${myStreetNumber}, ${myCity}`)
    this.directions.setDestination(`${stationStreet}, ${stationStreetNum}, ${stationCity}`)
}

}




export { Map as default }
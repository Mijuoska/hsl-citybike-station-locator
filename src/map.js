
import mapboxgl from 'mapbox-gl'
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_KEY;

class Map {
    constructor() {
        this.map = new mapboxgl.Map({
            container: 'mapbox',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [24.945831, 60.192059],
            zoom: 9

        });

        this.geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            showUserLocation: true
        });
       
        this.directions = new MapboxDirections({
            accessToken: mapboxgl.accessToken,
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
        stationStreetNumber,
        stationCity
    })  {
        this.directions.setOrigin(`${myStreetName} ${myStreetNumber}, ${myCity}`)
        this.directions.setDestination(`${stationStreet}, ${stationStreetNumber}, ${stationCity}`)
        
      
    }
    getDirections ({ myStreetName, myStreetNumber, myCity, stationStreet, stationStreetNumber, stationCity }) {
    this.directions.setOrigin(`${myStreetName} ${myStreetNumber}, ${myCity}`)
    this.directions.setDestination(`${stationStreet}, ${stationStreetNumber}, ${stationCity}`)

}

}




export { Map as default }
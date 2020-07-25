
import mapboxgl from 'mapbox-gl'
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'



const token = "secret"

mapboxgl.accessToken = token;

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
            accessToken: token,
            unit: 'metric',
            profile: 'mapbox/walking',
            controls: {
                inputs: false,
                instructions: false,
                profileSwitcher: false
            }
        });
    }

    geolocationTrigger() {
         this.geolocate.trigger()
    }

    initMap (
        {
        myStreetName,
        myStreetNumber,
        myCity,
        stationStreet,
        stationStreetNum,
        stationCity
    })  {
        this.map.addControl(this.geolocate)
        this.map.addControl(this.directions)
        const geolocate = this.geolocationTrigger.bind(this)
        const getInitialDirections = this.getInitialDirections.bind(this)
        this.map.on('load', function () {
            geolocate()
            getInitialDirections(myStreetName, myStreetNumber, myCity, stationStreet, stationStreetNum, stationCity)
        })
    }
    getInitialDirections (
        myStreetName,
        myStreetNumber,
        myCity,
        stationStreet,
        stationStreetNum,
        stationCity
    )  {
        this.directions.setOrigin(`${myStreetName} ${myStreetNumber}, ${myCity}`)
        this.directions.setDestination(`${stationStreet}, ${stationStreetNum}, ${stationCity}`)
    }
    getDirections ({ myStreetName, myStreetNumber, myCity, stationStreet, stationStreetNum, stationCity }) {
    this.directions.setOrigin(`${myStreetName} ${myStreetNumber}, ${myCity}`)
    this.directions.setDestination(`${stationStreet}, ${stationStreetNum}, ${stationCity}`)
}

}




export { Map as default }
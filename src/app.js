import { getLocation, showError, calculateDistances, calculateNearestStations, createStationList } from './functions' 
import { decodeLocation, getData } from './requests'
import Map from './map'
 
 const options = {
     enableHighAccuracy: true,
     timeout: 10000
 };
    // Get current location and display it
 getLocation(options, showError, async(latLng) => {
      let myLocation = await decodeLocation(latLng.lat, latLng.lng)
      let myStreetName = myLocation.data[0].street ? myLocation.data[0].street : myLocation.data[0].name
      let myStreetNumber = myLocation.data[0].number ? myLocation.data[0].number : ""
      let myCity = myLocation.data[0].administrative_area

      const message = document.getElementById('message')
      message.innerHTML = `<i class="fas fa-map-marker-alt"></i> <b>Your current location:</b> ${myLocation.data[0].label}`
      
      // Get bike stations, display them on the screen, calculate the nearest station and display it
      let distances = []
      const stations = await getData()
      stations.map(station => {
        let distance = calculateDistances(latLng.lat, latLng.lng, station.attributes['y'], station.attributes['x'], station, 'K')
        distances.push(distance)
             });
        
       
      let nearestStations = calculateNearestStations(distances)
      let stationName = nearestStations[0].station.attributes["Nimi"]
      let stationAddress = nearestStations[0].station.attributes["Osoite"]
      let stationStreet = stationAddress.split(' ')[0]
      let stationStreetNum = stationAddress.split(' ')[1]
      let stationCity = nearestStations[0].station.attributes["Kaupunki"]
      let stationDistance = nearestStations[0].distance
      
      const originDestination = {
        myStreetName: myStreetName,
        myStreetNumber: myStreetNumber,
        myCity: myCity,
        stationStreet: stationStreet,
        stationStreetNumber: stationStreetNum,
        stationCity: stationCity
      }

      document.getElementById('nearest-station').innerHTML =
          `<i class="fas fa-bicycle"></i> <b>Your nearest station:</b> ${stationName} - ${stationAddress}, ${stationCity} (${stationDistance} km)`
       
      const map = new Map()  
      map.initMap(originDestination)

      // creating a list of the next nearest stations, excluding the one already displayed
      for (let i = 1; i < 6; i++) {
        let station = nearestStations[i].station
        let distance = nearestStations[i].distance
        createStationList(station, distance)
      }
       let locateButtons = document.querySelectorAll('.locate')
       for (let button of locateButtons) {
          button.addEventListener('click', (e) => {
            let id = e.path[1].id
            let newStationStreet = id.split(' ')[0]
            let newStationStreetNum = id.split(' ')[1].replace(/,/, '')
            let newStationCity = id.split(',')[1].trim()
            originDestination.stationStreet = newStationStreet,
            originDestination.stationStreetNumber = newStationStreetNum,
            originDestination.stationCity = newStationCity
            map.getDirections(originDestination)
          });
       }

       });

 
       
  



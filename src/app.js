import {
  getLocation,
  parseLocation,
  showError,
  displayInfo,
  getDistances,
  calculateNearestStations,
  parseNearestStation,
  createStationList
} from './functions'

import {
  decodeLocation,
  getData
} from './requests'

import Map from './map'


const map = new Map()
map.initMap()



const container = document.getElementsByClassName('container')[0]

if (container.classList.value === 'hide') {
  container.classList.remove('hide')
}

if (!navigator.geolocation) {
  alert('Geolocation not available!')
} else {

  getLocation(map.options, showError, async (latLng) => {
    let myLocation = await decodeLocation(latLng.lat, latLng.lng)
    document.getElementById('location-display').classList.remove('hide')
    displayInfo('message', 'current-location-text', myLocation.data[0].label)


    // Get bike stations, display them on the screen, calculate the nearest station and display it
    const stations = await getData()
    const distances = getDistances(latLng, stations)
    const nearestStations = calculateNearestStations(distances)


    const {
      myStreetName,
      myStreetNumber,
      myCity
    } = parseLocation(myLocation)

    const {
      stationName,
      stationAddress,
      stationStreet,
      stationStreetNumber,
      stationCity,
      stationDistance
    } = parseNearestStation(nearestStations)

    const originDestination = {
      myStreetName: myStreetName,
      myStreetNumber: myStreetNumber,
      myCity: myCity,
      stationStreet: stationStreet,
      stationStreetNumber: stationStreetNumber,
      stationCity: stationCity
    }


    const stationString = `${stationName} - ${stationAddress}, ${stationCity} (${stationDistance} km)`
    displayInfo('nearest-station', 'nearest-station-text', stationString)

    // creating a list of the next nearest stations, excluding the one already displayed
    createStationList(nearestStations)

    let locateButtons = document.querySelectorAll('.locate')
    for (let button of locateButtons) {
      button.addEventListener('click', (e) => {
        const newDestination = {
          ...originDestination
        }
        let id = e.path ? e.path[1].id : e.target.parentElement.id
        newDestination.stationStreet = id.split(' ')[0]
        newDestination.stationStreetNumber = id.split(' ')[1].replace(/,/, '')
        newDestination.stationCity = id.split(',')[1].trim()
        map.getDirections(newDestination)

        let nearestStationButton
        if (!document.getElementById('nearest-station-button')) {
          nearestStationButton = document.createElement('button')
          nearestStationButton.id = 'nearest-station-button'
          nearestStationButton.innerHTML = 'Show nearest station'
          nearestStationButton.classList.add('locate')
          document.getElementById('nearest-station').appendChild(nearestStationButton)
          nearestStationButton.addEventListener('click', () => {
            map.getDirections(originDestination)


          })
        }

      });
    }

    map.getInitialDirections(originDestination)
    map.map.resize()

  });
}

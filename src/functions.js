import { getData } from './requests'

const getLocation = (options, showError, callback) => {
        navigator.geolocation.getCurrentPosition((position) =>{
            let latLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
        return callback(latLng)
        }, showError, options)


    } 

 function displayInfo(containerElemName, textElemName, elemTextContent) {
     const containerElem = document.getElementById(containerElemName)
     containerElem.classList.remove('hide');
     const textElem = document.getElementById(textElemName)
     textElem.textContent = elemTextContent
 }

 const parseLocation = (myLocation) => {
     const locationObject = {}
     locationObject['myStreetName'] = myLocation.data[0].street ? myLocation.data[0].street : myLocation.data[0].name
     locationObject['myStreetNumber'] = myLocation.data[0].number ? myLocation.data[0].number : ""
     locationObject['myCity'] = myLocation.data[0].administrative_area
     return locationObject
 }


const parseNearestStation = (nearestStations) => {
 const stationObject = {}
 stationObject["stationAddress"] = nearestStations[0].station.attributes["Osoite"]
 stationObject["stationName"] = nearestStations[0].station.attributes["Nimi"]
 stationObject["stationStreet"] = stationObject["stationAddress"].split(' ')[0]
 stationObject["stationStreetNumber"] = stationObject["stationAddress"].split(' ')[1]
 stationObject["stationCity"] = nearestStations[0].station.attributes["Kaupunki"]
 stationObject["stationDistance"] = nearestStations[0].distance
 return stationObject
}

const showError = (error) => {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            message.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            message.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            message.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            message.innerHTML = "An unknown error occurred."
            break;
        default:
            message.innerHTML = "Something went wrong, please try again"
    }
}



const calculateDistance = (lat1, lon1, lat2, lon2, station, unit) => {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    } else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") {
            dist = dist * 1.609344
        }
        if (unit == "N") {
            dist = dist * 0.8684
        }
    }
     return {station: station, distance: Math.floor(dist * 10) / 10};
}  

  const getDistances = async (latLng) => {
    const distances = []
    const stations = await getData()
    stations.map(station => {
    const distance = calculateDistance(latLng.lat, latLng.lng, station.attributes['y'], station.attributes['x'], station, 'K')
    distances.push(distance)
    });
    return distances
    }

const calculateNearestStations = (distances) => {
    let sorted = distances.sort((a, b) => {
        if (a.distance > b.distance) {
            return 1
        } else if (a.distance < b.distance) {
            return -1
        } else {
            return 0
        }
    })
        return sorted

}



const createStationListElement = (station, distance) => {
    let li = document.createElement('li')
    let button = document.createElement('button')
    button.id = JSON.stringify({
        lat: `${station.attributes["y"]}`,
        lng: `${station.attributes["x"]}`
    })
    button.classList.add('locate')
    button.innerText = "Show directions"
    li.innerHTML = `${station.attributes["Nimi"]} - ${station.attributes["Osoite"]} (${distance} km)`
    li.id = `${station.attributes["Osoite"]}, ${station.attributes["Kaupunki"]}`
    let ul = document.getElementById('station-list')
    ul.appendChild(li)
    li.appendChild(button)
}

const createStationList = (nearestStations) => {
     const stationsContainer = document.getElementById('other-stations-container')
     stationsContainer.classList.remove('hide')
     for (let i = 1; i < 6; i++) {
         let station = nearestStations[i].station
         let distance = nearestStations[i].distance
         createStationListElement(station, distance)
     }
}



export { getLocation, parseLocation, showError, displayInfo, calculateDistance, getDistances, calculateNearestStations, parseNearestStation, createStationList }
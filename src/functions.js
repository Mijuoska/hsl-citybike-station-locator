
const getLocation = (options, callback) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) =>{
            let latLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
        return callback(latLng)
        }, showError, options)


    } else {
        message.innerHTML = "Geolocation is not supported by this browser."
    }
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



const calculateDistances = (lat1, lon1, lat2, lon2, station, unit) => {
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
     return {station: station, distance: dist};
}

const calculateNearestStation = (distances) => {
    let sorted = distances.sort((a, b) => {
        if (a.distance > b.distance) {
            return 1
        } else if (a.distance < b.distance) {
            return -1
        } else {
            return 0
        }
    })
        return sorted[0]

}



const createStationList = (station) => {
    let li = document.createElement('li')
    let button = document.createElement('button')
    button.id = JSON.stringify({
        lat: `${station.attributes["y"]}`,
        lng: `${station.attributes["x"]}`
    })
    button.classList.add('locate')
    button.innerText = "Locate"
    li.innerHTML = `${station.attributes["Nimi"]} - ${station.attributes["Osoite"]}`
    li.id = `${station.attributes["Osoite"]}, ${station.attributes["Kaupunki"]}`
    let ul = document.getElementById('station-list')
    ul.appendChild(li)
    li.appendChild(button)
}



const createEventListener = (button,myStreetName, myStreetNumber, myCity) => {    
    button.addEventListener('click', (e) => {
        let id = e.path[1].id
        let stationStreet = id.split(' ')[0]
        let stationStreetNum = id.split(' ')[1].replace(/,/, '')
        let stationCity = id.split(',')[1].trim()
        openMap(myStreetName, myStreetNumber, myCity, stationStreet, stationStreetNum, stationCity)
        });

    }


const openMap = (streetName1, streetNum1, city1, streetName2, streetNum2, city2) => {
    let url = `https://www.google.com/maps/dir/${streetName1}+${streetNum1}+${city1}/${streetName2},+${streetNum2}+${city2}`
    window.open(url, '_blank')
}

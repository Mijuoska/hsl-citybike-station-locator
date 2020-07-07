
 const options = {
     enableHighAccuracy: true,
     timeout: 10000
 };
    // Get current location and display it
 getLocation(options, async(latLng) => {
      let myLocation = await decodeLocation(latLng.lat, latLng.lng)
      let myStreetName = myLocation.data[0].street ? myLocation.data[0].street : myLocation.data[0].name
      let myStreetNumber = myLocation.data[0].number ? myLocation.data[0].number : ""
      let myCity = myLocation.data[0].administrative_area

      const message = document.getElementById('message')
      message.innerHTML = `<b>Your current location:</b> ${myLocation.data[0].label}`
      
      // Get bike stations, display them on the screen, calculate the nearest station and display it
      let distances = []
      const stations = await getData()
      stations.map(station => {
        createStationList(station)
        let distance = calculateDistances(latLng.lat, latLng.lng, station.attributes['y'], station.attributes['x'], station)
        distances.push(distance)
             });
        
        let locateButtons = document.querySelectorAll('.locate')
        for (let button of locateButtons) {
          createEventListener(button, myStreetName, myStreetNumber, myCity)
        }
      let nearestStation = calculateNearestStation(distances)
      let stationName = nearestStation.station.attributes["Nimi"]
      let stationAddress = nearestStation.station.attributes["Osoite"]
      let stationStreet = stationAddress.split(' ')[0]
      let stationStreetNum = stationAddress.split(' ')[1]
      let stationCity = nearestStation.station.attributes["Kaupunki"]

      document.getElementById('nearest-station').innerHTML =
          `<b>Your nearest station:</b> ${stationName} - ${stationAddress}, ${stationCity}`

      
      let showRoute = document.createElement('button')
      showRoute.innerHTML = 'Show route'
      document.getElementById('location-display').appendChild(showRoute)
      showRoute.addEventListener('click', (e) => {
          openMap(myStreetName, myStreetNumber, myCity, stationStreet, stationStreetNum, stationCity)
            })
       })
 
  



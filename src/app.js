
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
        let distance = calculateDistances(latLng.lat, latLng.lng, station.attributes['y'], station.attributes['x'], station)
        distances.push(distance)
             });
        
        let locateButtons = document.querySelectorAll('.locate')
        for (let button of locateButtons) {
          createEventListener(button, myStreetName, myStreetNumber, myCity)
        }
      let nearestStations = calculateNearestStations(distances)
      let stationName = nearestStations[0].station.attributes["Nimi"]
      let stationAddress = nearestStations[0].station.attributes["Osoite"]
      let stationStreet = stationAddress[0].split(' ')[0]
      let stationStreetNum = stationAddress[0].split(' ')[1]
      let stationCity = nearestStations[0].station.attributes["Kaupunki"]

      document.getElementById('nearest-station').innerHTML =
          `<b>Your nearest station:</b> ${stationName} - ${stationAddress}, ${stationCity}`
          embedDirections(myStreetName, myStreetNumber, myCity, stationStreet, stationStreetNum, stationCity)

      // creating a list of the next nearest stations, excluding the one already displayed
      for (let i = 1; i < 6; i++) {
        let station = nearestStations[i].station
        createStationList(station)
      }
      
       })
 
  



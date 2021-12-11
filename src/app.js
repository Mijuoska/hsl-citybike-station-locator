import {
  getLocation,
  parseLocation,
  showError,
  displayInfo,
  getDistances,
  calculateNearestStations,
  parseNearestStation,
  createStationList,
} from "./functions";

import { decodeLocation, getData } from "./requests";

import Map from "./map";

if (!navigator.geolocation) {
  alert("Geolocation not available!");
} else {
  getLocation({
      enableHighAccuracy: true,
      timeout: 10000,
    },
    showError,
    async (latLng) => {
      let myLocation 
      try {
      myLocation = await decodeLocation(latLng.lat, latLng.lng);
      } catch(e) {
        displayInfo("message", "current-location-text", "Something went wrong with fetching location")
      }
      document.getElementById("location-display").classList.remove("hide");
      displayInfo("message", "current-location-text", myLocation.data[0].label);

      const map = new Map();
      document.getElementById('mapbox').classList.remove('hide');
      document.querySelector('.isLoading').classList.add('hide');

      map.initMap();

      var canvas = document.getElementsByTagName('canvas');
      canvas[0].style.width = '100%';
      canvas[0].style.height = '100%';

      // Get bike stations, display them on the screen, calculate the nearest station and display it
      let stations
      try {
       stations = await getData();
      } catch (e) {
          displayInfo("message", "current-location-text", "Something went wrong with fetching stations")          
      }
      const distances = getDistances(latLng, stations);
      const nearestStations = calculateNearestStations(distances);

      const { myStreetName, myStreetNumber, myCity } = parseLocation(
        myLocation
      );

      const {
        stationName,
        stationAddress,
        stationStreet,
        stationStreetNumber,
        stationCity,
        stationDistance,
      } = parseNearestStation(nearestStations);

      const origin = {
        myStreetName: myStreetName,
        myStreetNumber: myStreetNumber,
        myCity: myCity,
      };

      const destination = {
        stationStreet: stationStreet,
        stationStreetNumber: stationStreetNumber,
        stationCity: stationCity,
      };

    


      map.map.on("load", () => {
        map.getDirections(origin, destination);
        map.map.resize();
      });

      const stationString = `${stationName} - ${stationAddress}, ${stationCity} (${stationDistance} km)`;
      displayInfo("nearest-station", "nearest-station-text", stationString);
      // creating a list of the next nearest stations, excluding the one already displayed
      createStationList(nearestStations);


      // Creating buttons for locating the next neareste stations
      let locateButtons = document.querySelectorAll(".locate");
      for (let button of locateButtons) {
        button.addEventListener("click", (e) => {
          let id = e.path ? e.path[1].id : e.target.parentElement.id;

          const newDestination = {
            stationStreet: id.split(" ")[0],
            stationStreetNumber: id.split(" ")[1].replace(/,/, ""),
            stationCity: id.split(",")[1].trim(),
          };

          map.getDirections(origin, newDestination);

         

          // Generating button to show nearest station again, if any of the above buttons are clicked
          let nearestStationButton;
          if (!document.getElementById("nearest-station-button")) {
            nearestStationButton = document.createElement("button");
            nearestStationButton.id = "nearest-station-button";
            nearestStationButton.innerHTML = "Show nearest station";
            nearestStationButton.classList.add("locate");
            document
              .getElementById("nearest-station")
              .appendChild(nearestStationButton);
            nearestStationButton.addEventListener("click", () => {
              map.getDirections(origin, destination);
            });
          }
        });
      }
      
    }
    
  );
   
}

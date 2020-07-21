
const decodeLocation = async (lat, lng) => {
    const url = `https://secret-mountain-81703.herokuapp.com/geocoding&query=${lat},${lng}`
  //  const url = `https://secret-mountain-81703.herokuapp.com/geocoding?query=${lat},${lng}`

    const response = await fetch(url)
    if (response.status === 200) {
        const result = await response.json()
        return result
    } else {
        throw new Error("Unable to get decode location at this time")
    }
    }



const getData = async () => {
    const url = 'https://services1.arcgis.com/sswNXkUiRoWtrx0t/arcgis/rest/services/Helsingin_ja_Espoon_kaupunkipy%C3%B6r%C3%A4asemat/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json'

    const response = await fetch(url)

    if (response.status === 200) {
        const data = await response.json()
        return data.features
    } else {
        throw new Error("Unable to get station info")
    }
}

export { decodeLocation, getData }













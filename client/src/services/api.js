const BASE_URL = 'http://localhost:5000'

export const fetchHotspots = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/hotspots')
    const data = await response.json()
    if (data.success) {
      return data.data
    }
    return null
  } catch (err) {
    console.log('API not ready, using dummy data')
    return null
  }
}

export const fetchIndustrialZones = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/industrial-zones`)
    const data = await response.json()
    if (data.success) {
      return data.data
    }
    return null
  } catch (err) {
    console.log('Industrial zones API not ready')
    return null
  }
}
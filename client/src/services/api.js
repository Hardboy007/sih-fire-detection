const BASE_URL = 'http://localhost:5000'

export const fetchHotspots = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/hotspots`)
    if (!response.ok) throw new Error('API error')
    const data = await response.json()
    return data
  } catch (err) {
    console.log('API not ready, using dummy data')
    return null
  }
}
// Alert panel ke liye — string format
export const hotspots = [
  { id: 1, city: 'Delhi', type: 'Wildfire', frp: 200, confidence: 'high', time: '10:32 AM', lat: '28.70°N', lng: '77.10°E' },
  { id: 2, city: 'Kolkata', type: 'Industrial Fire', frp: 120, confidence: 'high', time: '10:15 AM', lat: '22.57°N', lng: '88.36°E' },
  { id: 3, city: 'Ahmedabad', type: 'Industrial Fire', frp: 80, confidence: 'nominal', time: '09:58 AM', lat: '23.02°N', lng: '72.57°E' },
  { id: 4, city: 'Bangalore', type: 'Persistent Thermal Source', frp: 55, confidence: 'nominal', time: '09:45 AM', lat: '12.97°N', lng: '77.59°E' },
  { id: 5, city: 'Mumbai', type: 'Persistent Thermal Source', frp: 45, confidence: 'nominal', time: '09:30 AM', lat: '19.07°N', lng: '72.87°E' },
  { id: 6, city: 'Chennai', type: 'Low Risk', frp: 30, confidence: 'low', time: '09:10 AM', lat: '13.08°N', lng: '80.27°E' },
]

// Map ke liye — numeric format
export const mapHotspots = [
  { id: 1, lat: 28.7041, lng: 77.1025, frp: 200, confidence: 'high', type: 'Wildfire', city: 'Delhi' },
  { id: 2, lat: 22.5726, lng: 88.3639, frp: 120, confidence: 'high', type: 'Industrial Fire', city: 'Kolkata' },
  { id: 3, lat: 23.0225, lng: 72.5714, frp: 80, confidence: 'nominal', type: 'Industrial Fire', city: 'Ahmedabad' },
  { id: 4, lat: 12.9716, lng: 77.5946, frp: 55, confidence: 'nominal', type: 'Persistent Thermal Source', city: 'Bangalore' },
  { id: 5, lat: 19.0760, lng: 72.8777, frp: 45, confidence: 'nominal', type: 'Persistent Thermal Source', city: 'Mumbai' },
  { id: 6, lat: 13.0827, lng: 80.2707, frp: 30, confidence: 'low', type: 'Low Risk', city: 'Chennai' },
]
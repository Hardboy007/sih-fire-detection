export const industrialZones = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Noida Industrial Area" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [77.35, 28.60], [77.45, 28.60],
          [77.45, 28.52], [77.35, 28.52],
          [77.35, 28.60]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Kolkata Industrial Belt" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [88.30, 22.60], [88.45, 22.60],
          [88.45, 22.50], [88.30, 22.50],
          [88.30, 22.60]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Ahmedabad Industrial Zone" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [72.50, 23.05], [72.65, 23.05],
          [72.65, 22.95], [72.50, 22.95],
          [72.50, 23.05]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Mumbai MIDC" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [72.80, 19.12], [72.95, 19.12],
          [72.95, 19.02], [72.80, 19.02],
          [72.80, 19.12]
        ]]
      }
    }
  ]
}

// Assuming you have already included Leaflet CSS and JS in your HTML
console.log(coordinates);

// Initialize the map and set its view to New Delhi
var map = L.map('map').setView([coordinates[1],coordinates[0]], 5); // Center at New Delhi

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Check if the coordinates are provided
if (!coordinates || coordinates.length !== 2) {
    console.log("No valid coordinates provided. Centering map to New Delhi.");
} else {
    // Create a custom red icon
    var customIcon = L.icon({
        iconUrl: 'https://img.icons8.com/color/48/000000/marker.png', // Red marker icon URL
        iconSize: [48, 48], // Size of the icon
        iconAnchor: [24, 48], // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -48] // Point from which the popup should open relative to the iconAnchor
    });

    // Create a marker at the provided coordinates with the custom icon
    var marker = L.marker([coordinates[1], coordinates[0]], { icon: customIcon }).addTo(map);
    marker.bindPopup(coordinates.join(", ")); // Optional: Add a popup with coordinates

    // GeoJSON data
    var geojsonData = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates":coordinates, // GeoJSON uses [longitude, latitude]
                },
                "properties": {
                    "name":title,
                    "description": "Description of the marker"
                }
            }
        ]
    };

    // Add GeoJSON data to the map
    L.geoJson(geojsonData, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, { icon: customIcon }).bindPopup(feature.properties.name);
        }
    }).addTo(map);
}

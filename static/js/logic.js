// Storing the API endpoint as the url for our query
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Performing request and logging repsonse
d3.json(url).then(function(response) {
    console.log(response);
})

//Leaflet map initialization
let map = L.map('map').setView([0,0],2); 

//Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

//Get all pertinent earthquake data 
response.features.forEach(function(feature) {
    
    let magnitude = feature.properties.mag;
    let coordinates = feature.geometry.coordinates;
    let depth = coordinates[2];
    let place = feature.properties.place

})
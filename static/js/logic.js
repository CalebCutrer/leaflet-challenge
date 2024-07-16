// Initializing the map
let map = L.map('map').setView([20, 0], 2);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to get color based on magnitude 
function getColor(depth) {
    return depth > 90 ? '#720000' :
           depth > 70 ? '#a33d3d' :
           depth > 50 ? '#ee666e' :
           depth > 30 ? '#ffa59f' :
           depth > 10 ? '#f4cccc' :
                        '#f6d6d6';
}

// Function to style the bubbles
function style(feature) {
    return {
        radius: feature.properties.mag * 3,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
}

// Function to bind popups to the bubbles
function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.place) {
        layer.bindPopup("<b>Location:</b> " + feature.properties.place +
                        "<br><b>Magnitude:</b> " + feature.properties.mag +
                        "<br><b>Depth:</b> " + feature.geometry.coordinates[2] + " km");
    }
}

// Fetch earthquake data from the USGS feed, all week summary past 7 days
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng);
            },
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    })
    .catch(error => console.error('Error fetching the earthquake data:', error));

// Add legend to the map
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90];

    let legendContainer = document.createElement('div');
    legendContainer.style.display = 'flex';
    legendContainer.style.flexDirection = 'column';

    for (let i = 0; i < grades.length; i++) {
        let item = document.createElement('div');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.marginBottom = '4px';

        let colorBox = document.createElement('i');
        colorBox.style.background = getColor(grades[i] + 1);
        colorBox.style.width = '18px';
        colorBox.style.height = '18px';
        colorBox.style.marginRight = '8px';

        let label = document.createElement('span');
        label.innerHTML = grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] : '+');

        item.appendChild(colorBox);
        item.appendChild(label);
        legendContainer.appendChild(item);
    }

    div.appendChild(legendContainer);
    return div;
};

legend.addTo(map);
// Create a map object.
let myMap = L.map("map", {
    center:[-6.20, 106.81],
    zoom: 4
});

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Define a markerSize() function that will give each earthquake a different radius based on its depth.
function markerSize(depth) {
    return depth * 40000;
  };

// Define function to get fill color based on the depth of each earthquake
  function fillColor(depth) {
    if (depth >  90) {return  '#800026'}
    else if (depth >70) {return '#BD0026'}
    else if (depth > 50){return '#E31A1C'}
    else if (depth >30) {return '#FC4E2A'}
    else if (depth > 10){return '#FD8D3C'} 
    else {return '#FEB24C'}};

// Define url of the geoJson API
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Getting our GeoJSON data
d3.json(url).then(function(response) {

    // console.log(response);
    let features = response.features;
    console.log(features);
  
    for (let i = 0; i < features.length; i++) {
  
      let location = features[i].geometry;
    //   console.log(location);

      let coordinates = location.coordinates;
    //   console.log([coordinates[1],coordinates[0]]);

        L.circle([coordinates[1],coordinates[0]], {
            fillOpacity: 0.75,
            color: "white",
            fillColor: fillColor(coordinates[2]),
            radius: markerSize(features[i].properties.mag)}).bindPopup(`<h3>${features[i].properties.place}</h3><hr><p>${new Date(features[i].properties.time)}</p><hr><p>Magnitude: ${features[i].properties.mag} | Depth: ${coordinates[2]}</p>`).addTo(myMap);
    };

// Create legend

let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    let div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + fillColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(myMap);
});


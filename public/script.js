const socket = io();
const markers = {};
const circles = {};

navigator.geolocation.watchPosition((position) => {
    const { latitude, longitude } = position.coords;
    

    map.setView([latitude, longitude], 16);

    socket.emit("send-location", { latitude, longitude });
},
(error) => {
    console.error(error);
},
{
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
});

const map = L.map('map').setView([51.505, -0.09], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

socket.on("recive-location", (data) => {
    const { id, latitude, longitude } = data;

    if (markers[id]) {
        map.removeLayer(markers[id]);
        map.removeLayer(circles[id]); 
    }

    const circle = L.circle([latitude, longitude], {
        color: "blue",
        fillColor: '#000ff2',
        fillOpacity: 0.2,
        radius: 250
    }).addTo(map);

    const marker = L.marker([latitude, longitude]).addTo(map);

    markers[id] = marker;
    circles[id] = circle; 
});

socket.on("disconnect", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
    if (circles[id]) {
        map.removeLayer(circles[id]);
        delete circles[id]; 
    }
});

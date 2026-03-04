const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjkyMmIxYWViYWIxNTRlZjQ5ZWU4NzA3M2Q2ZTI2ZTU0IiwiaCI6Im11cm11cjY0In0=";

let map = L.map("map").setView([22.5726,88.3639],5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
attribution:"© OpenStreetMap"
}).addTo(map);

let startCoords=null;
let endCoords=null;

let startMarker=null;
let endMarker=null;
let routeLine=null;

let currentMode="driving";



function debounce(func,delay){
let timeout;
return function(){
clearTimeout(timeout);
timeout=setTimeout(()=>func.apply(this,arguments),delay);
}
}



async function searchPlace(query,container,type){

if(query.length<2){
container.innerHTML="";
return;
}

let res=await fetch(
"https://nominatim.openstreetmap.org/search?format=json&limit=5&q="+query
);

let data=await res.json();

container.innerHTML="";

data.forEach(place=>{

let div=document.createElement("div");

div.innerHTML=place.display_name;

div.onclick=()=>{

let lat=parseFloat(place.lat);
let lon=parseFloat(place.lon);

map.flyTo([lat,lon],13);

if(type==="start"){

startCoords=[lat,lon];

if(startMarker)map.removeLayer(startMarker);

startMarker=L.marker([lat,lon]).addTo(map);

document.getElementById("start").value=place.display_name;

}

else{

endCoords=[lat,lon];

if(endMarker)map.removeLayer(endMarker);

endMarker=L.marker([lat,lon]).addTo(map);

document.getElementById("end").value=place.display_name;

}

container.innerHTML="";

if(startCoords && endCoords){

calculateRoute();

}

};

container.appendChild(div);

});

}



async function calculateRoute(){

let profile="driving-car";

if(currentMode==="walking") profile="foot-walking";
if(currentMode==="cycling") profile="cycling-regular";

let res=await fetch(

"https://api.openrouteservice.org/v2/directions/"+profile+"/geojson",

{
method:"POST",
headers:{
Authorization:ORS_API_KEY,
"Content-Type":"application/json"
},
body:JSON.stringify({
coordinates:[
[startCoords[1],startCoords[0]],
[endCoords[1],endCoords[0]]
]
})
}

);

let data=await res.json();

let coords=data.features[0].geometry.coordinates.map(c=>[c[1],c[0]]);

if(routeLine)map.removeLayer(routeLine);

routeLine=L.polyline(coords,{
color:"#2563eb",
weight:5
}).addTo(map);

map.fitBounds(routeLine.getBounds());

const summary = data.features[0].properties.summary;

const distance = (summary.distance / 1000).toFixed(2);

// convert seconds → hours + minutes
const totalMinutes = Math.floor(summary.duration / 60);
const hours = Math.floor(totalMinutes / 60);
const minutes = totalMinutes % 60;

let timeText = "";

if (hours > 0) {
  timeText = `${hours} hr ${minutes} min`;
} else {
  timeText = `${minutes} min`;
}

document.querySelector(".route-info h2").textContent = timeText;
document.querySelector(".route-info p").textContent = `${distance} km`;
}



document.getElementById("start").addEventListener(
"input",
debounce(function(){
searchPlace(this.value,document.getElementById("start-results"),"start")
},400)
);

document.getElementById("end").addEventListener(
"input",
debounce(function(){
searchPlace(this.value,document.getElementById("end-results"),"end")
},400)
);



document.querySelectorAll(".mode").forEach(button => {

  button.addEventListener("click", () => {

    // remove active state
    document.querySelectorAll(".mode").forEach(b => b.classList.remove("active"));

    // activate clicked button
    button.classList.add("active");

    // update mode
    currentMode = button.dataset.mode;

    console.log("Mode changed to:", currentMode);

    // recalculate route if both points exist
    if (startCoords && endCoords) {
      calculateRoute();
    }

  });

});




document.getElementById("clearBtn").onclick=()=>{

if(startMarker)map.removeLayer(startMarker);
if(endMarker)map.removeLayer(endMarker);
if(routeLine)map.removeLayer(routeLine);

startCoords=null;
endCoords=null;

document.getElementById("start").value="";
document.getElementById("end").value="";

document.getElementById("start-results").innerHTML="";
document.getElementById("end-results").innerHTML="";

document.querySelector(".route-info h2").textContent="—";
document.querySelector(".route-info p").textContent="Distance will appear here";

};
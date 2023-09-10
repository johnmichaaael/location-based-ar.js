// Function to calculate haversine distance
function haversine(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

AFRAME.registerComponent("location-model", {
  schema: {
    latitude: { type: "number" },
    longitude: { type: "number" },
    name: { type: "string" } // Add a name property for the POI
  },

  init() {
    let el = this.el,
      data = this.data;
    el.setAttribute("gps-entity-place", {
      latitude: data.latitude,
      longitude: data.longitude
    });

    let model = document.createElement("a-gltf-model");
    model.setAttribute("src", "./assets/pointer/scene.gltf");
    model.setAttribute("look-at", "[camera]");
    model.setAttribute("scale", "1.5 1.5 1.5");

    // Add an event listener to handle clicks on the 3D model
    model.addEventListener("click", () => {
      // Get user's current position
      const userPosition = document
        .querySelector("[gps-camera]")
        .getAttribute("position");

      // Calculate the distance from the user to the POI
      const distance = haversine(
        userPosition.latitude,
        userPosition.longitude,
        data.latitude,
        data.longitude
      );

      // Create a text element to display the POI name and distance
      const text = document.createElement("a-text");
      text.setAttribute("value", `${data.name}\n${distance.toFixed(2)} km`);
      text.setAttribute("look-at", "[camera]");
      text.setAttribute("align", "center");
      text.setAttribute("position", "0 1 0"); // Position it above the 3D model

      // Add the text element to the model
      el.appendChild(text);
    });

    el.appendChild(model);
  }
});

let locations = [
  {
    latitude: 8.318892,
    longitude: 124.85917,
    name: "Location 1"
  },
  {
    latitude: 8.318884,
    longitude: 124.858969,
    name: "Location 2"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  locations.forEach((location) => {
    let el = document.createElement("a-entity");
    el.setAttribute("location-model", {
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name // Set the POI name
    });

    document.querySelector("#locations").appendChild(el);
  });
});

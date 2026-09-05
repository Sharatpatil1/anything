import * as THREE from "three";

// -----------------------------
// 1. Create the 3D scene
// -----------------------------
const scene = new THREE.Scene();

scene.background = new THREE.Color(0xf0f0f0);

// -----------------------------
// 2. Create the camera
// -----------------------------
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / 500,
    0.1,
    1000
);

camera.position.set(8, 6, 8);
camera.lookAt(0, 0, 0);

// -----------------------------
// 3. Create the renderer
// -----------------------------
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, 500);

document.body.appendChild(renderer.domElement);

// -----------------------------
// 4. Create initial shelter
// -----------------------------
let shelterGeometry = new THREE.BoxGeometry(6, 3, 4);

let shelterMaterial = new THREE.MeshBasicMaterial({
    color: 0x8b6f47
});

let shelter = new THREE.Mesh(
    shelterGeometry,
    shelterMaterial
);

scene.add(shelter);

// -----------------------------
// 5. Add black edges
// -----------------------------
let edges = new THREE.EdgesGeometry(shelterGeometry);

let edgeMaterial = new THREE.LineBasicMaterial({
    color: 0x000000
});

let shelterEdges = new THREE.LineSegments(
    edges,
    edgeMaterial
);

scene.add(shelterEdges);

// -----------------------------
// 6. Function to update shelter
// -----------------------------
function updateShelter(length, width, height) {

    // Remove old shelter
    scene.remove(shelter);
    scene.remove(shelterEdges);

    shelterGeometry.dispose();
    edges.dispose();

    // Create new geometry using user values
    shelterGeometry = new THREE.BoxGeometry(
        length,
        height,
        width
    );

    shelter = new THREE.Mesh(
        shelterGeometry,
        shelterMaterial
    );

    scene.add(shelter);

    // Create new edges
    edges = new THREE.EdgesGeometry(shelterGeometry);

    shelterEdges = new THREE.LineSegments(
        edges,
        edgeMaterial
    );

    scene.add(shelterEdges);

    // Adjust camera based on shelter size
    const largestDimension = Math.max(
        length,
        width,
        height
    );

    camera.position.set(
        largestDimension * 1.8,
        largestDimension * 1.3,
        largestDimension * 1.8
    );

    camera.lookAt(0, 0, 0);
}

// -----------------------------
// 7. Connect Create Shelter button
// -----------------------------
const button = document.getElementById("createButton");

button.addEventListener("click", function () {

    const length = Number(
        document.getElementById("length").value
    );

    const width = Number(
        document.getElementById("width").value
    );

    const height = Number(
        document.getElementById("height").value
    );

    // Calculate geometry
    const floorArea = length * width;

    const volume = length * width * height;

    // Display results
    document.getElementById("floorArea").textContent =
        floorArea.toFixed(2);

    document.getElementById("volume").textContent =
        volume.toFixed(2);

    // Update 3D shelter
    updateShelter(length, width, height);
});

// -----------------------------
// 8. Animation
// -----------------------------
function animate() {

    requestAnimationFrame(animate);

    shelter.rotation.y += 0.005;
    shelterEdges.rotation.y += 0.005;

    renderer.render(scene, camera);
}

animate();

// -----------------------------
// 9. Handle browser resizing
// -----------------------------
window.addEventListener("resize", function () {

    camera.aspect = window.innerWidth / 500;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, 500);
});
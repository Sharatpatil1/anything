import * as THREE from "three";

import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls.js";


// =====================================================
// SMART 2-FLOOR STORAGE FACILITY
// FINAL CAD / 3D PROTOTYPE
// =====================================================


// =====================================================
// 1. BASIC SETUP
// =====================================================

const container =
    document.getElementById(
        "canvas-container"
    );


const scene =
    new THREE.Scene();


scene.background =
    new THREE.Color(
        0xe9eef2
    );


// =====================================================
// 2. CAMERA
// =====================================================

const camera =
    new THREE.PerspectiveCamera(
        55,
        container.clientWidth /
        container.clientHeight,
        0.1,
        2000
    );


camera.position.set(
    17,
    12,
    18
);


// =====================================================
// 3. RENDERER
// =====================================================

const renderer =
    new THREE.WebGLRenderer({
        antialias: true
    });


renderer.setPixelRatio(
    window.devicePixelRatio
);


renderer.setSize(
    container.clientWidth,
    container.clientHeight
);


container.appendChild(
    renderer.domElement
);


// =====================================================
// 4. ORBIT CONTROLS
// =====================================================

const controls =
    new OrbitControls(
        camera,
        renderer.domElement
    );


controls.enableDamping =
    true;


controls.dampingFactor =
    0.06;


controls.enableZoom =
    true;


controls.enablePan =
    true;


// =====================================================
// 5. MATERIALS
// =====================================================

const wallMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x9a7749
    });


const wallSideMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x87663d
    });


const roofMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x4e3027
    });


const floorMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x777777
    });


const floorTopMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x8a8a8a
    });


const columnMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x795b38
    });


const doorMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x24282b
    });


const glassMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x7fb4c7
    });


const rackMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x292929
    });


const shelfMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x494949
    });


const boxMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xb98445
    });


const stairMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x626262
    });


const railingMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x383838
    });


const solarMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x454545
    });


const insulationMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xe6c85b,
        transparent: true,
        opacity: 0.55
    });


const ventMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x252525
    });


const edgeMaterial =
    new THREE.LineBasicMaterial({
        color: 0x161616
    });


// =====================================================
// 6. GROUPS
// =====================================================

let buildingGroup =
    new THREE.Group();


scene.add(
    buildingGroup
);


let frontWallGroup =
    new THREE.Group();


buildingGroup.add(
    frontWallGroup
);


let interiorGroup =
    new THREE.Group();


buildingGroup.add(
    interiorGroup
);


let roofGroup =
    new THREE.Group();


buildingGroup.add(
    roofGroup
);


// =====================================================
// 7. ADD BOX
// =====================================================

function addBox(
    group,
    geometry,
    material,
    x,
    y,
    z,
    rotationX = 0,
    rotationY = 0,
    rotationZ = 0,
    edges = true
) {

    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );


    mesh.position.set(
        x,
        y,
        z
    );


    mesh.rotation.set(
        rotationX,
        rotationY,
        rotationZ
    );


    group.add(
        mesh
    );


    if (edges) {

        const edgeGeometry =
            new THREE.EdgesGeometry(
                geometry
            );


        const edge =
            new THREE.LineSegments(
                edgeGeometry,
                edgeMaterial
            );


        edge.position.copy(
            mesh.position
        );


        edge.rotation.copy(
            mesh.rotation
        );


        group.add(
            edge
        );
    }


    return mesh;
}


// =====================================================
// 8. BUILDING BASE
// =====================================================

function createBase(
    length,
    width
) {

    const geometry =
        new THREE.BoxGeometry(
            length + 0.6,
            0.22,
            width + 0.6
        );


    addBox(
        buildingGroup,
        geometry,
        floorMaterial,
        0,
        -0.11,
        0
    );
}


// =====================================================
// 9. FLOOR SLAB
// =====================================================

function createFloorSlab(
    length,
    width,
    y
) {

    const geometry =
        new THREE.BoxGeometry(
            length,
            0.18,
            width
        );


    addBox(
        buildingGroup,
        geometry,
        floorTopMaterial,
        0,
        y,
        0
    );
}


// =====================================================
// 10. SIDE WALLS
// =====================================================

function createSideWalls(
    length,
    width,
    totalHeight
) {

    const thickness =
        0.28;


    // LEFT WALL

    const leftGeometry =
        new THREE.BoxGeometry(
            thickness,
            totalHeight,
            width
        );


    addBox(
        buildingGroup,
        leftGeometry,
        wallSideMaterial,
        -length / 2,
        totalHeight / 2,
        0
    );


    // RIGHT WALL

    const rightGeometry =
        new THREE.BoxGeometry(
            thickness,
            totalHeight,
            width
        );


    addBox(
        buildingGroup,
        rightGeometry,
        wallSideMaterial,
        length / 2,
        totalHeight / 2,
        0
    );
}


// =====================================================
// 11. BACK WALL
// =====================================================

function createBackWall(
    length,
    totalHeight
) {

    const geometry =
        new THREE.BoxGeometry(
            length,
            totalHeight,
            0.28
        );


    addBox(
        buildingGroup,
        geometry,
        wallMaterial,
        0,
        totalHeight / 2,
        0
    );


    // Solar wall section

    const solarGeometry =
        new THREE.BoxGeometry(
            length * 0.50,
            totalHeight * 0.72,
            0.10
        );


    addBox(
        buildingGroup,
        solarGeometry,
        solarMaterial,
        0,
        totalHeight * 0.46,
        0.18
    );
}


// =====================================================
// 12. FRONT COLUMNS
// =====================================================

function createFrontColumns(
    length,
    width,
    totalHeight
) {

    const thickness =
        0.35;


    const positions = [

        -length / 2,

        -length * 0.22,

        length * 0.22,

        length / 2

    ];


    positions.forEach(
        x => {

            const geometry =
                new THREE.BoxGeometry(
                    thickness,
                    totalHeight,
                    thickness
                );


            addBox(
                buildingGroup,
                geometry,
                columnMaterial,
                x,
                totalHeight / 2,
                width / 2
            );

        }
    );
}


// =====================================================
// 13. FRONT CLOSED WALL
// =====================================================

function createFrontWall(
    length,
    width,
    totalHeight
) {

    const thickness =
        0.22;


    // Main front wall

    const geometry =
        new THREE.BoxGeometry(
            length,
            totalHeight,
            thickness
        );


    addBox(
        frontWallGroup,
        geometry,
        wallMaterial,
        0,
        totalHeight / 2,
        width / 2
    );


    // Large storage entrance

    const entranceGeometry =
        new THREE.BoxGeometry(
            length * 0.40,
            totalHeight * 0.48,
            0.08
        );


    addBox(
        frontWallGroup,
        entranceGeometry,
        doorMaterial,
        -length * 0.16,
        totalHeight * 0.24,
        width / 2 + 0.13
    );


    // Personnel door

    const doorGeometry =
        new THREE.BoxGeometry(
            1.0,
            2.2,
            0.08
        );


    addBox(
        frontWallGroup,
        doorGeometry,
        doorMaterial,
        length * 0.25,
        1.1,
        width / 2 + 0.15
    );


    // Front windows

    createFrontWindow(
        length * 0.22,
        totalHeight * 0.72,
        width
    );


    createFrontWindow(
        length * 0.40,
        totalHeight * 0.72,
        width
    );
}


// =====================================================
// 14. FRONT WINDOWS
// =====================================================

function createFrontWindow(
    x,
    y,
    width
) {

    const geometry =
        new THREE.BoxGeometry(
            1.25,
            0.85,
            0.08
        );


    addBox(
        frontWallGroup,
        geometry,
        glassMaterial,
        x,
        y,
        width / 2 + 0.15
    );
}


// =====================================================
// 15. SIDE WINDOWS
// =====================================================

function createSideWindows(
    length,
    width,
    totalHeight
) {

    const geometry =
        new THREE.BoxGeometry(
            0.08,
            0.85,
            1.25
        );


    const y1 =
        totalHeight * 0.72;


    const y2 =
        totalHeight * 0.42;


    // RIGHT SIDE WINDOWS

    addBox(
        buildingGroup,
        geometry,
        glassMaterial,
        length / 2 + 0.15,
        y1,
        -width * 0.22
    );


    addBox(
        buildingGroup,
        geometry,
        glassMaterial,
        length / 2 + 0.15,
        y1,
        width * 0.20
    );


    addBox(
        buildingGroup,
        geometry,
        glassMaterial,
        length / 2 + 0.15,
        y2,
        -width * 0.22
    );


    addBox(
        buildingGroup,
        geometry,
        glassMaterial,
        length / 2 + 0.15,
        y2,
        width * 0.20
    );
}


// =====================================================
// 16. VENTILATION
// =====================================================

function createVentilation(
    length,
    width,
    totalHeight
) {

    const geometry =
        new THREE.BoxGeometry(
            0.85,
            0.42,
            0.08
        );


    // Front upper vents

    for (
        let i = -1;
        i <= 1;
        i++
    ) {

        addBox(
            buildingGroup,
            geometry,
            ventMaterial,
            i * length * 0.25,
            totalHeight * 0.88,
            width / 2 + 0.16
        );
    }


    // Side vents

    const sideGeometry =
        new THREE.BoxGeometry(
            0.08,
            0.42,
            0.85
        );


    addBox(
        buildingGroup,
        sideGeometry,
        ventMaterial,
        length / 2 + 0.16,
        totalHeight * 0.88,
        -width * 0.25
    );


    addBox(
        buildingGroup,
        sideGeometry,
        ventMaterial,
        length / 2 + 0.16,
        totalHeight * 0.88,
        width * 0.25
    );
}


// =====================================================
// 17. INSULATION VISUALIZATION
// =====================================================

function createInsulation(
    length,
    width,
    totalHeight
) {

    const geometry =
        new THREE.BoxGeometry(
            length - 0.5,
            totalHeight - 0.5,
            0.08
        );


    addBox(
        interiorGroup,
        geometry,
        insulationMaterial,
        0,
        totalHeight / 2,
        -width / 2 + 0.20,
        0,
        0,
        0,
        false
    );
}


// =====================================================
// 18. STORAGE RACK
// =====================================================

function createRack(
    x,
    y,
    z,
    rackWidth,
    rackHeight,
    rackDepth
) {

    const postThickness =
        0.10;


    const postGeometry =
        new THREE.BoxGeometry(
            postThickness,
            rackHeight,
            postThickness
        );


    const postPositions = [

        [
            x - rackWidth / 2,
            y + rackHeight / 2,
            z - rackDepth / 2
        ],

        [
            x + rackWidth / 2,
            y + rackHeight / 2,
            z - rackDepth / 2
        ],

        [
            x - rackWidth / 2,
            y + rackHeight / 2,
            z + rackDepth / 2
        ],

        [
            x + rackWidth / 2,
            y + rackHeight / 2,
            z + rackDepth / 2
        ]

    ];


    postPositions.forEach(
        p => {

            addBox(
                interiorGroup,
                postGeometry,
                rackMaterial,
                p[0],
                p[1],
                p[2]
            );

        }
    );


    // Shelves

    const shelfGeometry =
        new THREE.BoxGeometry(
            rackWidth,
            0.12,
            rackDepth
        );


    const shelfCount =
        4;


    for (
        let i = 0;
        i < shelfCount;
        i++
    ) {

        const shelfY =
            y +
            0.30 +
            i *
            (
                (rackHeight - 0.30) /
                (shelfCount - 1)
            );


        addBox(
            interiorGroup,
            shelfGeometry,
            shelfMaterial,
            x,
            shelfY,
            z
        );


        // Storage boxes

        for (
            let b = 0;
            b < 2;
            b++
        ) {

            const boxGeometry =
                new THREE.BoxGeometry(
                    rackWidth * 0.30,
                    0.28,
                    rackDepth * 0.55
                );


            addBox(
                interiorGroup,
                boxGeometry,
                boxMaterial,
                x -
                rackWidth * 0.18 +
                b *
                rackWidth * 0.35,
                shelfY + 0.20,
                z
            );
        }
    }
}


// =====================================================
// 19. CREATE GROUND FLOOR RACKS
// =====================================================

function createGroundRacks(
    length,
    width,
    groundHeight
) {

    createRack(
        -length * 0.30,
        0,
        -width * 0.18,
        length * 0.24,
        groundHeight * 0.78,
        width * 0.25
    );


    createRack(
        0,
        0,
        -width * 0.18,
        length * 0.24,
        groundHeight * 0.78,
        width * 0.25
    );


    createRack(
        length * 0.30,
        0,
        -width * 0.18,
        length * 0.24,
        groundHeight * 0.78,
        width * 0.25
    );
}


// =====================================================
// 20. CREATE FIRST FLOOR RACKS
// =====================================================

function createFirstFloorRacks(
    length,
    width,
    groundHeight,
    firstHeight
) {

    createRack(
        -length * 0.30,
        groundHeight + 0.18,
        -width * 0.18,
        length * 0.24,
        firstHeight * 0.78,
        width * 0.25
    );


    createRack(
        0,
        groundHeight + 0.18,
        -width * 0.18,
        length * 0.24,
        firstHeight * 0.78,
        width * 0.25
    );


    createRack(
        length * 0.30,
        groundHeight + 0.18,
        -width * 0.18,
        length * 0.24,
        firstHeight * 0.78,
        width * 0.25
    );
}


// =====================================================
// 21. STAIRS
// =====================================================

function createStairs(
    length,
    width,
    groundHeight
) {

    const stepCount =
        12;


    const stepHeight =
        groundHeight /
        stepCount;


    const stepDepth =
        0.30;


    const stairWidth =
        1.20;


    for (
        let i = 0;
        i < stepCount;
        i++
    ) {

        const geometry =
            new THREE.BoxGeometry(
                stairWidth,
                stepHeight,
                stepDepth
            );


        addBox(
            interiorGroup,
            geometry,
            stairMaterial,
            length * 0.35,
            stepHeight * i +
            stepHeight / 2,
            width * 0.22 -
            i * stepDepth
        );
    }
}


// =====================================================
// 22. FIRST FLOOR RAILING
// =====================================================

function createRailing(
    length,
    width,
    groundHeight
) {

    const railHeight =
        1.0;


    const railingY =
        groundHeight +
        railHeight;


    // Front horizontal rail

    const horizontalGeometry =
        new THREE.BoxGeometry(
            length * 0.68,
            0.10,
            0.10
        );


    addBox(
        interiorGroup,
        horizontalGeometry,
        railingMaterial,
        -length * 0.10,
        railingY,
        width * 0.22
    );


    // Lower rail

    addBox(
        interiorGroup,
        horizontalGeometry,
        railingMaterial,
        -length * 0.10,
        groundHeight + 0.45,
        width * 0.22
    );


    // Vertical rail posts

    const postGeometry =
        new THREE.BoxGeometry(
            0.08,
            railHeight,
            0.08
        );


    for (
        let i = -4;
        i <= 4;
        i++
    ) {

        addBox(
            interiorGroup,
            postGeometry,
            railingMaterial,
            -length * 0.10 +
            i * 0.55,
            groundHeight +
            railHeight / 2,
            width * 0.22
        );
    }
}


// =====================================================
// 23. ROOF
// =====================================================

function createRoof(
    length,
    width,
    totalHeight
) {

    const thickness =
        0.28;


    const roofAngle =
        0.36;


    const roofLength =
        width / 2 + 0.55;


    const roofGeometry =
        new THREE.BoxGeometry(
            length + 0.60,
            thickness,
            roofLength
        );


    // Left roof

    addBox(
        roofGroup,
        roofGeometry,
        roofMaterial,
        0,
        totalHeight + 0.30,
        -width / 4,
        roofAngle,
        0,
        0
    );


    // Right roof

    const roofGeometry2 =
        new THREE.BoxGeometry(
            length + 0.60,
            thickness,
            roofLength
        );


    addBox(
        roofGroup,
        roofGeometry2,
        roofMaterial,
        0,
        totalHeight + 0.30,
        width / 4,
        -roofAngle,
        0,
        0
    );
}


// =====================================================
// 24. ROOF SUPPORT / GABLE
// =====================================================

function createGable(
    length,
    width,
    totalHeight
) {

    // Gable triangle represented by two beams

    const beamGeometry =
        new THREE.BoxGeometry(
            length,
            0.18,
            0.18
        );


    addBox(
        roofGroup,
        beamGeometry,
        roofMaterial,
        0,
        totalHeight + 0.12,
        -width / 2
    );


    addBox(
        roofGroup,
        beamGeometry,
        roofMaterial,
        0,
        totalHeight + 0.12,
        width / 2
    );
}


// =====================================================
// 25. BUILD COMPLETE FACILITY
// =====================================================

function createBuilding(
    length,
    width,
    groundHeight,
    firstHeight
) {

    // Clear previous

    scene.remove(
        buildingGroup
    );


    buildingGroup =
        new THREE.Group();


    scene.add(
        buildingGroup
    );


    frontWallGroup =
        new THREE.Group();


    interiorGroup =
        new THREE.Group();


    roofGroup =
        new THREE.Group();


    buildingGroup.add(
        frontWallGroup
    );


    buildingGroup.add(
        interiorGroup
    );


    buildingGroup.add(
        roofGroup
    );


    const totalHeight =
        groundHeight +
        firstHeight;


    // Base

    createBase(
        length,
        width
    );


    // Ground floor

    createFloorSlab(
        length,
        width,
        0.05
    );


    // First floor slab

    createFloorSlab(
        length,
        width,
        groundHeight
    );


    // Side walls

    createSideWalls(
        length,
        width,
        totalHeight
    );


    // Back wall

    createBackWall(
        length,
        totalHeight
    );


    // Front columns

    createFrontColumns(
        length,
        width,
        totalHeight
    );


    // Front closed wall

    createFrontWall(
        length,
        width,
        totalHeight
    );


    // Windows

    createSideWindows(
        length,
        width,
        totalHeight
    );


    // Ventilation

    createVentilation(
        length,
        width,
        totalHeight
    );


    // Insulation

    createInsulation(
        length,
        width,
        totalHeight
    );


    // Ground racks

    createGroundRacks(
        length,
        width,
        groundHeight
    );


    // First floor racks

    createFirstFloorRacks(
        length,
        width,
        groundHeight,
        firstHeight
    );


    // Stairs

    createStairs(
        length,
        width,
        groundHeight
    );


    // Railing

    createRailing(
        length,
        width,
        groundHeight
    );


    // Roof

    createRoof(
        length,
        width,
        totalHeight
    );


    // Gable

    createGable(
        length,
        width,
        totalHeight
    );


    // Camera

    const largest =
        Math.max(
            length,
            width,
            totalHeight
        );


    camera.position.set(
        largest * 1.45,
        largest * 0.95,
        largest * 1.55
    );


    controls.target.set(
        0,
        totalHeight * 0.48,
        0
    );


    controls.update();
}


// =====================================================
// 26. GEOMETRY CALCULATION
// =====================================================

function calculateGeometry(
    length,
    width,
    groundHeight,
    firstHeight
) {

    const groundArea =
        length *
        width;


    const firstArea =
        length *
        width;


    const totalHeight =
        groundHeight +
        firstHeight;


    const perimeter =
        2 *
        (length + width);


    const wallArea =
        perimeter *
        totalHeight;


    // Roof slope

    const roofSlope =
        0.36;


    const slopeFactor =
        Math.sqrt(
            1 +
            Math.pow(
                roofSlope,
                2
            )
        );


    const roofArea =
        length *
        width *
        slopeFactor;


    const totalSurfaceArea =
        groundArea +
        firstArea +
        wallArea +
        roofArea;


    const volume =
        length *
        width *
        totalHeight;


    return {

        groundArea,

        firstArea,

        wallArea,

        roofArea,

        totalSurfaceArea,

        volume
    };
}


// =====================================================
// 27. DISPLAY GEOMETRY
// =====================================================

function displayGeometry(
    values
) {

    document.getElementById(
        "groundArea"
    ).textContent =
        values.groundArea.toFixed(2);


    document.getElementById(
        "firstArea"
    ).textContent =
        values.firstArea.toFixed(2);


    document.getElementById(
        "wallArea"
    ).textContent =
        values.wallArea.toFixed(2);


    document.getElementById(
        "roofArea"
    ).textContent =
        values.roofArea.toFixed(2);


    document.getElementById(
        "surfaceArea"
    ).textContent =
        values.totalSurfaceArea.toFixed(2);


    document.getElementById(
        "volume"
    ).textContent =
        values.volume.toFixed(2);
}


// =====================================================
// 28. SOLAR GAIN ESTIMATION
// =====================================================

function updateSolarGain(
    length,
    width
) {

    const solarWallArea =
        length *
        0.50;


    const estimatedGain =
        solarWallArea *
        0.727;


    document.getElementById(
        "solarGain"
    ).textContent =
        estimatedGain.toFixed(2) +
        " kWh/day";
}


// =====================================================
// 29. SIMULATED TEMPERATURE / HUMIDITY
// =====================================================

let temperature =
    24.6;


let humidity =
    54;


function updateEnvironment() {

    temperature +=
        (Math.random() - 0.5) *
        0.12;


    humidity +=
        (Math.random() - 0.5) *
        0.30;


    temperature =
        Math.max(
            18,
            Math.min(
                32,
                temperature
            )
        );


    humidity =
        Math.max(
            35,
            Math.min(
                70,
                humidity
            )
        );


    document.getElementById(
        "temperature"
    ).textContent =
        temperature.toFixed(1) +
        " °C";


    document.getElementById(
        "humidity"
    ).textContent =
        humidity.toFixed(0) +
        " %";


    const status =
        document.getElementById(
            "storageStatus"
        );


    const note =
        document.getElementById(
            "statusNote"
        );


    if (
        temperature >= 20 &&
        temperature <= 28 &&
        humidity >= 40 &&
        humidity <= 60
    ) {

        status.textContent =
            "GOOD";


        status.className =
            "dashboard-value good";


        note.textContent =
            "Conditions are optimal";

    }

    else {

        status.textContent =
            "CHECK";


        status.className =
            "dashboard-value warning";


        note.textContent =
            "Environmental conditions need attention";
    }
}


// =====================================================
// 30. OPEN / CLOSE FRONT WALL
// =====================================================

let frontIsOpen =
    false;


function openFrontWall() {

    frontIsOpen =
        true;


    frontWallGroup.visible =
        false;


    document.getElementById(
        "wallStatus"
    ).textContent =
        "🔓 Front wall is open — interior visible";


    // Move camera slightly forward

    const target =
        controls.target;


    camera.position.set(
        camera.position.x,
        camera.position.y,
        Math.abs(camera.position.z) +
        2
    );


    controls.target.set(
        target.x,
        target.y,
        target.z
    );


    controls.update();
}


function closeFrontWall() {

    frontIsOpen =
        false;


    frontWallGroup.visible =
        true;


    document.getElementById(
        "wallStatus"
    ).textContent =
        "🔒 Wall is closed";


    controls.update();
}


// =====================================================
// 31. INTERIOR VIEW
// =====================================================

function showInteriorView() {

    openFrontWall();


    camera.position.set(
        15,
        7.5,
        17
    );


    controls.target.set(
        0,
        3,
        0
    );


    controls.update();
}


// =====================================================
// 32. EXTERIOR VIEW
// =====================================================

function showExteriorView() {

    closeFrontWall();


    camera.position.set(
        17,
        10,
        18
    );


    controls.target.set(
        0,
        3,
        0
    );


    controls.update();
}


// =====================================================
// 33. INITIAL BUILDING
// =====================================================

let currentLength =
    12;


let currentWidth =
    8;


let currentGroundHeight =
    3;


let currentFirstHeight =
    3;


createBuilding(
    currentLength,
    currentWidth,
    currentGroundHeight,
    currentFirstHeight
);


displayGeometry(
    calculateGeometry(
        currentLength,
        currentWidth,
        currentGroundHeight,
        currentFirstHeight
    )
);


updateSolarGain(
    currentLength,
    currentWidth
);


// =====================================================
// 34. UPDATE BUILDING BUTTON
// =====================================================

document.getElementById(
    "createButton"
).addEventListener(
    "click",
    function () {

        const length =
            Number(
                document.getElementById(
                    "length"
                ).value
            );


        const width =
            Number(
                document.getElementById(
                    "width"
                ).value
            );


        const groundHeight =
            Number(
                document.getElementById(
                    "groundHeight"
                ).value
            );


        const firstHeight =
            Number(
                document.getElementById(
                    "firstHeight"
                ).value
            );


        if (
            length <= 0 ||
            width <= 0 ||
            groundHeight <= 0 ||
            firstHeight <= 0
        ) {

            alert(
                "Please enter valid dimensions."
            );

            return;
        }


        currentLength =
            length;


        currentWidth =
            width;


        currentGroundHeight =
            groundHeight;


        currentFirstHeight =
            firstHeight;


        createBuilding(
            length,
            width,
            groundHeight,
            firstHeight
        );


        displayGeometry(
            calculateGeometry(
                length,
                width,
                groundHeight,
                firstHeight
            )
        );


        updateSolarGain(
            length,
            width
        );


        frontIsOpen =
            false;


        document.getElementById(
            "wallStatus"
        ).textContent =
            "🔒 Wall is closed";
    }
);


// =====================================================
// 35. OPEN BUTTON
// =====================================================

document.getElementById(
    "openButton"
).addEventListener(
    "click",
    openFrontWall
);


// =====================================================
// 36. CLOSE BUTTON
// =====================================================

document.getElementById(
    "closeButton"
).addEventListener(
    "click",
    closeFrontWall
);


// =====================================================
// 37. INTERIOR VIEW BUTTON
// =====================================================

document.getElementById(
    "interiorButton"
).addEventListener(
    "click",
    showInteriorView
);


// =====================================================
// 38. EXTERIOR VIEW BUTTON
// =====================================================

document.getElementById(
    "exteriorButton"
).addEventListener(
    "click",
    showExteriorView
);


// =====================================================
// 39. RESET BUTTON
// =====================================================

document.getElementById(
    "resetButton"
).addEventListener(
    "click",
    function () {

        document.getElementById(
            "length"
        ).value = 12;


        document.getElementById(
            "width"
        ).value = 8;


        document.getElementById(
            "groundHeight"
        ).value = 3;


        document.getElementById(
            "firstHeight"
        ).value = 3;


        currentLength =
            12;


        currentWidth =
            8;


        currentGroundHeight =
            3;


        currentFirstHeight =
            3;


        createBuilding(
            12,
            8,
            3,
            3
        );


        displayGeometry(
            calculateGeometry(
                12,
                8,
                3,
                3
            )
        );


        updateSolarGain(
            12,
            8
        );


        showExteriorView();
    }
);


// =====================================================
// 40. ENVIRONMENT UPDATE
// =====================================================

setInterval(
    updateEnvironment,
    2000
);


// =====================================================
// 41. ANIMATION
// =====================================================

function animate() {

    requestAnimationFrame(
        animate
    );


    controls.update();


    renderer.render(
        scene,
        camera
    );
}


animate();


// =====================================================
// 42. WINDOW RESIZE
// =====================================================

window.addEventListener(
    "resize",
    function () {

        const width =
            container.clientWidth;


        const height =
            container.clientHeight;


        camera.aspect =
            width / height;


        camera.updateProjectionMatrix();


        renderer.setSize(
            width,
            height
        );

    }
);
import * as THREE from "three"

export function createCanalHouses(side: "left" | "right"): THREE.Group {
  const houses = new THREE.Group()

  // Number of houses to create
  const numHouses = 50
  let currentZ = 0 // Track current position for next house

  // Colors typical for Amsterdam canal houses
  const houseColors = [
    0xa52a2a, // Brown
    0x800000, // Maroon
    0x8b4513, // SaddleBrown
    0xd2691e, // Chocolate
    0xb22222, // Firebrick
    0xbdb76b, // DarkKhaki
    0x4b0082, // Indigo
    0x2f4f4f, // DarkSlateGray
  ]

  // Window color
  const windowColor = 0xe8f1f2

  // Create houses along the canal
  for (let i = 0; i < numHouses; i++) {
    const houseGroup = new THREE.Group() // Create a group for each house

    const isCornerHouse = Math.random() < 0.2
    const houseWidth = 2 + Math.random() * 1 // Vary width between 2-3 units
    const houseDepth = isCornerHouse ? 3 + Math.random() * 1 : 2 + Math.random() * 0.5
    const houseHeight = 5 + Math.random() * 2

    // Base house structure
    const houseGeometry = new THREE.BoxGeometry(
      houseDepth, // Swap width and depth
      houseHeight,
      houseWidth
    )
    const houseMaterial = new THREE.MeshStandardMaterial({
      color: houseColors[Math.floor(Math.random() * houseColors.length)],
      roughness: 0.7,
      metalness: 0.1,
    })

    const house = new THREE.Mesh(houseGeometry, houseMaterial)
    house.position.y = houseHeight / 2
    house.castShadow = true
    house.receiveShadow = true

    // Create gabled roof
    const roofHeight = 1 + Math.random() * 0.5

    const roofGeometry = new THREE.ConeGeometry(
      houseDepth / 2 + 0.1, // Use depth for roof width since house is rotated
      roofHeight,
      4
    )
    roofGeometry.rotateY(Math.PI / 4)

    const roofMaterial = new THREE.MeshStandardMaterial({
      color: 0x121212,
      roughness: 0.5,
      metalness: 0.3,
    })

    const roof = new THREE.Mesh(roofGeometry, roofMaterial)
    roof.position.y = houseHeight + roofHeight / 2
    roof.castShadow = true

    // Create windows (multiple rows and columns)
    const windowGroup = new THREE.Group()
    const windowSize = 0.4
    const windowDepth = 0.05
    const windowGeometry = new THREE.BoxGeometry(windowSize, windowSize, windowDepth)
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: windowColor,
      roughness: 0.1,
      metalness: 0.9,
      emissive: new THREE.Color(0xffffaa),
      emissiveIntensity: Math.random() < 0.3 ? 0.5 : 0,
    })

    // Number of windows
    const numRowsWindows = Math.floor(houseHeight / 1.2)
    const numColsWindows = Math.floor(houseWidth / 0.6)

    // Create windows on front (facing water) and back
    for (let row = 0; row < numRowsWindows; row++) {
      for (let col = 0; col < numColsWindows; col++) {
        // Front windows (facing water)
        const windowFront = new THREE.Mesh(windowGeometry, windowMaterial.clone())
        windowFront.position.z = (col - (numColsWindows - 1) / 2) * 0.6
        windowFront.position.y = (row - (numRowsWindows - 1) / 2) * 1.2 + houseHeight / 2
        windowFront.position.x = houseDepth / 2 + windowDepth / 2
        windowFront.rotation.y = Math.PI / 2

        // Back windows
        const windowBack = windowFront.clone()
        windowBack.position.x = -houseDepth / 2 - windowDepth / 2

        windowGroup.add(windowFront)
        windowGroup.add(windowBack)
      }
    }

    // Create a door
    const doorWidth = 0.8
    const doorHeight = 1.8
    const doorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, windowDepth)
    const doorMaterial = new THREE.MeshStandardMaterial({
      color: 0x4d2608,
      roughness: 0.8,
      metalness: 0.2,
    })

    const door = new THREE.Mesh(doorGeometry, doorMaterial)
    door.position.y = doorHeight / 2
    door.position.x = houseDepth / 2 + windowDepth / 2
    door.position.z = (Math.random() - 0.5) * (houseWidth - doorWidth - 0.2)
    door.rotation.y = Math.PI / 2

    // Add all elements to house group
    houseGroup.add(house)
    houseGroup.add(windowGroup)
    houseGroup.add(door)
    houseGroup.add(roof)

    // Optional architectural details like hook beams
    if (Math.random() < 0.7) {
      const beam = createHookBeam()
      beam.position.y = houseHeight - 0.5
      beam.position.x = houseDepth / 2 + 0.3 // Move beam to front
      beam.rotation.y = Math.PI / 2
      houseGroup.add(beam)
    }

    // Position the entire house group
    houseGroup.position.z = currentZ + houseWidth / 2
    houses.add(houseGroup)

    // Update currentZ for next house
    currentZ += houseWidth
  }

  // No need to rotate the entire group anymore, houses are already facing the water
  if (side === "right") {
    houses.scale.x = -1 // Mirror the houses instead of rotating
  }

  return houses
}

// Helper function to create hook beam
function createHookBeam(): THREE.Group {
  const beam = new THREE.Group()

  const beamGeometry = new THREE.BoxGeometry(0.8, 0.15, 0.6)
  const beamMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.7,
    metalness: 0.1,
  })

  const beamMesh = new THREE.Mesh(beamGeometry, beamMaterial)
  beamMesh.castShadow = true

  const hookGeometry = new THREE.TorusGeometry(0.15, 0.03, 8, 16, Math.PI)
  const hookMaterial = new THREE.MeshStandardMaterial({
    color: 0x303030,
    roughness: 0.5,
    metalness: 0.8,
  })

  const hook = new THREE.Mesh(hookGeometry, hookMaterial)
  hook.rotation.x = Math.PI / 2
  hook.position.y = -0.15
  hook.castShadow = true

  beam.add(beamMesh)
  beam.add(hook)

  return beam
}

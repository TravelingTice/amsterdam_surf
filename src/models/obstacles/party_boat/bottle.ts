import * as THREE from "three"

export function createBottle(): THREE.Group {
  const bottle = new THREE.Group()

  // Create the body of the bottle
  const bottleBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.2, 16),
    new THREE.MeshStandardMaterial({
      color: 0x008000, // Green bottle
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.8,
    })
  )
  bottleBody.position.y = 0.1

  // Create the neck of the bottle
  const bottleNeck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.1, 16),
    new THREE.MeshStandardMaterial({
      color: 0x008000, // Green bottle
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.8,
    })
  )
  bottleNeck.position.y = 0.25

  // Create the cap of the bottle
  const bottleCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.02, 16),
    new THREE.MeshStandardMaterial({
      color: 0xaaaaaa, // Gray cap
      roughness: 0.5,
      metalness: 0.5,
    })
  )
  bottleCap.position.y = 0.35

  bottle.add(bottleBody)
  bottle.add(bottleNeck)
  bottle.add(bottleCap)
  bottle.castShadow = true

  return bottle
}

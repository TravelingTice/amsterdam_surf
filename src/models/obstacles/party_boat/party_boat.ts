import * as THREE from "three"
import { createBoatFlag } from "../../boatflag"

export function createPartyBoat(): THREE.Group {
  const boat = new THREE.Group()

  // Hull
  const hullGeometry = new THREE.BoxGeometry(2, 0.2, 3)
  const hullMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White
    roughness: 0.5,
    metalness: 0.3,
  })
  const hull = new THREE.Mesh(hullGeometry, hullMaterial)
  hull.position.y = 0.3
  hull.castShadow = true
  hull.receiveShadow = true

  // Inside
  const insideGeometry = new THREE.BoxGeometry(1.8, 0.3, 2.8)
  const insideMaterial = new THREE.MeshStandardMaterial({
    color: 0x9c9c9c, // Gray
    roughness: 0.5,
    metalness: 0.3,
  })
  const inside = new THREE.Mesh(insideGeometry, insideMaterial)
  inside.position.y = 0.4
  inside.castShadow = true
  inside.receiveShadow = true

  // Add side barrier
  const sideBarrier1Geometry = new THREE.BoxGeometry(0.2, 0.5, 3)
  const sideBarrier1Material = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White
    roughness: 0.5,
    metalness: 0.3,
  })
  const sideBarrier1 = new THREE.Mesh(sideBarrier1Geometry, sideBarrier1Material)
  sideBarrier1.position.set(0.9, 0.45, 0)
  sideBarrier1.castShadow = true
  sideBarrier1.receiveShadow = true

  boat.add(sideBarrier1)

  // Add side barrier
  const sideBarrier2Geometry = new THREE.BoxGeometry(0.2, 0.5, 3)
  const sideBarrier2Material = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White
    roughness: 0.5,
    metalness: 0.3,
  })
  const sideBarrier2 = new THREE.Mesh(sideBarrier2Geometry, sideBarrier2Material)
  sideBarrier2.position.set(-0.9, 0.45, 0)
  sideBarrier2.castShadow = true
  sideBarrier2.receiveShadow = true

  boat.add(sideBarrier2)

  // Add front barrier
  const frontBarrierGeometry = new THREE.BoxGeometry(2, 0.5, 0.2)
  const frontBarrierMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White
    roughness: 0.5,
    metalness: 0.3,
  })
  const frontBarrier = new THREE.Mesh(frontBarrierGeometry, frontBarrierMaterial)
  frontBarrier.position.set(0, 0.45, 1.5)
  frontBarrier.castShadow = true
  frontBarrier.receiveShadow = true

  boat.add(frontBarrier)

  // Add back barrier
  const backBarrierGeometry = new THREE.BoxGeometry(2, 0.5, 0.2)
  const backBarrierMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White
    roughness: 0.5,
    metalness: 0.3,
  })
  const backBarrier = new THREE.Mesh(backBarrierGeometry, backBarrierMaterial)
  backBarrier.position.set(0, 0.45, -1.5)
  backBarrier.castShadow = true
  backBarrier.receiveShadow = true

  boat.add(backBarrier)

  const boatFlag = createBoatFlag()
  boatFlag.position.set(0, 0.45, 1.5)
  boat.add(boatFlag)

  // Add several people (simplified)
  const numPeople = 4 + Math.floor(Math.random() * 4) // 4-7 people
  const personColor = 0xffa500 // Orange color for all people

  for (let i = 0; i < numPeople; i++) {
    // Body (simplified as a box)
    const bodyGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.3)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: personColor, // Use fixed orange color
      roughness: 0.9,
      metalness: 0.1,
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)

    // Head (simplified as a sphere)
    const headGeometry = new THREE.SphereGeometry(0.15, 8, 8)
    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd6c4, // Skin tone
      roughness: 0.9,
      metalness: 0.1,
    })
    const head = new THREE.Mesh(headGeometry, headMaterial)
    head.position.y = 0.3

    // Create person
    const person = new THREE.Group()
    person.add(body)
    person.add(head)

    // Position randomly in boat
    const x = (Math.random() - 0.5) * 1.5
    const z = (Math.random() - 0.5) * 2.5
    person.position.set(x, 0.6, z)

    boat.add(person)
  }

  boat.add(hull)
  boat.add(inside)

  for (let i = 0; i < 3; i++) {
    const bottle = new THREE.Group()

    // Create the body of the bottle
    const bottleBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.2, 16), // Bigger and more segments for smoother appearance
      new THREE.MeshStandardMaterial({
        color: 0x008000, // Green bottle
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.8,
      })
    )
    bottleBody.position.y = 0.1 // Position the body correctly

    // Create the neck of the bottle
    const bottleNeck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.1, 16), // Smaller neck
      new THREE.MeshStandardMaterial({
        color: 0x008000, // Green bottle
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.8,
      })
    )
    bottleNeck.position.y = 0.25 // Position the neck correctly

    // Create the cap of the bottle
    const bottleCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.02, 16), // Cap slightly larger than neck
      new THREE.MeshStandardMaterial({
        color: 0xaaaaaa, // Gray cap
        roughness: 0.5,
        metalness: 0.5,
      })
    )
    bottleCap.position.y = 0.35 // Position the cap correctly

    // Add all parts to the bottle group
    bottle.add(bottleBody)
    bottle.add(bottleNeck)
    bottle.add(bottleCap)

    const x = (Math.random() - 0.5) * 1.5
    const z = (Math.random() - 0.5) * 2.5
    bottle.position.set(x, 0.6, z)
    bottle.castShadow = true

    boat.add(bottle)
  }

  return boat
}

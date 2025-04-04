import * as THREE from "three"
import { createBottle } from "./party_boat/bottle"

export function createStudent(): THREE.Group {
  const student = new THREE.Group()

  // Body
  const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.8, 8)
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xffa500, // Orange
    roughness: 0.9,
    metalness: 0.1,
  })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  body.position.y = -0.1
  body.castShadow = true

  // Head
  const headGeometry = new THREE.SphereGeometry(0.2, 16, 16)
  const headMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd6c4, // Skin tone
    roughness: 0.9,
    metalness: 0.1,
  })
  const head = new THREE.Mesh(headGeometry, headMaterial)
  head.position.y = 0.5
  head.castShadow = true

  // Arms
  const armGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.7, 8)
  const armMaterial = bodyMaterial

  // Left arm
  const leftArm = new THREE.Mesh(armGeometry, armMaterial)
  leftArm.position.set(0.3, 0.0, 0)
  leftArm.rotation.z = Math.PI / 6
  leftArm.castShadow = true

  // Right arm
  const rightArm = new THREE.Mesh(armGeometry, armMaterial)
  rightArm.position.set(-0.3, 0.0, 0)
  rightArm.rotation.z = -Math.PI / 6
  rightArm.castShadow = true

  // Legs
  const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8)
  const legMaterial = new THREE.MeshStandardMaterial({
    color: 0x1560bd, // Blue jeans
    roughness: 0.9,
    metalness: 0.1,
  })

  // Left leg
  const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
  leftLeg.position.set(0.15, -0.7, 0)
  leftLeg.castShadow = true

  // Right leg
  const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
  rightLeg.position.set(-0.15, -0.7, 0)
  rightLeg.castShadow = true

  // Add a beer bottle (it's Amsterdam after all)
  const bottle = createBottle()

  bottle.position.set(0.5, -0.2, 0)
  bottle.castShadow = true
  bottle.receiveShadow = true

  student.add(bottle)

  student.add(body)
  student.add(head)
  student.add(leftArm)
  student.add(rightArm)
  student.add(leftLeg)
  student.add(rightLeg)

  // Partially submerged
  student.position.y = -0.4
  student.scale.set(0.9, 0.9, 0.9) // Make slightly smaller to fit in canal
  student.rotation.z = Math.random() / 2 - 0.25

  return student
}

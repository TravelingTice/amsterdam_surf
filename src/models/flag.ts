import * as THREE from "three"

export interface FlagOptions {
  withOrangeRibbon?: boolean
}

export function createFlag(options: FlagOptions = {}): THREE.Group {
  const flagGroup = new THREE.Group()

  // Create the black rod
  const rodGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8)
  const rodMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000, // Black
    roughness: 0.5,
    metalness: 0.3,
  })
  const rod = new THREE.Mesh(rodGeometry, rodMaterial)
  rod.castShadow = true
  rod.receiveShadow = true

  // Position the rod vertically
  rod.position.y = 0.4 // Half the height of the rod

  // Create the flag with a waving effect
  const waveSegments = 8 // Number of segments to create wave effect
  const flagWidth = 0.4
  const flagHeight = 0.08
  const flagDepth = 0.01
  const segmentWidth = flagWidth / waveSegments

  // Create the three color stripes with wave effect
  const colors = [0xae1c28, 0xffffff, 0x21468b] // Red, White, Blue
  const stripes = []

  // Create each colored stripe
  for (let colorIndex = 0; colorIndex < 3; colorIndex++) {
    const stripeGroup = new THREE.Group()
    const yPos = 0.74 - colorIndex * flagHeight

    // Create segments for each stripe to simulate wave
    for (let i = 0; i < waveSegments; i++) {
      const segmentGeometry = new THREE.BoxGeometry(segmentWidth, flagHeight, flagDepth)
      const segmentMaterial = new THREE.MeshStandardMaterial({
        color: colors[colorIndex],
        roughness: 0.7,
        metalness: 0.1,
      })

      const segment = new THREE.Mesh(segmentGeometry, segmentMaterial)

      // Position each segment with progressive wave effect
      const xOffset = i * segmentWidth + segmentWidth / 2
      // Calculate wave amplitude - increases toward the end of the flag
      const waveAmplitude = 0.01 * i
      // Apply sine wave pattern
      const zOffset = Math.sin(i * 0.8) * waveAmplitude

      segment.position.set(xOffset, 0, zOffset)

      // Create a subtle rotation for each segment to enhance wave effect
      segment.rotation.z = Math.sin(i * 0.7) * 0.1
      segment.rotation.x = Math.sin(i * 0.5) * 0.05

      segment.castShadow = true
      segment.receiveShadow = true

      stripeGroup.add(segment)
    }

    stripeGroup.position.y = yPos
    stripeGroup.position.x = 0
    flagGroup.add(stripeGroup)
    stripes.push(stripeGroup)
  }

  // Add orange ribbon if requested
  if (options.withOrangeRibbon) {
    const ribbonGroup = new THREE.Group()
    const ribbonWidth = 0.3
    const ribbonHeight = 0.05
    const ribbonDepth = 0.01

    // Create ribbon segments with a slight wave
    for (let i = 0; i < waveSegments; i++) {
      const segmentGeometry = new THREE.BoxGeometry(segmentWidth * 0.75, ribbonHeight, ribbonDepth)
      const segmentMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6600, // Orange color
        roughness: 0.7,
        metalness: 0.1,
      })

      const segment = new THREE.Mesh(segmentGeometry, segmentMaterial)

      // Position with slight droop effect
      const xOffset = i * (segmentWidth * 0.75) + (segmentWidth * 0.75) / 2
      // Drooping curve
      const yOffset = -Math.sin((i / (waveSegments - 1)) * Math.PI) * 0.02

      segment.position.set(xOffset, yOffset, 0)

      // Add slight rotation for droop effect
      segment.rotation.z = -Math.sin((i / (waveSegments - 1)) * Math.PI) * 0.1

      segment.castShadow = true
      segment.receiveShadow = true

      ribbonGroup.add(segment)
    }

    // Position ribbon below the flag
    ribbonGroup.position.y = 0.5
    ribbonGroup.position.x = 0.05
    flagGroup.add(ribbonGroup)
  }

  // Add the rod to the flag group
  flagGroup.add(rod)

  return flagGroup
}

import * as THREE from "three";

export function createBridge(): THREE.Group {
  const bridge = new THREE.Group();

  // Main bridge structure
  const bridgeWidth = 12; // Wide enough to span all lanes
  const bridgeHeight = 1;
  const bridgeDepth = 4;

  // Bridge deck
  const deckGeometry = new THREE.BoxGeometry(
    bridgeWidth,
    bridgeHeight,
    bridgeDepth
  );
  const deckMaterial = new THREE.MeshStandardMaterial({
    color: 0x424242, // Dark gray
    roughness: 0.8,
    metalness: 0.2,
  });

  const deck = new THREE.Mesh(deckGeometry, deckMaterial);
  deck.position.y = 2; // Lower from 3 to 2
  deck.castShadow = true;
  deck.receiveShadow = true;

  // Bridge supports - stone arches
  const archGeometry = new THREE.CylinderGeometry(
    bridgeDepth / 2,
    bridgeDepth / 2,
    bridgeWidth,
    16,
    1,
    true,
    Math.PI / 2,
    Math.PI
  );
  archGeometry.rotateZ(Math.PI / 2);

  const archMaterial = new THREE.MeshStandardMaterial({
    color: 0x8d8d8d, // Stone color
    roughness: 0.9,
    metalness: 0.1,
  });

  const arch = new THREE.Mesh(archGeometry, archMaterial);
  arch.position.y = 1; // Lower from 1.5 to 1
  arch.castShadow = true;

  // Bridge railings
  const railingHeight = 1;
  const railingThickness = 0.15;

  // Left railing
  const leftRailingGeometry = new THREE.BoxGeometry(
    bridgeWidth,
    railingHeight,
    railingThickness
  );
  const railingMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222, // Almost black
    roughness: 0.6,
    metalness: 0.4,
  });

  const leftRailing = new THREE.Mesh(leftRailingGeometry, railingMaterial);
  leftRailing.position.y = 2 + bridgeHeight / 2 + railingHeight / 2; // Adjust to match new deck height
  leftRailing.position.z = bridgeDepth / 2 - railingThickness / 2;
  leftRailing.castShadow = true;

  // Right railing
  const rightRailing = leftRailing.clone();
  rightRailing.position.z = -bridgeDepth / 2 + railingThickness / 2;

  // Bridge posts along railings
  const numPosts = 6;
  const postWidth = 0.3;
  const postHeight = 1.4;
  const postDepth = 0.3;

  const postGeometry = new THREE.BoxGeometry(postWidth, postHeight, postDepth);
  const postMaterial = new THREE.MeshStandardMaterial({
    color: 0x121212, // Very dark gray
    roughness: 0.7,
    metalness: 0.3,
  });

  // Create posts along both sides
  for (let i = 0; i < numPosts; i++) {
    const x = (i / (numPosts - 1) - 0.5) * bridgeWidth;

    // Left side post
    const leftPost = new THREE.Mesh(postGeometry, postMaterial);
    leftPost.position.set(
      x,
      2 + bridgeHeight / 2 + postHeight / 2,
      bridgeDepth / 2 - railingThickness / 2
    );
    leftPost.castShadow = true;

    // Right side post
    const rightPost = leftPost.clone();
    rightPost.position.z = -bridgeDepth / 2 + railingThickness / 2;

    bridge.add(leftPost);
    bridge.add(rightPost);
  }

  // Create decorative lanterns on the corner posts
  const lanternSize = 0.3;
  const lanternGeometry = new THREE.SphereGeometry(lanternSize, 8, 8);
  const lanternMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff99, // Light yellow
    roughness: 0.1,
    metalness: 0.9,
    emissive: new THREE.Color(0xffff99),
    emissiveIntensity: 0.5,
  });

  // Create four lanterns at the corners
  for (let x of [-bridgeWidth / 2, bridgeWidth / 2]) {
    for (let z of [-bridgeDepth / 2, bridgeDepth / 2]) {
      const lantern = new THREE.Mesh(lanternGeometry, lanternMaterial);
      lantern.position.set(x, 2 + bridgeHeight / 2 + postHeight, z);
      lantern.castShadow = true;

      bridge.add(lantern);
    }
  }

  // Add everything to the bridge group
  bridge.add(deck);
  bridge.add(arch);
  bridge.add(leftRailing);
  bridge.add(rightRailing);

  return bridge;
}

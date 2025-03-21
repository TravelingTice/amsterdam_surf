import * as THREE from "three";

export function createBoatFlag(): THREE.Group {
  const flagGroup = new THREE.Group();

  // Create the black rod
  const rodGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
  const rodMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000, // Black
    roughness: 0.5,
    metalness: 0.3,
  });
  const rod = new THREE.Mesh(rodGeometry, rodMaterial);
  rod.castShadow = true;
  rod.receiveShadow = true;

  // Position the rod vertically
  rod.position.y = 0.4; // Half the height of the rod

  // Create the flag (three colored boxes)
  const flagWidth = 0.4;
  const flagHeight = 0.08;
  const flagDepth = 0.01;

  // Red stripe (top)
  const redGeometry = new THREE.BoxGeometry(flagWidth, flagHeight, flagDepth);
  const redMaterial = new THREE.MeshStandardMaterial({
    color: 0xae1c28, // Dutch flag red
    roughness: 0.7,
    metalness: 0.1,
  });
  const redStripe = new THREE.Mesh(redGeometry, redMaterial);
  redStripe.position.set(flagWidth / 2, 0.74, 0); // Position at the top of the rod
  redStripe.castShadow = true;
  redStripe.receiveShadow = true;

  // White stripe (middle)
  const whiteGeometry = new THREE.BoxGeometry(flagWidth, flagHeight, flagDepth);
  const whiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White
    roughness: 0.7,
    metalness: 0.1,
  });
  const whiteStripe = new THREE.Mesh(whiteGeometry, whiteMaterial);
  whiteStripe.position.set(flagWidth / 2, 0.66, 0); // Position below the red stripe
  whiteStripe.castShadow = true;
  whiteStripe.receiveShadow = true;

  // Blue stripe (bottom)
  const blueGeometry = new THREE.BoxGeometry(flagWidth, flagHeight, flagDepth);
  const blueMaterial = new THREE.MeshStandardMaterial({
    color: 0x21468b, // Dutch flag blue
    roughness: 0.7,
    metalness: 0.1,
  });
  const blueStripe = new THREE.Mesh(blueGeometry, blueMaterial);
  blueStripe.position.set(flagWidth / 2, 0.58, 0); // Position below the white stripe
  blueStripe.castShadow = true;
  blueStripe.receiveShadow = true;

  // Add all components to the flag group
  flagGroup.add(rod);
  flagGroup.add(redStripe);
  flagGroup.add(whiteStripe);
  flagGroup.add(blueStripe);

  return flagGroup;
}

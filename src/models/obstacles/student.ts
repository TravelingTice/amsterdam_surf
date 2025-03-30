import * as THREE from "three";

export function createStudent(): THREE.Group {
  const student = new THREE.Group();

  // Random shirt color
  const shirtColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
  const shirtColor = shirtColors[Math.floor(Math.random() * shirtColors.length)];

  // Body
  const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.8, 8);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: shirtColor,
    roughness: 0.9,
    metalness: 0.1,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 1.0;
  body.castShadow = true;

  // Head
  const headGeometry = new THREE.SphereGeometry(0.2, 16, 16);
  const headMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd6c4, // Skin tone
    roughness: 0.9,
    metalness: 0.1,
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 1.6;
  head.castShadow = true;

  // Arms
  const armGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.7, 8);
  const armMaterial = bodyMaterial;

  // Left arm
  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  leftArm.position.set(0.3, 1.1, 0);
  leftArm.rotation.z = Math.PI / 6;
  leftArm.castShadow = true;

  // Right arm
  const rightArm = new THREE.Mesh(armGeometry, armMaterial);
  rightArm.position.set(-0.3, 1.1, 0);
  rightArm.rotation.z = -Math.PI / 6;
  rightArm.castShadow = true;

  // Legs
  const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
  const legMaterial = new THREE.MeshStandardMaterial({
    color: 0x1560bd, // Blue jeans
    roughness: 0.9,
    metalness: 0.1,
  });

  // Left leg
  const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
  leftLeg.position.set(0.15, 0.4, 0);
  leftLeg.castShadow = true;

  // Right leg
  const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
  rightLeg.position.set(-0.15, 0.4, 0);
  rightLeg.castShadow = true;

  // Optional: add a beer bottle (it's Amsterdam after all)
  if (Math.random() < 0.7) {
    const bottleGroup = new THREE.Group();

    const bottleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 8);
    const bottleMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513, // Brown bottle
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.8,
    });
    const bottle = new THREE.Mesh(bottleGeometry, bottleMaterial);
    bottle.castShadow = true;

    const neckGeometry = new THREE.CylinderGeometry(0.02, 0.05, 0.1, 8);
    const neck = new THREE.Mesh(neckGeometry, bottleMaterial);
    neck.position.y = 0.15;
    neck.castShadow = true;

    bottleGroup.add(bottle);
    bottleGroup.add(neck);
    bottleGroup.position.set(0.5, 1.0, 0);
    bottleGroup.rotation.z = Math.PI / 2;

    student.add(bottleGroup);
  }

  student.add(body);
  student.add(head);
  student.add(leftArm);
  student.add(rightArm);
  student.add(leftLeg);
  student.add(rightLeg);

  // Partially submerged
  student.position.y = 0.1;
  student.scale.set(0.7, 0.7, 0.7); // Make slightly smaller to fit in canal

  return student;
}

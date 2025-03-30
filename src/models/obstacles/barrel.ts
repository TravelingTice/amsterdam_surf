import * as THREE from "three";

export function createBarrel(): THREE.Mesh {
  const barrelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 12);
  barrelGeometry.rotateX(Math.PI / 2); // Lay barrel on its side

  const barrelMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513, // Brown
    roughness: 0.8,
    metalness: 0.2,
  });

  const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
  barrel.castShadow = true;
  barrel.receiveShadow = true;

  // Add barrel details - rings
  const ringGeometry = new THREE.TorusGeometry(0.5, 0.05, 8, 16);
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0x3d3d3d, // Dark gray
    roughness: 0.7,
    metalness: 0.5,
  });

  for (let i = -0.35; i <= 0.35; i += 0.35) {
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.z = i;
    ring.rotation.y = Math.PI / 2;
    barrel.add(ring);
  }

  // Float half-submerged in water
  barrel.position.y = 0.5;

  return barrel;
}

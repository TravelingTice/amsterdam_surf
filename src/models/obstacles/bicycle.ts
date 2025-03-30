import * as THREE from "three";

export function createBicycle(): THREE.Group {
  const bicycle = new THREE.Group();

  // Frame color
  const frameColor = new THREE.Color(Math.random() < 0.5 ? 0x3f3f3f : 0x8b0000);

  // Bicycle frame
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: frameColor,
    roughness: 0.5,
    metalness: 0.8,
  });

  // Main tube
  const mainTubeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
  mainTubeGeometry.rotateZ(Math.PI / 4);
  const mainTube = new THREE.Mesh(mainTubeGeometry, frameMaterial);
  mainTube.position.set(0, 0.5, 0);
  mainTube.castShadow = true;

  // Seat tube
  const seatTubeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
  const seatTube = new THREE.Mesh(seatTubeGeometry, frameMaterial);
  seatTube.position.set(-0.2, 0.5, 0);
  seatTube.castShadow = true;

  // Handlebar tube
  const handlebarTubeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
  const handlebarTube = new THREE.Mesh(handlebarTubeGeometry, frameMaterial);
  handlebarTube.position.set(0.2, 0.5, 0);
  handlebarTube.castShadow = true;

  // Wheels
  const wheelGeometry = new THREE.TorusGeometry(0.3, 0.05, 8, 24);
  const wheelMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a, // Dark tire color
    roughness: 0.9,
    metalness: 0.1,
  });

  // Front wheel
  const frontWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  frontWheel.position.set(0.4, 0.3, 0);
  frontWheel.castShadow = true;

  // Back wheel
  const backWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  backWheel.position.set(-0.4, 0.3, 0);
  backWheel.castShadow = true;

  // Handlebars
  const handlebarGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8);
  handlebarGeometry.rotateX(Math.PI / 2);
  const handlebar = new THREE.Mesh(handlebarGeometry, frameMaterial);
  handlebar.position.set(0.4, 0.8, 0);
  handlebar.castShadow = true;

  // Seat
  const seatGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.3);
  const seatMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000, // Black
    roughness: 0.9,
    metalness: 0.1,
  });
  const seat = new THREE.Mesh(seatGeometry, seatMaterial);
  seat.position.set(-0.2, 0.8, 0);
  seat.castShadow = true;

  // Add spokes to wheels
  const spokeGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.58, 4);
  const spokeMaterial = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0, // Silver
    roughness: 0.3,
    metalness: 0.9,
  });

  // Add spokes to front wheel
  for (let i = 0; i < 8; i++) {
    const spoke = new THREE.Mesh(spokeGeometry, spokeMaterial);
    spoke.position.copy(frontWheel.position);
    spoke.rotation.z = (i * Math.PI) / 4;
    bicycle.add(spoke);
  }

  // Add spokes to back wheel
  for (let i = 0; i < 8; i++) {
    const spoke = new THREE.Mesh(spokeGeometry, spokeMaterial);
    spoke.position.copy(backWheel.position);
    spoke.rotation.z = (i * Math.PI) / 4;
    bicycle.add(spoke);
  }

  bicycle.add(mainTube);
  bicycle.add(seatTube);
  bicycle.add(handlebarTube);
  bicycle.add(frontWheel);
  bicycle.add(backWheel);
  bicycle.add(handlebar);
  bicycle.add(seat);

  // Half-submerged in water
  bicycle.position.y = 0.3;

  // Rotate so it's visible from player's perspective
  bicycle.rotation.y = Math.PI / 4;

  return bicycle;
}

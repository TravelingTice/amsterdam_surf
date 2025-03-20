import * as THREE from "three";

export function createBoat(): THREE.Group {
  const boat = new THREE.Group();

  // Boat hull
  const hullGeometry = new THREE.BoxGeometry(1, 0.5, 3);
  const hullMaterial = new THREE.MeshStandardMaterial({
    color: 0x964b00, // Brown
    roughness: 0.7,
    metalness: 0.1,
  });
  const hull = new THREE.Mesh(hullGeometry, hullMaterial);
  hull.position.y = 0.25;
  hull.castShadow = true;
  hull.receiveShadow = true;

  // Inside of boat (hollow part)
  const insideGeometry = new THREE.BoxGeometry(0.8, 0.2, 2.8);
  const insideMaterial = new THREE.MeshStandardMaterial({
    color: 0x593d29, // Darker brown
    roughness: 0.8,
    metalness: 0,
  });
  const inside = new THREE.Mesh(insideGeometry, insideMaterial);
  inside.position.y = 0.35;
  inside.receiveShadow = true;

  // Seats
  const seatGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.4);
  const seatMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513, // Saddle brown
    roughness: 0.6,
    metalness: 0.1,
  });

  // Front seat
  const frontSeat = new THREE.Mesh(seatGeometry, seatMaterial);
  frontSeat.position.set(0, 0.35, -1);
  frontSeat.castShadow = true;
  frontSeat.receiveShadow = true;

  // Back seat
  const backSeat = new THREE.Mesh(seatGeometry, seatMaterial);
  backSeat.position.set(0, 0.35, 1);
  backSeat.castShadow = true;
  backSeat.receiveShadow = true;

  // Middle seat
  const middleSeat = new THREE.Mesh(seatGeometry, seatMaterial);
  middleSeat.position.set(0, 0.35, 0);
  middleSeat.castShadow = true;
  middleSeat.receiveShadow = true;

  // Motor
  const motorGroup = new THREE.Group();

  const motorBodyGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  const motorBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x2e2e2e, // Dark gray
    roughness: 0.5,
    metalness: 0.8,
  });
  const motorBody = new THREE.Mesh(motorBodyGeometry, motorBodyMaterial);
  motorBody.castShadow = true;

  const motorPropGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 8);
  const motorPropMaterial = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0, // Silver
    roughness: 0.2,
    metalness: 0.9,
  });
  const motorProp = new THREE.Mesh(motorPropGeometry, motorPropMaterial);
  motorProp.rotation.x = Math.PI / 2;
  motorProp.position.z = -0.15;
  motorProp.castShadow = true;

  motorGroup.add(motorBody);
  motorGroup.add(motorProp);
  motorGroup.position.set(0, 0.4, -1.4);

  // Add all parts to the boat
  boat.add(hull);
  boat.add(inside);
  boat.add(frontSeat);
  boat.add(backSeat);
  boat.add(middleSeat);
  boat.add(motorGroup);

  // Position and rotate the boat correctly
  boat.rotation.y = Math.PI; // Face the right direction
  boat.position.y = 0.25; // Float on water

  return boat;
}

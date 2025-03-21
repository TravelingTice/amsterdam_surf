import * as THREE from "three";
import { createBoatFlag } from "./boatflag";

export function createBoat(): THREE.Group {
  const boat = new THREE.Group();

  // Boat hull
  const hullGeometry = new THREE.BoxGeometry(1, 0.2, 3);

  const hullMaterial = new THREE.MeshStandardMaterial({
    color: 0x964b00, // Brown
    roughness: 0.7,
    metalness: 0.1,
  });

  const hull = new THREE.Mesh(hullGeometry, hullMaterial);
  hull.position.y = 0.25;
  hull.castShadow = true;
  hull.receiveShadow = true;

  const rodGeometry = new THREE.BoxGeometry(0.1, 0.21, 3.3);
  const rodMaterial = new THREE.MeshStandardMaterial({
    color: 0x964b00, // Brown (same as hull)
    roughness: 0.7,
    metalness: 0.1,
  });
  const rod = new THREE.Mesh(rodGeometry, rodMaterial);
  rod.position.y = 0.45;
  rod.position.x = -0.5;
  rod.position.z = 0.3;
  rod.castShadow = true;
  rod.receiveShadow = true;

  const rod2Geometry = new THREE.BoxGeometry(0.1, 0.21, 3.3);
  const rod2Material = new THREE.MeshStandardMaterial({
    color: 0x964b00, // Brown (same as hull)
    roughness: 0.7,
    metalness: 0.1,
  });
  const rod2 = new THREE.Mesh(rod2Geometry, rod2Material);
  rod2.position.y = 0.45;
  rod2.position.x = 0.5;
  rod2.position.z = 0.3;
  rod2.castShadow = true;
  rod2.receiveShadow = true;

  const rod3Geometry = new THREE.BoxGeometry(0.1, 0.4, 1.1);
  const rod3Material = new THREE.MeshStandardMaterial({
    color: 0x964b00, // Brown (same as hull)
    roughness: 0.7,
    metalness: 0.1,
  });
  const rod3 = new THREE.Mesh(rod3Geometry, rod3Material);
  rod3.rotation.z = Math.PI / 2;
  rod3.rotation.y = Math.PI / 2;
  rod3.position.y = 0.4;
  rod3.position.z = 1.6;
  // rod3.position.x = 0.5;
  rod3.castShadow = true;
  rod3.receiveShadow = true;

  // Inside of boat (hollow part)
  // const insideGeometry = new THREE.BoxGeometry(0.8, 0.25, 2.8);
  // const insideMaterial = new THREE.MeshStandardMaterial({
  //   color: 0x422b1e, // Much darker brown for contrast
  //   roughness: 0.8,
  //   metalness: 0,
  // });
  // const inside = new THREE.Mesh(insideGeometry, insideMaterial);
  // inside.position.y = 0.4;
  // inside.receiveShadow = true;

  // Seats
  const seatGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.5);
  const seatMaterial = new THREE.MeshStandardMaterial({
    color: 0xc68642, // Lighter saddle brown for contrast with hull and interior
    roughness: 0.6,
    metalness: 0.1,
  });

  // Front seat
  const frontSeat = new THREE.Mesh(seatGeometry, seatMaterial);
  frontSeat.position.set(0, 0.45, -1);
  frontSeat.castShadow = true;
  frontSeat.receiveShadow = true;

  // Back seat
  const backSeat = new THREE.Mesh(seatGeometry, seatMaterial);
  backSeat.position.set(0, 0.45, 1);
  backSeat.castShadow = true;
  backSeat.receiveShadow = true;

  // Middle seat
  const middleSeat = new THREE.Mesh(seatGeometry, seatMaterial);
  middleSeat.position.set(0, 0.45, 0);
  middleSeat.castShadow = true;
  middleSeat.receiveShadow = true;

  // Motor
  const motorGroup = new THREE.Group();

  const motorBodyGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  const motorBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x2e2e2e, // Dark gray
    roughness: 0.5,
    metalness: 0.8,
  });
  const motorBody = new THREE.Mesh(motorBodyGeometry, motorBodyMaterial);
  motorBody.castShadow = true;

  const motorPropGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 8);
  const motorPropMaterial = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0, // Silver
    roughness: 0.2,
    metalness: 0.9,
  });
  const motorProp = new THREE.Mesh(motorPropGeometry, motorPropMaterial);
  motorProp.rotation.x = Math.PI / 2;
  motorProp.position.z = 0.25;
  motorProp.castShadow = true;

  motorGroup.add(motorBody);
  motorGroup.add(motorProp);
  motorGroup.position.set(0, 0.3, 1.8);

  // Add a steering wheel to increase visibility of details
  const steeringWheelGroup = new THREE.Group();
  const wheelGeometry = new THREE.TorusGeometry(0.15, 0.02, 8, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000, // Black
    roughness: 0.5,
    metalness: 0.6,
  });
  const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);

  // Add wheel spokes
  for (let i = 0; i < 4; i++) {
    const spokeGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.28, 6);
    const spoke = new THREE.Mesh(spokeGeometry, wheelMaterial);
    spoke.rotation.z = Math.PI / 2;
    spoke.rotation.y = (Math.PI / 4) * i;
    spoke.position.x = 0;
    steeringWheelGroup.add(spoke);
  }

  steeringWheelGroup.add(wheel);
  steeringWheelGroup.rotation.x = Math.PI / 2 + Math.PI / 6; // Angled slightly
  steeringWheelGroup.position.set(0, 0.55, -0.7); // Position at front of boat

  const flag = createBoatFlag();
  flag.position.set(0, 0.2, 1.6);
  flag.rotation.y = Math.PI / 3; // Rotate 90 degrees so flag points backwards
  flag.rotation.x = Math.PI / 12; // Slant it down slightly (15 degrees)
  flag.castShadow = true;
  flag.receiveShadow = true;
  // Add all parts to the boat
  boat.add(hull);
  boat.add(rod);
  boat.add(rod2);
  boat.add(rod3);
  // boat.add(inside);
  boat.add(frontSeat);
  boat.add(backSeat);
  boat.add(middleSeat);
  boat.add(motorGroup);
  boat.add(steeringWheelGroup);
  boat.add(flag);

  // Position and rotate the boat correctly
  boat.rotation.y = Math.PI; // Face the right direction
  boat.position.y = 0.25; // Float on water

  return boat;
}

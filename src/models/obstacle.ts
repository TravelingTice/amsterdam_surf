import * as THREE from "three";

export function createObstacle(type: string): THREE.Group | THREE.Mesh {
  switch (type) {
    case "barrel":
      return createBarrel();
    case "duck":
      return createDuck();
    case "bicycle":
      return createBicycle();
    case "student":
      return createStudent();
    case "party_boat":
      return createPartyBoat();
    default:
      return createBarrel(); // Default to barrel if unknown type
  }
}

function createBarrel(): THREE.Mesh {
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

function createDuck(): THREE.Group {
  const duck = new THREE.Group();

  // Duck body
  const bodyGeometry = new THREE.SphereGeometry(0.4, 16, 12);
  bodyGeometry.scale(1, 0.8, 1.3);

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00, // Yellow
    roughness: 0.9,
    metalness: 0,
  });

  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.4;
  body.castShadow = true;

  // Duck head
  const headGeometry = new THREE.SphereGeometry(0.25, 16, 12);
  const headMaterial = bodyMaterial;

  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.set(0, 0.7, 0.35);
  head.castShadow = true;

  // Duck bill
  const billGeometry = new THREE.ConeGeometry(0.1, 0.3, 4);
  billGeometry.rotateX(-Math.PI / 2);

  const billMaterial = new THREE.MeshStandardMaterial({
    color: 0xffa500, // Orange
    roughness: 0.9,
    metalness: 0,
  });

  const bill = new THREE.Mesh(billGeometry, billMaterial);
  bill.position.set(0, 0.65, 0.6);
  bill.castShadow = true;

  // Duck eyes
  const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000, // Black
    roughness: 0.5,
    metalness: 0.2,
  });

  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(0.1, 0.75, 0.5);

  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEye.position.set(-0.1, 0.75, 0.5);

  duck.add(body);
  duck.add(head);
  duck.add(bill);
  duck.add(leftEye);
  duck.add(rightEye);

  // Float on water
  duck.position.y = 0.15;

  return duck;
}

function createBicycle(): THREE.Group {
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

function createStudent(): THREE.Group {
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

function createPartyBoat(): THREE.Group {
  const boat = new THREE.Group();

  // Hull
  const hullGeometry = new THREE.BoxGeometry(2, 0.6, 3);
  const hullMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White
    roughness: 0.5,
    metalness: 0.3,
  });
  const hull = new THREE.Mesh(hullGeometry, hullMaterial);
  hull.position.y = 0.3;
  hull.castShadow = true;
  hull.receiveShadow = true;

  // Inside
  const insideGeometry = new THREE.BoxGeometry(1.8, 0.3, 2.8);
  const insideMaterial = new THREE.MeshStandardMaterial({
    color: 0x9c9c9c, // Gray
    roughness: 0.5,
    metalness: 0.3,
  });
  const inside = new THREE.Mesh(insideGeometry, insideMaterial);
  inside.position.y = 0.4;
  inside.castShadow = true;
  inside.receiveShadow = true;

  // Add several people (simplified)
  const numPeople = 4 + Math.floor(Math.random() * 4); // 4-7 people
  const peopleColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

  for (let i = 0; i < numPeople; i++) {
    const personColor = peopleColors[Math.floor(Math.random() * peopleColors.length)];

    // Body (simplified as a box)
    const bodyGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.3);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: personColor,
      roughness: 0.9,
      metalness: 0.1,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);

    // Head (simplified as a sphere)
    const headGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd6c4, // Skin tone
      roughness: 0.9,
      metalness: 0.1,
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.3;

    // Create person
    const person = new THREE.Group();
    person.add(body);
    person.add(head);

    // Position randomly in boat
    const x = (Math.random() - 0.5) * 1.5;
    const z = (Math.random() - 0.5) * 2.5;
    person.position.set(x, 0.6, z);

    boat.add(person);
  }

  // Add flags or decorations
  const flagPoleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
  const flagPoleMaterial = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0, // Silver
    roughness: 0.3,
    metalness: 0.9,
  });

  const flagPole = new THREE.Mesh(flagPoleGeometry, flagPoleMaterial);
  flagPole.position.set(0, 1, -1);
  flagPole.castShadow = true;

  // Dutch flag
  const flagGeometry = new THREE.PlaneGeometry(0.6, 0.3);
  const flagMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000, // Red for simplicity (actual Dutch flag has three colors)
    side: THREE.DoubleSide,
  });

  const flag = new THREE.Mesh(flagGeometry, flagMaterial);
  flag.position.set(0.3, 0.8, 0);
  flag.rotation.y = Math.PI / 2;
  flagPole.add(flag);

  // Add speaker
  const speakerGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  const speakerMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000, // Black
    roughness: 0.9,
    metalness: 0.2,
  });

  const speaker = new THREE.Mesh(speakerGeometry, speakerMaterial);
  speaker.position.set(0, 0.6, 1);
  speaker.castShadow = true;

  boat.add(hull);
  boat.add(inside);
  boat.add(flagPole);
  boat.add(speaker);

  // Optional: add beer bottles
  for (let i = 0; i < 3; i++) {
    const bottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.15, 8),
      new THREE.MeshStandardMaterial({
        color: 0x8b4513, // Brown bottle
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.8,
      })
    );

    const x = (Math.random() - 0.5) * 1.5;
    const z = (Math.random() - 0.5) * 2.5;
    bottle.position.set(x, 0.6, z);
    bottle.castShadow = true;

    boat.add(bottle);
  }

  return boat;
}

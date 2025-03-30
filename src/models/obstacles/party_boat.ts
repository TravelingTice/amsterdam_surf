import * as THREE from "three";

export function createPartyBoat(): THREE.Group {
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

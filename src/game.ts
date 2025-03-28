import * as THREE from "three";
import * as CANNON from "cannon-es";
import { createBoat } from "./models/boat";
import { createCanalHouses } from "./models/canalHouses";
import { createWater } from "./models/water";
import { createObstacle } from "./models/obstacle";

// Type definitions
interface Obstacle {
  mesh: THREE.Group | THREE.Mesh;
  body: CANNON.Body;
  type: string;
  lane: number;
  passed: boolean;
}

// Lane positions
const LANE_POSITIONS = [2, 0, -2];
const TOTAL_LANES = 3;

export class Game {
  // Properties
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private world: CANNON.World;

  private boat: {
    mesh: THREE.Group;
    body: CANNON.Body;
    lane: number;
    targetX: number;
    isChangingLanes: boolean;
    tiltAngle: number;
  };

  private obstacles: Obstacle[] = [];
  private score: number = 0;
  private speed: number = 0;
  private maxSpeed: number = 20;
  private acceleration: number = 0.1;

  private canalHouses: { mesh: THREE.Group; side: "left" | "right" }[] = [];
  private water: THREE.Mesh;
  private lastObstacleTime: number = 0;
  private obstacleInterval: number = 1000; // ms

  private isMoving: boolean = false;
  public isRunning: boolean = false;

  private lastFrameTime: number = 0;
  private obstacleTypes = ["barrel", "bicycle", "student", "party_boat"];

  private scoreElement: HTMLElement | null;
  private finalScoreElement: HTMLElement | null;

  constructor() {
    // Initialize the canvas and renderer
    this.canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;

    // Initialize the scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // Sky blue
    this.scene.fog = new THREE.Fog(0x87ceeb, 30, 100);

    // Initialize the camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 3, -10);
    this.camera.lookAt(0, 0, 10);

    // Initialize physics world
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });

    // Initialize score elements
    this.scoreElement = document.getElementById("score");
    this.finalScoreElement = document.getElementById("final-score");

    // Setup lights
    this.setupLights();

    // Create water
    this.water = createWater();
    this.scene.add(this.water);

    // Create canal houses
    this.createEnvironment();

    // Create boat
    const boatModel = createBoat();
    const boatBody = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 0.5, 0),
      shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 1.5)),
    });
    this.world.addBody(boatBody);

    this.boat = {
      mesh: boatModel,
      body: boatBody,
      lane: 1, // Middle lane (0-indexed)
      targetX: LANE_POSITIONS[1], // Initially set to the middle lane
      isChangingLanes: false,
      tiltAngle: 0,
    };

    this.scene.add(this.boat.mesh);

    // Initial positioning
    this.updateBoatPosition();

    // Start animation loop
    this.animate();
  }

  private setupLights(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -15;
    directionalLight.shadow.camera.right = 15;
    directionalLight.shadow.camera.top = 15;
    directionalLight.shadow.camera.bottom = -15;

    this.scene.add(directionalLight);
  }

  private createEnvironment(): void {
    // Create canal houses on both sides
    const leftHouses = createCanalHouses("left");
    const rightHouses = createCanalHouses("right");

    leftHouses.position.set(-8, 0, 0);
    rightHouses.position.set(8, 0, 0);

    this.scene.add(leftHouses);
    this.scene.add(rightHouses);

    this.canalHouses.push({ mesh: leftHouses, side: "left" }, { mesh: rightHouses, side: "right" });
  }

  private updateScore(): void {
    const currentScore = Math.floor(this.score);
    if (this.scoreElement) {
      this.scoreElement.textContent = `${currentScore}m`;
    }
  }

  private spawnObstacle(): void {
    const now = Date.now();

    if (now - this.lastObstacleTime < this.obstacleInterval) {
      return;
    }

    // Random obstacle type
    const obsType = this.obstacleTypes[Math.floor(Math.random() * this.obstacleTypes.length)];

    // Random lane
    const lane = Math.floor(Math.random() * TOTAL_LANES);

    // Create regular obstacle
    const obstacle = createObstacle(obsType);
    const obstacleBody = new CANNON.Body({
      mass: 0, // Static body
      position: new CANNON.Vec3(LANE_POSITIONS[lane], 0.5, 100), // Start far away
      shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
    });

    this.world.addBody(obstacleBody);
    this.scene.add(obstacle);

    this.obstacles.push({
      mesh: obstacle,
      body: obstacleBody,
      type: obsType,
      lane,
      passed: false,
    });

    this.lastObstacleTime = now;

    // Make obstacles spawn more frequently as game progresses
    this.obstacleInterval = Math.max(500, 1000 - this.score / 50);
  }

  private updateObstacles(delta: number): void {
    const moveDistance = this.speed * delta;
    const boatZ = this.boat.body.position.z;

    // Update obstacle positions
    for (let i = 0; i < this.obstacles.length; i++) {
      const obstacle = this.obstacles[i];

      // Move obstacle towards boat
      obstacle.body.position.z -= moveDistance;

      // Update mesh position to match physics body
      obstacle.mesh.position.set(
        obstacle.body.position.x,
        obstacle.body.position.y,
        obstacle.body.position.z
      );

      // Check if obstacle is passed
      if (!obstacle.passed && obstacle.body.position.z < boatZ) {
        obstacle.passed = true;
      }

      // Remove obstacles that are behind the boat
      if (obstacle.body.position.z < boatZ - 10) {
        this.scene.remove(obstacle.mesh);
        this.world.removeBody(obstacle.body);
        this.obstacles.splice(i, 1);
        i--;
      }
    }
  }

  private checkCollisions(): boolean {
    if (!this.isRunning) return false;

    const boatX = this.boat.body.position.x;
    const boatZ = this.boat.body.position.z;

    for (const obstacle of this.obstacles) {
      const obstacleX = obstacle.body.position.x;
      const obstacleZ = obstacle.body.position.z;

      // Skip obstacles that are already behind
      if (obstacleZ < boatZ - 2) continue;

      // Distance check
      const xDist = Math.abs(boatX - obstacleX);
      const zDist = Math.abs(boatZ - obstacleZ);

      // Adjust collision boundaries based on whether the boat is changing lanes
      // Slightly more forgiving hitbox when changing lanes for better player experience
      const xThreshold = this.boat.isChangingLanes ? 1.25 : 1.1;

      // Regular obstacle collision
      if (xDist < xThreshold && zDist < 2) {
        return true;
      }
    }

    return false;
  }

  private updateEnvironment(delta: number): void {
    // Move canal houses to create endless effect
    const moveDistance = this.speed * delta;

    // Find the front and back houses for each side
    const leftHouses = this.canalHouses.filter((h) => h.side === "left");
    const rightHouses = this.canalHouses.filter((h) => h.side === "right");

    // Update positions
    for (const house of this.canalHouses) {
      house.mesh.position.z -= moveDistance;

      // Reset position when houses are far behind
      if (house.mesh.position.z < -50) {
        // Increased reset distance
        // Find the frontmost house on the same side
        const sameTypeHouses = house.side === "left" ? leftHouses : rightHouses;
        const frontHouse = sameTypeHouses.reduce((front, current) =>
          current.mesh.position.z > front.mesh.position.z ? current : front
        );

        // Position this house further ahead for smoother transitions
        house.mesh.position.z = frontHouse.mesh.position.z + 50;
        // Ensure houses stay on their correct side
        house.mesh.position.x = house.side === "left" ? -8 : 8;
      }
    }

    // Move water to create endless effect
    this.water.position.z -= moveDistance;

    if (this.water.position.z < -100) {
      this.water.position.z += 200;
    }
  }

  private updateBoatPosition(): void {
    // Calculate target X position based on lane
    const targetX = LANE_POSITIONS[this.boat.lane];
    this.boat.targetX = targetX;

    // Get current X position
    const currentX = this.boat.body.position.x;

    // Interpolation speed (higher value = faster transition)
    const lerpSpeed = 6;

    // If the boat is not yet at the target position
    if (Math.abs(currentX - targetX) > 0.01) {
      this.boat.isChangingLanes = true;

      // Smooth interpolation (lerp) toward target
      const newX = currentX + (targetX - currentX) * Math.min(1, lerpSpeed * (1 / 60));
      this.boat.body.position.x = newX;

      // Calculate tilt angle based on direction of movement
      const tiltDirection = targetX > currentX ? 1 : -1;
      this.boat.tiltAngle =
        tiltDirection * Math.min(Math.PI / 12, Math.abs(targetX - currentX) * 0.5);
    } else {
      // When boat reaches the target position
      this.boat.body.position.x = targetX; // Snap to exact position
      this.boat.isChangingLanes = false;

      // Gradually return tilt to zero
      if (Math.abs(this.boat.tiltAngle) > 0.01) {
        this.boat.tiltAngle *= 0.8;
      } else {
        this.boat.tiltAngle = 0;
      }
    }

    // Add gentle rocking motion while moving
    if (this.isRunning) {
      const time = performance.now() * 0.001; // Current time in seconds
      // Small rolling (side to side) motion
      const gentleRoll = Math.sin(time * 2) * 0.03;
      // Small pitching (front to back) motion
      const gentlePitch = Math.sin(time * 1.5) * 0.02;

      // Apply rocking motion (but less when actively changing lanes)
      const rockFactor = this.boat.isChangingLanes ? 0.3 : 1.0;
      this.boat.mesh.rotation.z = -this.boat.tiltAngle + gentleRoll * rockFactor;
      this.boat.mesh.rotation.x = gentlePitch * rockFactor;
    } else {
      // Just apply the tilt when not running
      this.boat.mesh.rotation.z = -this.boat.tiltAngle;
      this.boat.mesh.rotation.x = 0;
    }

    // Update mesh position to match physics body
    this.boat.mesh.position.x = this.boat.body.position.x;
    this.boat.mesh.position.z = this.boat.body.position.z;
  }

  private animate(): void {
    const now = performance.now();
    const delta = (now - this.lastFrameTime) / 1000; // Convert to seconds
    this.lastFrameTime = now;

    // Check for game over
    if (this.isRunning && this.checkCollisions()) {
      this.gameOver();
      return;
    }

    // Update game state
    if (this.isRunning) {
      // Accelerate
      this.speed = Math.min(this.maxSpeed, this.speed + this.acceleration * delta);

      // Update score
      this.score += delta * this.speed;
      this.updateScore();

      // Spawn obstacles
      this.spawnObstacle();

      // Update obstacles
      this.updateObstacles(delta);

      // Update environment
      this.updateEnvironment(delta);

      // Update boat animation
      this.updateBoatPosition();
    }

    // Update physics world
    this.world.step(delta);

    // Render scene
    this.renderer.render(this.scene, this.camera);

    // Continue animation loop
    requestAnimationFrame(() => this.animate());
  }

  // Public methods
  public start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.speed = 5;
    this.score = 0;
    this.lastObstacleTime = Date.now();

    // Clear any existing obstacles
    for (const obstacle of this.obstacles) {
      this.scene.remove(obstacle.mesh);
      this.world.removeBody(obstacle.body);
    }
    this.obstacles = [];

    // Reset boat position
    this.boat.lane = 1;
    this.updateBoatPosition();
  }

  public restart(): void {
    this.start();
  }

  public gameOver(): void {
    this.isRunning = false;
    this.speed = 0;

    // Update final score
    const finalScore = Math.floor(this.score);
    if (this.finalScoreElement) {
      this.finalScoreElement.textContent = `${finalScore}`;
    }

    // Show game over screen
    document.getElementById("game-over-screen")?.classList.remove("hidden");
    document.getElementById("mobile-controls")?.classList.add("hidden");
  }

  public moveLeft(): void {
    if (!this.isRunning) return;
    if (this.boat.lane > 0) {
      this.boat.lane--;
      this.updateBoatPosition();
    }
  }

  public moveRight(): void {
    if (!this.isRunning) return;
    if (this.boat.lane < TOTAL_LANES - 1) {
      this.boat.lane++;
      this.updateBoatPosition();
    }
  }

  public handleResize(): void {
    // Update camera aspect ratio
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    // Update renderer size
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}

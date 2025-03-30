import * as THREE from "three"

export function createWater(): THREE.Mesh {
  // Create a large plane for the water
  const waterGeometry = new THREE.PlaneGeometry(20, 300, 32, 128)

  // Rotate it to be horizontal
  waterGeometry.rotateX(-Math.PI / 2)

  // Add simple vertex displacement to simulate waves
  const count = waterGeometry.attributes.position.count
  const displacement = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const x = waterGeometry.attributes.position.getX(i)
    const z = waterGeometry.attributes.position.getZ(i)

    // Add small random displacement for wave effect
    displacement[i] = Math.sin(x * 0.5) * 0.05 + Math.sin(z * 0.5) * 0.05
  }

  waterGeometry.setAttribute("displacement", new THREE.BufferAttribute(displacement, 1))

  // Create the shader material for animated waves
  const customWaterMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      waterColor: { value: new THREE.Color(0x2e5984) }, // Amsterdam canal blue
      fogColor: { value: new THREE.Color(0x87ceeb) }, // Sky blue
      fogNear: { value: 30 },
      fogFar: { value: 100 },
    },
    vertexShader: `
      uniform float time;
      attribute float displacement;
      varying vec2 vUv;
      varying float vElevation;
      
      void main() {
        vUv = uv;
        
        vec3 newPosition = position;
        float elevation = sin(position.x * 0.5 + time * 0.5) * 0.05 + 
                           sin(position.z * 0.5 + time * 0.75) * 0.05;
        
        newPosition.y = elevation;
        vElevation = elevation;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 waterColor;
      uniform vec3 fogColor;
      uniform float fogNear;
      uniform float fogFar;
      
      varying vec2 vUv;
      varying float vElevation;
      
      void main() {
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep(fogNear, fogFar, depth);
        
        // Adjust color based on elevation to create wave highlights
        vec3 finalColor = waterColor;
        finalColor += vElevation * 2.0; // Add highlights based on wave height
        
        // Apply fog
        finalColor = mix(finalColor, fogColor, fogFactor);
        
        gl_FragColor = vec4(finalColor, 0.85); // Slightly transparent
      }
    `,
    transparent: true,
    fog: true,
  })

  // Create a simple update function for the animation
  const updateWater = (): void => {
    const time = performance.now() * 0.001 // Convert to seconds
    customWaterMaterial.uniforms.time.value = time
    requestAnimationFrame(updateWater)
  }

  // Start the animation
  updateWater()

  // Create the water mesh
  const water = new THREE.Mesh(waterGeometry, customWaterMaterial)
  water.receiveShadow = true
  water.position.y = 0 // At ground level

  return water
}

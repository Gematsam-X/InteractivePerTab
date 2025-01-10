/**
 * Creates a 3D model of an atom with specified electron orbits.
 * @param {number} electrons1 - Number of electrons in the first orbit.
 * @param {number} electrons2 - Number of electrons in the second orbit.
 * @param {number} electrons3 - Number of electrons in the third orbit.
 * @param {number} electrons4 - Number of electrons in the fourth orbit.
 * @param {number} electrons5 - Number of electrons in the fifth orbit.
 * @param {number} electrons6 - Number of electrons in the sixth orbit.
 * @param {number} electrons7 - Number of electrons in the seventh orbit.
 */
export default function create3dModel(
  electrons1,
  electrons2,
  electrons3,
  electrons4,
  electrons5,
  electrons6,
  electrons7
) {
  const container = document.getElementById("rendererContainer");

  let cameraMove = true;
  let animationsOk = true;
  let animationSpeed = 0.01;
  let isPaused = false;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth * 0.5, window.innerHeight * 0.5);
  renderer.domElement.style.width = "50%";
  renderer.domElement.style.height = "50%";
  container.appendChild(renderer.domElement);

  // Add OrbitControls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 5;
  controls.maxDistance = 20;
  controls.enableZoom = true;
  controls.enablePan = false;

  // Create the atom (nucleus + orbits)
  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  scene.add(nucleus);

  const orbits = [];

  /**
   * Creates an orbit with specified parameters.
   * @param {number} radius - Radius of the orbit.
   * @param {number} numElectrons - Number of electrons in the orbit.
   * @param {number} orbitColor - Color of the orbit.
   * @param {number} electronColor - Color of the electrons.
   * @param {number} tiltX - Tilt of the orbit on the X axis.
   * @param {number} tiltY - Tilt of the orbit on the Y axis.
   */
  function createOrbit(
    radius,
    numElectrons,
    orbitColor,
    electronColor,
    tiltX,
    tiltY
  ) {
    const orbit = new THREE.Mesh(
      new THREE.RingGeometry(radius - 0.05, radius + 0.05, 100),
      new THREE.MeshBasicMaterial({ color: orbitColor, side: THREE.DoubleSide })
    );
    orbit.rotation.set(Math.PI / 2 + tiltX, tiltY, 0);
    scene.add(orbit);

    const electronGroup = new THREE.Group();
    orbit.add(electronGroup);

    const electronGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const electronMaterial = new THREE.MeshStandardMaterial({
      color: electronColor,
      emissive: electronColor,
      emissiveIntensity: 1,
    });

    const electrons = [];
    for (let i = 0; i < numElectrons; i++) {
      const angle = (i / numElectrons) * Math.PI * 2;
      const electron = new THREE.Mesh(electronGeometry, electronMaterial);
      electron.userData = { angle };
      electronGroup.add(electron);
      electrons.push(electron);
    }

    orbits.push({ orbit, electrons, radius });
  }

  const orbitColor = 0x000000;
  const electronColor = 0x0000ff;
  camera.position.z = 20;

  // Create orbits based on the number of electrons in each orbit
  createOrbit(1, electrons1, orbitColor, electronColor, 0, 1);
  if (electrons2) createOrbit(2, electrons2, orbitColor, electronColor, 0, 50);
  if (electrons3)
    createOrbit(3, electrons3, orbitColor, electronColor, Math.PI / 4, 0);
  if (electrons4)
    createOrbit(
      4,
      electrons4,
      orbitColor,
      electronColor,
      Math.PI / 6,
      Math.PI / 4
    );
  if (electrons5)
    createOrbit(
      5,
      electrons5,
      orbitColor,
      electronColor,
      -Math.PI / 6,
      Math.PI / 3
    );
  if (electrons6)
    createOrbit(
      6,
      electrons6,
      orbitColor,
      electronColor,
      Math.PI / 6,
      -Math.PI / 4
    );
  if (electrons7)
    createOrbit(7, electrons7, orbitColor, electronColor, -Math.PI / 3, 0);

  // Lighting setup
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    updatePauseState();

    if (!isPaused) {
      if (cameraMove) scene.rotation.y += 0.01;
      if (animationsOk) {
        orbits.forEach(({ orbit, electrons, radius }) => {
          orbit.rotation.z += animationSpeed;
          electrons.forEach((electron) => {
            const speedFactor = 1 / radius;
            electron.userData.angle += animationSpeed * speedFactor;
            const angle = electron.userData.angle;
            electron.position.set(
              radius * Math.cos(angle),
              radius * Math.sin(angle),
              0
            );
          });
        });
      }
    }

    controls.update();
    renderer.render(scene, camera);
  }

  // Update pause state and button text
  function updatePauseState() {
    isPaused = !cameraMove && !animationsOk;
    document.getElementById("pauseButton").textContent = isPaused
      ? "Riprendi"
      : "Pausa";
  }

  animate();

  // Event listeners for buttons
  document.getElementById("pauseButton").addEventListener("click", function () {
    isPaused = !isPaused;
    cameraMove = !isPaused;
    animationsOk = !isPaused;
    this.innerText = isPaused ? "Riprendi" : "Pausa";
    document.getElementById("pauseAnimationsButton").innerText = isPaused
      ? "Riprendi animazioni"
      : "Pausa animazioni";
    document.getElementById("pauseCameraButton").innerText = isPaused
      ? "Riprendi camera"
      : "Pausa camera";
  });

  document
    .getElementById("speedUpButton")
    .addEventListener("click", function () {
      if (animationSpeed < 0.05) animationSpeed += 0.01;
    });

  document
    .getElementById("slowDownButton")
    .addEventListener("click", function () {
      if (animationSpeed > 0.01) animationSpeed -= 0.01;
    });

  document
    .getElementById("pauseCameraButton")
    .addEventListener("click", function () {
      cameraMove = !cameraMove;
      this.innerText = cameraMove ? "Pausa camera" : "Riprendi camera";
    });

  document
    .getElementById("pauseAnimationsButton")
    .addEventListener("click", function () {
      animationsOk = !animationsOk;
      this.innerText = animationsOk
        ? "Pausa animazioni"
        : "Riprendi animazioni";
    });

  // Toggle fullscreen mode on container click
  document
    .getElementById("rendererContainer")
    .addEventListener("click", function () {
      if (!document.fullscreenElement) {
        container.requestFullscreen();
      }
    });

  // Adjust renderer size and camera aspect ratio on fullscreen change
  document.addEventListener("fullscreenchange", function () {
    const isFullscreen = document.fullscreenElement;
    const width = isFullscreen ? window.innerWidth : window.innerWidth * 0.5;
    const height = isFullscreen ? window.innerHeight : window.innerHeight * 0.5;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.domElement.style.width = isFullscreen ? "100%" : "50%";
    renderer.domElement.style.height = isFullscreen ? "100%" : "50%";
  });

  // Adjust renderer size and camera aspect ratio on window resize
  window.addEventListener("resize", function () {
    const isFullscreen = document.fullscreenElement;
    const width = isFullscreen ? window.innerWidth : window.innerWidth * 0.5;
    const height = isFullscreen ? window.innerHeight : window.innerHeight * 0.5;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
}

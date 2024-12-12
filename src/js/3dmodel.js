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
  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true }); // Aggiungi alpha: true per la trasparenza
  // Imposta il renderer per occupare il 50% della larghezza e altezza della finestra
  renderer.setSize(window.innerWidth * 0.5, window.innerHeight * 0.5);

  // Imposta le dimensioni effettive dell'elemento canvas in percentuale
  renderer.domElement.style.width = "50%";
  renderer.domElement.style.height = "50%";

  container.appendChild(renderer.domElement);

  // Add OrbitControls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Rotazione più fluida
  controls.dampingFactor = 0.05;
  controls.minDistance = 5; // Distanza minima della fotocamera
  controls.maxDistance = 20; // Distanza massima della fotocamera
  controls.enableZoom = true; // Abilita lo zoom con la rotella del mouse
  controls.enablePan = false; // Disabilita il panning (movimento laterale)

  // Create the atom (nucleus + orbits)
  const nucleusGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const nucleusMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
  });
  const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
  scene.add(nucleus);

  const orbits = []; // Store orbits to animate them
  let animationSpeed = 0.01; // Impostazione della velocità di animazione
  let isPaused = false; // Variabile per verificare se l'animazione è in pausa

  // Function to create an orbit with electrons
  function createOrbit(
    radius,
    numElectrons,
    orbitColor,
    electronColor,
    tiltX,
    tiltY
  ) {
    const orbitGeometry = new THREE.RingGeometry(
      radius - 0.05,
      radius + 0.05,
      100
    );
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: orbitColor,
      side: THREE.DoubleSide,
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);

    orbit.rotation.x = Math.PI / 2; // Rotate the orbit to lie flat on the X-Y plane
    orbit.rotation.x += tiltX;
    orbit.rotation.y += tiltY;

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

  // Create the orbits with electrons
  const orbitColor = 0x000000; // Colore delle orbite (nero)
  const electronColor = 0x0000ff; // Colore degli elettroni (blu)

  camera.position.z = 20;
  createOrbit(1, electrons1, orbitColor, electronColor, 0, 1); // First orbit

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
    ); // Fourth orbit

  if (electrons5)
    createOrbit(
      5,
      electrons5,
      orbitColor,
      electronColor,
      -Math.PI / 6,
      Math.PI / 3
    ); // Fifth orbit

  if (electrons6)
    createOrbit(
      6,
      electrons6,
      orbitColor,
      electronColor,
      Math.PI / 6,
      -Math.PI / 4
    ); // Sixth orbit

  if (electrons7)
    createOrbit(7, electrons7, orbitColor, electronColor, -Math.PI / 3, 0); // Seventh orbit

  // Lighting setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

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
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            electron.position.set(x, y, 0);
          });
        });
      }
    }

    controls.update();
    renderer.render(scene, camera);
  }

  function updatePauseState() {
    if (!cameraMove && !animationsOk) {
      isPaused = true;
      document.getElementById("pauseButton").textContent = "Riprendi";
    } else {
      isPaused = false;
      document.getElementById("pauseButton").textContent = "Pausa";
    }
  }

  animate();

  // Aggiungi i controlli per mettere in pausa, velocizzare, rallentare
  document.getElementById("pauseButton").addEventListener("click", function () {
    isPaused = !isPaused;
    if (isPaused) {
      cameraMove = false;
      animationsOk = false;
    } else {
      cameraMove = true;
      animationsOk = true;
    }
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
      animationSpeed += 0.01;
      if (animationSpeed >= 0.05) animationSpeed -= 0.01;
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

  if (!animationsOk && !cameraMove) {
    isPaused = true;
  }

  document
    .getElementById("rendererContainer")
    .addEventListener("click", function () {
      if (!document.fullscreenElement) {
        container.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });

  // Aggiungi un listener per il cambiamento dello stato del fullscreen
  document.addEventListener("fullscreenchange", function () {
    if (document.fullscreenElement) {
      // Quando entri in modalità fullscreen
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
    } else {
      // Quando esci dalla modalità fullscreen
      renderer.setSize(window.innerWidth * 0.5, window.innerHeight * 0.5);
      camera.aspect = (window.innerWidth * 0.5) / (window.innerHeight * 0.5);
      camera.updateProjectionMatrix();
      renderer.domElement.style.width = "50%";
      renderer.domElement.style.height = "50%";
    }
  });

  // Aggiorna il renderer e la camera quando la finestra cambia dimensioni
  window.addEventListener("resize", function () {
    const isFullscreen = document.fullscreenElement !== null;
    const width = isFullscreen ? window.innerWidth : window.innerWidth * 0.5;
    const height = isFullscreen ? window.innerHeight : window.innerHeight * 0.5;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
}

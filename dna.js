// Scene setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("dnaCanvas"),
  alpha: true,
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 40;

// DNA parameters (B-DNA right-handed helix)
const radius = 6;
const heightStep = 0.8;
const turns = 10;

// Materials
const materialA = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
const materialB = new THREE.MeshBasicMaterial({ color: 0x6366f1 });
const bondMaterial = new THREE.LineBasicMaterial({ color: 0x94a3b8 });

// Geometry containers
const strandA = [];
const strandB = [];

// Create helix
for (let i = 0; i < turns * 20; i++) {
  const angle = i * 0.3;
  const y = i * heightStep * 0.5;

  // Right-handed helix (B-DNA)
  const x1 = radius * Math.cos(angle);
  const z1 = radius * Math.sin(angle);

  const x2 = radius * Math.cos(angle + Math.PI);
  const z2 = radius * Math.sin(angle + Math.PI);

  // Strand A
  const sphereA = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 8, 8),
    materialA
  );
  sphereA.position.set(x1, y - 20, z1);
  scene.add(sphereA);
  strandA.push(sphereA);

  // Strand B
  const sphereB = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 8, 8),
    materialB
  );
  sphereB.position.set(x2, y - 20, z2);
  scene.add(sphereB);
  strandB.push(sphereB);

  // Base pair (connection)
  const points = [];
  points.push(new THREE.Vector3(x1, y - 20, z1));
  points.push(new THREE.Vector3(x2, y - 20, z2));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, bondMaterial);
  scene.add(line);
}

// Light rotation animation
function animate() {
  requestAnimationFrame(animate);

  scene.rotation.y += 0.003; // slow right-handed spin

  renderer.render(scene, camera);
}

animate();

// Resize handling
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

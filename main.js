import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,1,1000);
camera.position.set(2,3,6);
camera.lookAt(0,0,0)

const groundGometry = new THREE.PlaneGeometry(20,20,32,32);
groundGometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    side:THREE.DoubleSide
});

const groundMesh = new THREE.Mesh(groundGometry,groundMaterial);
groundMesh.receiveShadow = true;
groundMesh.castShadow = true;
scene.add(groundMesh);


const spotLight = new THREE.SpotLight(0xffffff, 90, 100, 0.6, 0.5);
spotLight.position.set(0, 10, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = - 0.0001;
scene.add(spotLight);

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.enablePan = true;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = true;
controls.target =new THREE.Vector3(0,1,0);
controls.update();
const loader = new GLTFLoader().setPath('millennium_falcon/');
loader.load(
	// resource URL
	'scene.gltf',
	// called when the resource is loaded
	function ( gltf ) {
        const mesh = gltf.scene;
        mesh.traverse((child) => {
            if(child.isMesh){
                child.castShadow = true;
                child.receiveShadow = true;
            }
        })
        mesh.position.set(0,1.25,0);
		scene.add( mesh );
	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

let angle = 0;
const radius = 5;


function animate(){
    requestAnimationFrame(animate);
    // console.log( controls.isUserInteracting)
    //  if (!controls.isUserInteracting) {
    //     angle += 0.01 / 2; // Adjust the speed here
    //     camera.position.x = radius * Math.sin(angle);
    //     camera.position.z = radius * Math.cos(angle);
    //     camera.lookAt(new THREE.Vector3(0,0,0));
    //  }
    

    controls.update();
    renderer.render(scene,camera);
}

animate();
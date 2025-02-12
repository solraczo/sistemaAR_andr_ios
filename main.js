import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/loaders/GLTFLoader.js';
import { ARButton } from 'https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/webxr/ARButton.js';

// Variables globales
let camera, scene, renderer;
let model;

// Tamaño del modelo
const modelScale = new THREE.Vector3(0.5, 0.5, 0.5);

// Inicializar la escena
function init() {
    console.log('Inicializando escena...');

    // Escena
    scene = new THREE.Scene();

    // Cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Botón AR
    const arButton = ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] });
    document.body.appendChild(arButton);
    console.log('Botón AR creado.');

    // Luz ambiental
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Cargar el modelo GLTF
    const loader = new GLTFLoader();
    loader.load(
        'sistema10.gltf', // Ruta al archivo .gltf
        (gltf) => {
            console.log('Modelo cargado correctamente.');
            model = gltf.scene;
            model.scale.copy(modelScale);
            model.position.set(0, 0, -1); // Posición inicial del modelo
            scene.add(model);
        },
        (xhr) => {
            console.log(`Cargando modelo: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
        },
        (error) => {
            console.error('Error al cargar el modelo:', error);
        }
    );

    // Configurar el bucle de renderizado
    renderer.setAnimationLoop(render);
}

// Función de renderizado
function render() {
    renderer.render(scene, camera);
}

// Manejar el redimensionado de la ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Verificar soporte de WebXR
if ('xr' in navigator) {
    console.log('WebXR está disponible en este navegador.');
    navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        if (supported) {
            console.log('WebXR AR es soportado en este dispositivo.');
            init(); // Inicializar la escena si WebXR AR es soportado
        } else {
            console.log('WebXR AR no es soportado en este dispositivo.');
            alert('WebXR AR no es soportado en este dispositivo.');
        }
    }).catch((error) => {
        console.error('Error al verificar soporte de WebXR AR:', error);
    });
} else {
    console.log('WebXR no está disponible en este navegador.');
    alert('WebXR no está disponible en este navegador.');
}

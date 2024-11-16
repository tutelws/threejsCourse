import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * TEXTURES
 */

const textureLoader = new THREE.TextureLoader()
const bakedShadowTexture = textureLoader.load('textures/bakedShadow.jpg')
const simpleShadowTexture = textureLoader.load('textures/simpleShadow.jpg')

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.09)
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.27)
directionalLight.castShadow = true

//shadows resolution
directionalLight.shadow.mapSize.set(1024, 1024)

//shadows camera
const shadowCamera = directionalLight.shadow.camera
shadowCamera.near = 1
shadowCamera.far = 6
shadowCamera.top = 2
shadowCamera.right = 2
shadowCamera.bottom = -2
shadowCamera.left = -2
gui.add(directionalLight.shadow, 'radius').min(0).max(10).step(0.001).name("Shadow Radius")

const dirLightShadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(dirLightShadowCameraHelper)
dirLightShadowCameraHelper.visible = false
gui.add(dirLightShadowCameraHelper, 'visible').name("Shadow Camera")

directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)

//SPOTLIGHT
const spotLight = new THREE.SpotLight(0xffffff, 3.6, 10, 0.385)
spotLight.castShadow = true;
//spotLight.shadow.camera.fov = 30 //U CANT CHANGE FOV. IT ALWAYS OVERRIDDEN BY SPOTLIGHT ANGLE
spotLight.shadow.mapSize.set(1024, 1024)
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 5
spotLight.position.set(0, 2, 2)

const spotLightTweaks = gui.addFolder('spotLight')
spotLightTweaks.add(spotLight, 'angle').min(0).max(1).step(0.001)
spotLightTweaks.add(spotLight.position, 'x').min(-5).max(5).step(0.001)
spotLightTweaks.add(spotLight.position, 'y').min(-5).max(5).step(0.001)
spotLightTweaks.add(spotLight.position, 'z').min(-5).max(5).step(0.001)
const spotLightTargetTweaks = spotLightTweaks.addFolder('target')
spotLightTargetTweaks.add(spotLight.target.position, 'x').min(-5).max(5).step(0.001)
spotLightTargetTweaks.add(spotLight.target.position, 'y').min(-5).max(5).step(0.001)
spotLightTargetTweaks.add(spotLight.target.position, 'z').min(-5).max(5).step(0.001)
scene.add(spotLight)
scene.add(spotLight.target)

const spotLightShadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightShadowCameraHelper.visible = false
scene.add(spotLightShadowCameraHelper)
spotLightTweaks.add(spotLightShadowCameraHelper, 'visible').name('SpotLight Shadow Camera')

//POINTLIGHT 
const pointLight = new THREE.PointLight(0xffffff, 2.7)
pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.5
pointLight.shadow.camera.far = 6
pointLight.position.set(-1, 1, 0)
const pointLightShadowCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightShadowCameraHelper.visible = false
gui.add(pointLightShadowCameraHelper, 'visible').name('PointLight Shadow Camera')
scene.add(pointLightShadowCameraHelper)
//pointLight.shadow.mapSize(1024, 1024)
scene.add(pointLight)//


/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.receiveShadow = true

plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

scene.add(sphere, plane)

const sphereShadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        alphaMap: simpleShadowTexture,
        transparent: true
    })
)
sphereShadowPlane.rotateX(-Math.PI * 0.5) 
sphereShadowPlane.position.y = plane.position.y + 0.001
scene.add(sphereShadowPlane)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//SHADOWS
renderer.shadowMap.enabled = false
//gui.add(renderer.shadowMap, 'enabled').name('Realtime Shadows')// U CANT TOGGLE SHADOWS
//renderer.shadowMap.type = THREE.BasicShadowMap //the most efficient no soft edges and no raduis
renderer.shadowMap.type = THREE.PCFShadowMap //default, a bit soft + u can apply radius
//renderer.shadowMap.type = THREE.PCFSoftShadowMap //radius will not work
//renderer.shadowMap.type = THREE.VSMShadowMap //less perfomant and a bit unstable
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update the sphere
    sphere.position.x = Math.cos(elapsedTime) * 1.5
    sphere.position.z = Math.sin(elapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))
    //Update sphereShadow
    sphereShadowPlane.position.x = sphere.position.x
    sphereShadowPlane.position.z = sphere.position.z
    sphereShadowPlane.material.opacity = (1 - sphere.position.y) * 0.8

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
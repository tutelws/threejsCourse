import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/Addons.js'

const gui = new GUI({
    width: 300,
    title: 'debug-gui',
    closeFolders: false
})

window.addEventListener('keydown', (event) => 
{
    if (event.key == 'h')
        gui.show(gui._hidden)
})
const guiDebugObject = {}
guiDebugObject.matColor = '#ffffff'
guiDebugObject.pointLightRot = {x: 0, y: 0}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * TEXTURES
 */
const textureLoader = new THREE.TextureLoader()
const doorColor = textureLoader.load('/textures/door/color.jpg')
const doorAlpha = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcc = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeight = textureLoader.load('/textures/door/height.jpg')
const doorNormal = textureLoader.load('/textures/door/normal.jpg')
const doorMetalness = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughness = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')

doorColor.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace

/**
 * MESHES
 */
const material = new THREE.MeshPhysicalMaterial()
// new THREE.MeshStandardMaterial() // physics based rendering
material.metalness = 0
material.roughness = 0
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)
gui.addColor(material, 'sheenColor')

//door
// material.map = doorColor
// material.aoMap = doorAmbientOcc
// material.aoMapIntensity = 1
// material.displacementMap = doorHeight
// material.displacementScale = 0.02
// material.metalnessMap = doorMetalness
// material.roughnessMap = doorRoughness
// material.normalMap = doorNormal
// material.normalScale.set(0.7, 0.7)
// material.alphaMap = doorAlpha
// material.transparent = true

//CLEARCOAT only in physics mat
// material.clearcoat = 1
// material.clearcoatRoughness = 0
// gui.add(material, 'clearcoat').min(0).max(1).step(0.001)
// gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.001)

//SHEEN usually for fluffy materials
// material.sheen = 1
// material.sheenRoughness = 0.25
// material.sheenColor.set(1, 1, 1)

// gui.add(material, 'sheen').min(0).max(1).step(0.001)
// gui.add(material, 'sheenRoughness').min(0).max(1).step(0.001)

// IRIDESCENCE
material.iridescence = 1
material.iridescenceIOR = 1
material.iridescenceThicknessRange = [100, 800]

gui.add(material, 'iridescence').min(0).max(1).step(0.001)
gui.add(material, 'iridescenceIOR').min(0).max(2.333).step(0.001)
gui.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1)
gui.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1)

//TRANSMISSION
material.transmission = 1
material.ior = 1.5 // Index Of Reflection 
//water = 1.333
//diamond = 2.417
//air = 1.000293
//check wiki 
//...


material.thickness = 0.5
gui.add(material, 'transmission').min(0).max(1).step(0.001)
gui.add(material, 'ior').min(1).max(10).step(0.001)
gui.add(material, 'thickness').min(1).max(10).step(0.001)

// new THREE.MeshToonMaterial()
// material.map = doorColor
// material.gradientMap = gradientTexture
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter

// new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff)

// new THREE.MeshLambertMaterial() - uses lights

// new THREE.MeshDepthMaterial()

// new THREE.MeshMatcapMaterial()

// new THREE.MeshNormalMaterial()

// new THREE.MeshBasicMaterial({map: doorColor})
material.color = new THREE.Color(guiDebugObject.matColor)
material.matcap = matcapTexture


// material.flatShading = true
// material.transparent = true
// material.opacity = 1
// material.alphaMap = doorAlpha
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
)
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 64, 64),
    material
)
sphere.position.x = -1.5
torus.position.x = 1.5
scene.add(sphere, plane, torus)

/**
 * LIGHTS
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
//scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 30)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
pointLight.rotation.x = guiDebugObject.pointLightRot.x;
pointLight.rotation.y = guiDebugObject.pointLightRot.y;

//scene.add(pointLight)

/**
 * ENVIRONMENT MAP it gives own light so u can get rid of ur lightning 
 */
const rgbeLoader = new RGBELoader()
rgbeLoader .load('./textures/environmentMap/2k.hdr', (map) => {
    map.mapping = THREE.EquirectangularReflectionMapping
    scene.background = map
    scene.environment = map
})


/**
 * DEBUG GUI
 */
gui
    .add(material, 'wireframe')
gui
    .addColor(guiDebugObject, 'matColor')
    .onChange((value) => {
        material.color.set(guiDebugObject.matColor)
    })
gui.add(pointLight.position, 'x').min(-10).max(10).step(0.001)
gui.add(pointLight.position, 'y').min(-10).max(10).step(0.001)
gui.add(pointLight.position, 'z').min(-10).max(10).step(0.001)
gui.add(guiDebugObject.pointLightRot, 'x').min(0).max(Math.PI * 2).step(0.001)
    .onChange((value) => pointLight.rotation.x = value) //cant rotate light?
gui.add(guiDebugObject.pointLightRot, 'y').min(0).max(Math.PI * 2).step(0.001)
    .onChange((value) => pointLight.rotation.y = value) //cant rotate light?

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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    sphere.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    sphere.rotation.x = -0.15 * elapsedTime
    torus.rotation.x = -0.15 * elapsedTime
    plane.rotation.x = -0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
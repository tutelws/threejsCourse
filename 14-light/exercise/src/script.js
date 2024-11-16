import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/Addons.js'

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
 * Lights
 */
//#region Ambient Light [LOW COST]
const ambientColor = new THREE.Color(0xffffff)
const ambientLight = new THREE.AmbientLight(ambientColor, 0.2)

scene.add(ambientLight)
const ambientLightTweaks = gui.addFolder('ambLight')
ambientLightTweaks.add(ambientLight, 'intensity').min(0).max(3).step(0.01)

//#endregion

//#region Hemisphere Light [LOW COST]
const hem = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1)
scene.add(hem)
//#endregion

//#region Direction Light [MEDIUM COST]
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.5)
scene.add(directionalLight)
const dirLightTweaks = gui.addFolder('dirLight')
dirLightTweaks.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
dirLightTweaks.add(directionalLight.position, 'x').min (-5).max(5).step(0.001)
dirLightTweaks.add(directionalLight.position, 'y').min (-5).max(5).step(0.001)
dirLightTweaks.add(directionalLight.position, 'z').min (-5).max(5).step(0.001)
dirLightTweaks.close()
//#endregion

//#region Point Light [MEDIUM COST]
const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = 1
pointLight.position.y = 0.3
pointLight.position.z = -0.6
const pointLightTweaks = gui.addFolder('pointLight')
pointLightTweaks.add(pointLight, 'intensity').min(0).max(3).step(0.001)
pointLightTweaks.add(pointLight, 'distance').min(0).max(10).step(0.01)
pointLightTweaks.add(pointLight, 'decay').min(0).max(10).step(0.001)
const pointLightPosTweaks = pointLightTweaks.addFolder('position')
pointLightPosTweaks.add(pointLight.position, 'x').min (-5).max(5).step(0.001)
pointLightPosTweaks.add(pointLight.position, 'y').min (-5).max(5).step(0.001)
pointLightPosTweaks.add(pointLight.position, 'z').min (-5).max(5).step(0.001)

pointLightTweaks.close()
scene.add(pointLight)
//#endregion

//#region Spot Light [HIGH COST]
const spotLight = new THREE.SpotLight(0xff9000, 4.5, 10, Math.PI * 0.03, 0.115, 1)
spotLight.position.x = 0
spotLight.position.y = 2
spotLight.position.z = 3

const spotLightTweaks = gui.addFolder('spotLight')
spotLightTweaks.add(spotLight, 'intensity').min(0).max(10).step(0.001)
spotLightTweaks.add(spotLight, 'angle').min(-1).max(1).step(0.001)
spotLightTweaks.add(spotLight, 'penumbra').min(0).max(4).step(0.001)
const spotLightPosTweaks = spotLightTweaks.addFolder('position')
spotLightPosTweaks.add(spotLight.position, 'x').min(-5).max(5).step(0.001)
spotLightPosTweaks.add(spotLight.position, 'y').min(-5).max(5).step(0.001)
spotLightPosTweaks.add(spotLight.position, 'z').min(-5).max(5).step(0.001)

//Spotlight direction controlls by its target
const spotLightTargetTweaks = spotLightTweaks.addFolder('spotlightTargetPos')
spotLightTargetTweaks.add(spotLight.target.position, 'x').min(-5).max(5).step(0.001)
spotLightTargetTweaks.add(spotLight.target.position, 'y').min(-5).max(5).step(0.001)
spotLightTargetTweaks.add(spotLight.target.position, 'z').min(-5).max(5).step(0.001)
//rot doesn't work (it always looks at 0,0,0 pos)
//const spotLightRotTweaks = spotLightTweaks.addFolder('rotation')
//spotLightRotTweaks.add(pointLight.rotation, 'x').min(-Math.PI).max(Math.PI).step(0.001)
//spotLightRotTweaks.add(pointLight.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001)
spotLightTweaks.close()
scene.add(spotLight)
//do not forget to add target into scene
scene.add(spotLight.target)
//#endregion

//#region RectArea Light [HIGH COST] Only works with MeshStandardMaterial and MeshPhysicalMaterial
const rectLight = new THREE.RectAreaLight(0x4e00ff, 1, 2, 2)
rectLight.position.z = -1
rectLight.position.x = -1
rectLight.rotateY(Math.PI)
scene.add(rectLight)

const rectLightTweaks = gui.addFolder('rectLight')
rectLightTweaks.add(rectLight, 'intensity').min(0).max(3).step(0.001)
const rectLightPosTweaks = rectLightTweaks.addFolder('position')
rectLightPosTweaks.add(rectLight.position, 'x').min(-5).max(5).step(0.001)
rectLightPosTweaks.add(rectLight.position, 'y').min(-5).max(5).step(0.001)
rectLightPosTweaks.add(rectLight.position, 'z').min(-5).max(5).step(0.001)

const rectLightRotTweaks = rectLightTweaks.addFolder('rotation')
rectLightRotTweaks.add(rectLight.rotation, 'x').min(-Math.PI).max(Math.PI).step(0.001)
rectLightRotTweaks.add(rectLight.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001)
rectLightRotTweaks.add(rectLight.rotation, 'z').min(-Math.PI).max(Math.PI).step(0.001)
//#endregion


//#region Helpers
const hemLightHelper = new THREE.HemisphereLightHelper(hem, 0.2)
scene.add(hemLightHelper)

const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(dirLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2)
scene.add(spotLightHelper)

const rectAreaLightHelper = new RectAreaLightHelper(rectLight)
//scene.add(rectAreaLightHelper)
//#endregion 

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
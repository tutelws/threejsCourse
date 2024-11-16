import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'

//DEBUG
const gui = new GUI({
    width: 300,
    title: 'debugggg',
    closeFolders: false
})

window.addEventListener('keydown', (event) => 
{
    if (event.key == 'h')
        gui.show(gui._hidden)
})
const guiDebugObject = {}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
guiDebugObject.color = '#123457'
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: guiDebugObject.color })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const cubeTweaks = gui.addFolder('cubeTweaks')
cubeTweaks.close()

cubeTweaks 
    .add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('elevation')
cubeTweaks 
    .add(mesh, 'visible')
cubeTweaks 
    .add(material, 'wireframe')
cubeTweaks 
    .addColor(guiDebugObject, 'color')
    .onChange((value) => {
        material.color.set(guiDebugObject.color)
    })

guiDebugObject.subdivision = 2
cubeTweaks 
    .add(guiDebugObject, 'subdivision')
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange((value) => 
    {
        mesh.geometry.dispose()
        mesh.geometry = new THREE.BoxGeometry(
            1, 1, 1, 
            value, value, value)
    })

guiDebugObject.spin = () =>
{
    gsap.to(mesh.rotation, {y: mesh.rotation.y + Math.PI * 2})
}

cubeTweaks
    .add(guiDebugObject, 'spin')

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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
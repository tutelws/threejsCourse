import * as THREE from 'three'
const canvas = document.querySelector('canvas.webglCanvas')

console.log(THREE)

const scene = new THREE.Scene()
const sizes = {
    width: 800,
    height: 600
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
scene.add(renderer)

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cubeMesh)


camera.position.z = 3

renderer.render(scene, camera)
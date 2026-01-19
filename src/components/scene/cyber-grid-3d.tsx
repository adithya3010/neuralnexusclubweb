"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Plane } from "@react-three/drei"
import * as THREE from "three"

function MovingGrid() {
    const gridRef = useRef<THREE.Mesh>(null!)

    useFrame((state) => {
        if (!gridRef.current) return
        // Move texture/position to simulate forward movement
        gridRef.current.position.z = (state.clock.getElapsedTime() * 0.5) % 2
    })

    return (
        <Plane args={[30, 30, 20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} ref={gridRef}>
            <meshBasicMaterial
                color="#7D52FD"
                wireframe
                transparent
                opacity={0.15}
            />
        </Plane>
    )
}

function FloatingParticles() {
    const group = useRef<THREE.Group>(null!)
    useFrame((state) => {
        if (!group.current) return
        group.current.rotation.y = state.clock.getElapsedTime() * 0.2
    })

    return (
        <group ref={group}>
            {/* Simple geometric floating shapes */}
            <mesh position={[2, 1, 0]}>
                <octahedronGeometry args={[0.5]} />
                <meshBasicMaterial color="#9D86FF" wireframe />
            </mesh>
            <mesh position={[-2, 0.5, 1]}>
                <icosahedronGeometry args={[0.3]} />
                <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.3} />
            </mesh>
        </group>
    )
}

export function CyberGrid3D() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full pointer-events-none opacity-50">
            <Canvas camera={{ position: [0, 1, 5], fov: 60 }} gl={{ alpha: true }}>
                <ambientLight intensity={0.5} />
                <MovingGrid />
                <FloatingParticles />
                <fog attach="fog" args={['#000', 2, 10]} />
            </Canvas>
        </div>
    )
}

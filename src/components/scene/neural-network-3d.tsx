"use client"

import { useRef, useState, useEffect, ReactNode } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial, Line } from "@react-three/drei"
import * as THREE from "three"

function Particles({ count = 50 }) {
    const points = useRef<THREE.Points>(null!)
    const [particlesPosition, setParticlesPosition] = useState<Float32Array | null>(null)

    useEffect(() => {
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 10
            const y = (Math.random() - 0.5) * 10
            const z = (Math.random() - 0.5) * 10
            positions.set([x, y, z], i * 3)
        }
        setTimeout(() => setParticlesPosition(positions), 0)
    }, [count])

    useFrame((state) => {
        if (!points.current) return
        // Rotation Animation
        points.current.rotation.x = state.clock.getElapsedTime() * 0.1
        points.current.rotation.y = state.clock.getElapsedTime() * 0.05
    })

    if (!particlesPosition) return null

    return (
        <Points ref={points} positions={particlesPosition} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#9D86FF"
                size={0.15}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.8}
            />
        </Points>
    )
}

function Connections({ count = 30 }) {
    const [lines, setLines] = useState<ReactNode[]>([])

    useEffect(() => {
        const lineComponents: ReactNode[] = []
        for (let i = 0; i < count; i++) {
            // Random endpoints for mockup visual lines
            const start = [
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            ] as [number, number, number]
            const end = [
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            ] as [number, number, number]

            lineComponents.push(
                <Line
                    key={i}
                    points={[start, end]}
                    color="#7D52FD"
                    lineWidth={1}
                    opacity={0.3}
                    transparent
                />
            )
        }
        setTimeout(() => setLines(lineComponents), 0)
    }, [count])

    const group = useRef<THREE.Group>(null!)

    useFrame((state) => {
        if (!group.current) return
        group.current.rotation.x = state.clock.getElapsedTime() * 0.1
        group.current.rotation.y = state.clock.getElapsedTime() * 0.05
    })

    return <group ref={group}>{lines}</group>
}

export function NeuralNetwork3D() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ alpha: true }}>
                <ambientLight intensity={0.5} />
                <Particles count={150} />
                <Connections count={40} />
            </Canvas>
        </div>
    )
}

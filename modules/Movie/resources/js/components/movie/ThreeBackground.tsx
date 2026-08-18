import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
    const mountRef = useRef<HTMLDivElement>(null);
    const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
        });
        renderer.setClearColor(0x030303, 1);
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities: { x: number; y: number; z: number }[] = [];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

            velocities.push({
                x: (Math.random() - 0.5) * 0.005,
                y: (Math.random() - 0.5) * 0.005,
                z: (Math.random() - 0.5) * 0.002,
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
            color: 0x444444,
            size: 0.08,
            transparent: true,
            opacity: 0.3,
        });
        const points = new THREE.Points(geometry, material);
        scene.add(points);

        const maxConnections = particleCount * 3;
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array(maxConnections * 3);
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x222222,
            transparent: true,
            opacity: 0.08,
        });
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);

        camera.position.z = 10;

        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.current.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', handleMouseMove);

        let animationFrameId: number;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
            mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

            camera.position.x = mouse.current.x * 1.5;
            camera.position.y = mouse.current.y * 1.5;
            camera.lookAt(scene.position);

            const posArr = geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                posArr[i * 3] += velocities[i].x;
                posArr[i * 3 + 1] += velocities[i].y;
                posArr[i * 3 + 2] += velocities[i].z;

                if (Math.abs(posArr[i * 3]) > 15) velocities[i].x *= -1;
                if (Math.abs(posArr[i * 3 + 1]) > 15) velocities[i].y *= -1;
                if (Math.abs(posArr[i * 3 + 2]) > 8) velocities[i].z *= -1;
            }
            geometry.attributes.position.needsUpdate = true;

            let lineIndex = 0;
            const threshold = 3.5;
            for (let i = 0; i < particleCount; i++) {
                for (let j = i + 1; j < particleCount; j++) {
                    const dx = posArr[i * 3] - posArr[j * 3];
                    const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
                    const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < threshold) {
                        linePositions[lineIndex++] = posArr[i * 3];
                        linePositions[lineIndex++] = posArr[i * 3 + 1];
                        linePositions[lineIndex++] = posArr[i * 3 + 2];
                        linePositions[lineIndex++] = posArr[j * 3];
                        linePositions[lineIndex++] = posArr[j * 3 + 1];
                        linePositions[lineIndex++] = posArr[j * 3 + 2];
                    }
                }
            }
            lineGeometry.setDrawRange(0, lineIndex / 3);
            lineGeometry.attributes.position.needsUpdate = true;

            points.rotation.y += 0.0005;
            lines.rotation.y += 0.0005;

            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            lineGeometry.dispose();
            lineMaterial.dispose();
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} className="fixed inset-0 pointer-events-none z-[-1]" />;
}

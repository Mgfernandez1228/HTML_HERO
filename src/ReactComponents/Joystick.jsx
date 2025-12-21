import { useRef, useEffect, useState, useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { joystickAtom } from '../store.js';
import './Joystick.css';

export default function Joystick() {
    const setJoystick = useSetAtom(joystickAtom);
    const containerRef = useRef(null);
    const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Detect touch device on mount
    useEffect(() => {
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        setIsTouchDevice(hasTouch);
    }, []);

    const OUTER_RADIUS = 60; // Half of 120px outer ring
    const KNOB_RADIUS = 25;  // Half of 50px knob
    const MAX_DISTANCE = OUTER_RADIUS - KNOB_RADIUS;

    const handleMove = useCallback((clientX, clientY) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let deltaX = clientX - centerX;
        let deltaY = clientY - centerY;

        // Calculate distance from center
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Clamp to max distance
        if (distance > MAX_DISTANCE) {
            deltaX = (deltaX / distance) * MAX_DISTANCE;
            deltaY = (deltaY / distance) * MAX_DISTANCE;
        }

        setKnobPos({ x: deltaX, y: deltaY });

        // Normalize to -1 to 1 range for game input
        const normalizedX = deltaX / MAX_DISTANCE;
        const normalizedY = deltaY / MAX_DISTANCE;

        // Apply dead zone (ignore very small movements)
        const deadZone = 0.15;
        const finalX = Math.abs(normalizedX) < deadZone ? 0 : normalizedX;
        const finalY = Math.abs(normalizedY) < deadZone ? 0 : normalizedY;

        setJoystick({ x: finalX, y: finalY });
    }, [setJoystick, MAX_DISTANCE]);

    const handleEnd = useCallback(() => {
        setKnobPos({ x: 0, y: 0 });
        setJoystick({ x: 0, y: 0 });
        setIsDragging(false);
    }, [setJoystick]);

    // Touch event handlers
    const handleTouchStart = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
    }, [handleMove]);

    const handleTouchMove = useCallback((e) => {
        e.preventDefault();
        if (!isDragging) return;
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
    }, [handleMove, isDragging]);

    const handleTouchEnd = useCallback((e) => {
        e.preventDefault();
        handleEnd();
    }, [handleEnd]);

    // Add global touch listeners for when finger moves outside joystick
    useEffect(() => {
        if (!isDragging) return;

        const onTouchMove = (e) => {
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY);
        };

        const onTouchEnd = () => {
            handleEnd();
        };

        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd);
        window.addEventListener('touchcancel', onTouchEnd);

        return () => {
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener('touchcancel', onTouchEnd);
        };
    }, [isDragging, handleMove, handleEnd]);

    // Only render on touch devices
    if (!isTouchDevice) {
        return null;
    }

    return (
        <div 
            className="joystick-container"
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="joystick-outer">
                <div 
                    className="joystick-knob"
                    style={{
                        transform: `translate(${knobPos.x}px, ${knobPos.y}px)`
                    }}
                />
            </div>
        </div>
    );
}


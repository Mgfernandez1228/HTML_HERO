import { useEffect, useState, useCallback, useRef } from 'react'; // Added useRef
import { useSetAtom } from 'jotai';
import { mobileButtonAtom } from '../store.js';

export default function ActionButton() {
    const setMobileButton = useSetAtom(mobileButtonAtom);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    
    // Track the last time a press was processed to prevent "double-firing"
    const lastPressTime = useRef(0);
    const COOLDOWN_MS = 300; 

    useEffect(() => {
        const mq = window.matchMedia("(pointer: coarse)");
        setIsTouchDevice(mq.matches);
        const handler = (e) => setIsTouchDevice(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    const handlePress = useCallback(() => {
        const now = Date.now();
        // If the button was pressed too recently, ignore this event
        if (now - lastPressTime.current < COOLDOWN_MS) return;
        lastPressTime.current = now;

        setIsPressed(true);
        setMobileButton(true);
        
        window.dispatchEvent(new KeyboardEvent('keydown', { 
            code: 'Space', 
            key: ' ', 
            bubbles: true,
            cancelable: true
        }));
    }, [setMobileButton]);

    const handleRelease = useCallback(() => {
        // Only trigger release logic if the button was actually considered "pressed"
        if (!isPressed) return;

        setIsPressed(false);
        setMobileButton(false);
        window.dispatchEvent(new KeyboardEvent('keyup', { 
            code: 'Space', 
            key: ' ', 
            bubbles: true,
            cancelable: true
        }));
    }, [isPressed, setMobileButton]);

    if (!isTouchDevice) return null;

    return (
        <div 
            className={`
                fixed bottom-10 right-10 z-[1000]
                w-24 h-24 select-none touch-none
                transition-transform duration-75
                ${isPressed ? 'scale-90' : 'scale-100'}
            `}
            // e.preventDefault() on Touch prevents the "synthetic" Mouse event from firing
            onTouchStart={(e) => { e.preventDefault(); handlePress(); }}
            onTouchEnd={(e) => { e.preventDefault(); handleRelease(); }}
            
            // Mouse events kept for desktop testing/emulators
            onMouseDown={(e) => { if (e.button === 0) handlePress(); }}
            onMouseUp={handleRelease}
            onMouseLeave={isPressed ? handleRelease : undefined}
        >
            <div className={`
                w-full h-full rounded-full
                flex items-center justify-center
                border-4 transition-colors duration-75
                backdrop-blur-sm
                ${isPressed 
                    ? 'bg-white/40 border-white/80' 
                    : 'bg-white/10 border-white/30'}
                shadow-[0_10px_20px_rgba(0,0,0,0.3)]
            `}>
                <span className="text-white font-black italic tracking-widest text-sm drop-shadow-md pointer-events-none">
                    ACT
                </span>
            </div>
        </div>
    );
}
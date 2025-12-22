import { useEffect, useState, useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { mobileButtonAtom } from '../store.js';

export default function ActionButton() {
    const setMobileButton = useSetAtom(mobileButtonAtom);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(pointer: coarse)");
        setIsTouchDevice(mq.matches);
        const handler = (e) => setIsTouchDevice(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    const handlePress = useCallback(() => {
        setIsPressed(true);
        setMobileButton(true);
        // Dispatching with more detail for better engine compatibility
        window.dispatchEvent(new KeyboardEvent('keydown', { 
            code: 'Space', 
            key: ' ', 
            bubbles: true,
            cancelable: true
        }));
    }, [setMobileButton]);

    const handleRelease = useCallback(() => {
        setIsPressed(false);
        setMobileButton(false);
        window.dispatchEvent(new KeyboardEvent('keyup', { 
            code: 'Space', 
            key: ' ', 
            bubbles: true,
            cancelable: true
        }));
    }, [setMobileButton]);

    if (!isTouchDevice) return null;

    return (
        <div 
            className={`
                fixed bottom-10 right-10 z-[1000]
                w-24 h-24 select-none touch-none
                transition-transform duration-75
                ${isPressed ? 'scale-90' : 'scale-100'}
            `}
            // Important: Use both to support emulator (mouse) and physical device (touch)
            onTouchStart={(e) => { e.preventDefault(); handlePress(); }}
            onTouchEnd={(e) => { e.preventDefault(); handleRelease(); }}
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
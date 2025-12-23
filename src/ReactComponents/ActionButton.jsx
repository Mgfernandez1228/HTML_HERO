import { useEffect, useState, useCallback, useRef } from 'react'; // Added useRef
import { useSetAtom } from 'jotai';
import { mobileButtonAtom, isTextBoxVisibleAtom, encounterAtom, store } from '../store.js';

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
        try{ if(window.__DEBUG_TOUCH) console.debug('[ActionButton] press -> mobileAtom true'); }catch(e){}
        
        // If the textbox is visible and no encounter is active, close it locally.
        // This handles passive dialogues (moved NPCs) which don't schedule encounters.
        try{
            const textVisible = store.get(isTextBoxVisibleAtom);
            const activeEncounter = store.get(encounterAtom);
            const justOpened = !!(window.__TEXTBOX_JUST_OPENED);
            const consume = !!(window.__MOBILE_CONSUME_PRESS);
            try{ if(window.__DEBUG_TOUCH) console.debug('[ActionButton] press flags', { textVisible, activeEncounter: !!activeEncounter, justOpened, consume }); }catch(e){}
            // For passive dialogues (no active encounter) allow closing even if
            // `__MOBILE_CONSUME_PRESS` remains set — users may wait between
            // presses and the flag can sometimes persist. Still prevent the
            // immediate re-close when the textbox was just opened.
            // Only handle the local-close behavior for the specific moved
            // level-2 passive dialogue. Avoid interfering with normal
            // encounters or other textboxes.
            const isPassiveLevel2 = !!(window.__TEXTBOX_IS_PASSIVE_LEVEL2);
            if(isPassiveLevel2 && textVisible && !activeEncounter && !justOpened){
                try{ store.set(isTextBoxVisibleAtom, false); }catch(e){}
                try{ if(window.__DEBUG_TOUCH) console.debug('[ActionButton] closed passive TextBox locally (level2)'); }catch(e){}
                // mark consumed and recently closed to avoid immediate re-open
                try{ window.__MOBILE_CONSUME_PRESS = true; }catch(e){}
                try{ window.__MOBILE_RECENTLY_CLOSED_TEXTBOX = Date.now(); }catch(e){}
                try{ window.__TEXTBOX_IS_PASSIVE_LEVEL2 = false; }catch(e){}
                return;
            }
        }catch(e){}

        // Notify game logic via a dedicated event so initGame can handle the
        // press consistently (avoids synthetic keyboard events and timing races).
        try{ window.dispatchEvent(new CustomEvent('MOBILE_ACT')); }catch(e){}
    }, [setMobileButton]);

    const handleRelease = useCallback(() => {
        // Only trigger release logic if the button was actually considered "pressed"
        if (!isPressed) return;

        setIsPressed(false);
        setMobileButton(false);
        try{ if(window.__DEBUG_TOUCH) console.debug('[ActionButton] release -> mobileAtom false'); }catch(e){}
    }, [isPressed, setMobileButton]);

    if (!isTouchDevice) return null;

    // Use pointer events for unified input handling (touch + mouse). Attach
    // a global pointerup listener on pointerdown to ensure we always detect
    // release even if the pointer leaves the element.
    const onPointerDown = (e) => {
        try{ e.preventDefault(); }catch(err){}
        handlePress();
        // attach a one-time global release handler
        const onGlobalPointerUp = () => {
            try{ handleRelease(); }catch(e){}
            try{ window.removeEventListener('pointerup', onGlobalPointerUp); }catch(e){}
        };
        try{ window.addEventListener('pointerup', onGlobalPointerUp); }catch(e){}
    };

    const onPointerUp = (e) => {
        try{ e.preventDefault(); }catch(err){}
        handleRelease();
    };

    return (
        <div 
            className={`
                fixed bottom-10 right-10 z-[1000]
                w-[168px] h-[168px] select-none touch-none
                transition-transform duration-75
                ${isPressed ? 'scale-90' : 'scale-100'}
            `}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onContextMenu={(e) => { try{ e.preventDefault(); }catch(_){}}}
        >
            <div
                className={`w-full h-full rounded-full flex items-center justify-center border-4 transition-colors duration-75 backdrop-blur-sm shadow-[0_10px_20px_rgba(0,0,0,0.3)]`}
                style={{
                    background: isPressed ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.05)',
                    borderColor: isPressed ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.15)'
                }}
            >
                <span className="text-white font-black italic tracking-widest text-xl sm:text-2xl drop-shadow-md pointer-events-none">
                    ACT
                </span>
            </div>
        </div>
    );
}
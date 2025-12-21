import { useState, useEffect } from 'react';
import './RotateDevice.css';

export default function RotateDevice() {
    const [isPortrait, setIsPortrait] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            const isMobile = window.innerWidth <= 1024;
            const portrait = window.innerHeight > window.innerWidth;
            setIsPortrait(isMobile && portrait);
            if (!portrait) {
                setDismissed(false);
            }
        };

        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    if (!isPortrait || dismissed) return null;

    return (
        <div className="rotate-overlay">
            <div className="rotate-content">
                <div className="rotate-icon">📱</div>
                <div className="rotate-arrow">↻</div>
                <p className="rotate-text">Please rotate your device</p>
                <p className="rotate-subtext">This game is better experienced in landscape mode</p>
                <button 
                    className="rotate-dismiss-btn"
                    onClick={() => setDismissed(true)}
                >
                    Continue anyway
                </button>
            </div>
        </div>
    );
}

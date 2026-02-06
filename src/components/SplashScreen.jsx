import { useState, useEffect } from 'react';
import gameLogo from '../assets/game.png';

export default function SplashScreen({ onComplete }) {
    const [isVisible, setIsVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        // Start fade out after 2 seconds
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 1500);

        // Complete splash after fade animation
        const completeTimer = setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
        }, 2000);

        return () => {
            clearTimeout(timer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0'
                }`}
            style={{ background: 'var(--background)' }}
        >
            <div className="flex flex-col items-center gap-6">
                {/* Animated Logo */}
                <div className="relative">
                    <img
                        src={gameLogo}
                        alt="Billiard TRX"
                        className="w-24 h-24 object-contain animate-bounce"
                        style={{ animationDuration: '1s' }}
                    />
                    {/* Glow effect */}
                    <div
                        className="absolute inset-0 rounded-full blur-xl opacity-50"
                        style={{ background: 'var(--primary)' }}
                    />
                </div>

                {/* App Name */}
                <h1
                    className="text-3xl font-extrabold tracking-tight animate-pulse"
                    style={{ color: 'var(--foreground)' }}
                >
                    Billiard TRX
                </h1>

                {/* Loading dots */}
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{
                                background: 'var(--primary)',
                                animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

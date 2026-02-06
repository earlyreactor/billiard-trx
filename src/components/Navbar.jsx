import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import gameLogo from '../assets/game.png';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="navbar animate-slideUp">
            <a href="#home" className="logo flex items-center gap-2 group">
                <img
                    src={gameLogo}
                    alt="Logo"
                    className="h-10 w-auto object-contain"
                />

                <span className="font-bold text-xl tracking-tight" style={{ color: 'var(--foreground)' }}>
                    Billiard TRX
                </span>
            </a>
            <div className="nav-links flex items-center">
                <a href="#home">Home</a>
                <a href="#analytics">Analytics</a>
                <a href="#dividends">Dividends</a>
                <button
                    onClick={toggleTheme}
                    className="ml-2 p-2 rounded-full hover:bg-white/20 transition-colors"
                    style={{ background: 'transparent', boxShadow: 'none', padding: '0.5rem' }}
                    title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                    {theme === 'light' ? (
                        <Moon size={20} className="text-gray-600" />
                    ) : (
                        <Sun size={20} className="text-yellow-400" />
                    )}
                </button>
            </div>
        </nav>
    );
}


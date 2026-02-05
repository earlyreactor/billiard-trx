import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active-link' : '';
    };

    return (
        <nav className="navbar">
            <a href="#home" className="logo flex items-center gap-2 group">
                <img
                    src="/game.png"
                    alt="Logo"
                    className="h-10 w-auto object-contain hidden sm:block"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                />
                {/* Fallback CSS Logo if image fails or while loading */}
                <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-br from-primary to-accent rounded-full shadow-lg group-hover:scale-110 transition-transform sm:hidden">
                    <span className="text-white font-bold text-lg">B</span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                </div>

                <span className="hidden sm:inline font-bold text-xl tracking-tight text-gray-900">
                    Billiard TRX
                </span>
            </a>
            <div className="nav-links">
                <a href="#home">Home</a>
                <a href="#analytics">Analytics</a>
                <a href="#dividends">Dividends</a>
            </div>
        </nav>
    );
}

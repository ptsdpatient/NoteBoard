import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-gray-800 shadow-md">
            <nav className="container mx-auto p-4 flex items-center justify-between">
                <div className="text-white text-2xl font-semibold">NoteBoard</div>
                <div className="block lg:hidden">
                    {/* Mobile menu button */}
                    <button
                        onClick={toggleMenu}
                        className="text-white focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                </div>
                <div className="hidden text-xl lg:flex space-x-8">
                    <Link
                        to="/"
                        className="text-white hover:text-yellow-300 transition-colors duration-300"
                    >
                        PDF List
                    </Link>
                    <Link
                        to="/whiteboard"
                        className="text-white hover:text-yellow-300 transition-colors duration-300"
                    >
                        Whiteboard
                    </Link>
                    <Link
                        to="/upload"
                        className="text-white hover:text-yellow-300 transition-colors duration-300"
                    >
                        Upload PDF
                    </Link>
                </div>
            </nav>
            {/* Mobile menu */}
            <div
                className={`lg:hidden z-50 fixed inset-0 bg-gray-800 bg-opacity-90 flex flex-col items-center justify-center space-y-4 p-4 transition-transform duration-300 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Close button */}
                <button
                    className="absolute top-4 right-4 text-white text-2xl"
                    aria-label="Close menu"
                    onClick={toggleMenu}
                >
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <div className='flex flex-col gap-12 justify-center items-center'>
                    <Link
                        to="/"
                        className="text-white text-2xl hover:text-yellow-300 transition-colors duration-300"
                        onClick={toggleMenu}
                    >
                        PDF List
                    </Link>
                    <Link
                        to="/whiteboard"
                        className="text-white text-2xl hover:text-yellow-300 transition-colors duration-300"
                        onClick={toggleMenu}
                    >
                        Whiteboard
                    </Link>
                    <Link
                        to="/upload"
                        className="text-white text-2xl hover:text-yellow-300 transition-colors duration-300"
                        onClick={toggleMenu}
                    >
                        Upload PDF
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

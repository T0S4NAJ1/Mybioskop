import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { FaUser, FaShoppingCart, FaSearch } from 'react-icons/fa';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    return (
        <header className="header">
            <div className="container">
                <div className="logo">
                    <Link to="/">My Bioskop</Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
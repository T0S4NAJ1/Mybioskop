import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">

                
                {/* ... bagian Support dan Download App ... */}
                
                <div className="footer-bottom">
                    <p>© 2025 TIX ID - Advance Ticket Sales. All rights reserved.</p>
                    <p>Version 2.1.0</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
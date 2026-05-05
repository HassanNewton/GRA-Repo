import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to="/">Sök hotell</Link></li>

            </ul>
        </nav>
    );
}

export default Navbar;

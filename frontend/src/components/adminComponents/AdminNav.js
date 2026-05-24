import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/home.css'; 

const AdminNav = () => {
    return (
        <header className="home-navbar">
            <div className="d-flex align-items-center">
                {/*Titolo*/}
                <Link to='/admin-home' className="nav-logo">
                    Admin Dashboard
                </Link>
            </div>
        </header>
    );
}

export default AdminNav;
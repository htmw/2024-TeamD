import React from 'react';
import { Outlet, Link } from "react-router-dom";
import { useState } from 'react';
import {
    Navbar,
    NavbarBrand,
    Collapse,
    NavbarToggler,
    Nav,
    NavItem,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';


const Header = () => {

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <Navbar dark color='primary' sticky='top' expand='md'>
            <NavbarBrand className='ms-5' href='/'>

                <h1 className='mt-1'>Market Magician</h1>
            </NavbarBrand>
            <NavbarToggler onClick={() => setMenuOpen(!menuOpen)} />
            <Collapse isOpen={menuOpen} navbar>
                <Nav className='ms-auto' navbar>
                    <NavItem>
                        <NavLink className='nav-link' to='/'>
                            <i className='fa fa-home fa-lg' /> Home
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className='nav-link' to='/buyStocks'>
                            <i className='fa fa-list fa-lg' /> Stocks
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className='nav-link' to='/components/Login'>
                            <i className='fa fa-info fa-lg' /> Login
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className='nav-link' to='/components/SignUp'>
                            <i className='fa fa-address-card fa-lg' /> SignUp
                        </NavLink>
                    </NavItem>
                </Nav>

            </Collapse>
        </Navbar>
    );

};

export default Header;
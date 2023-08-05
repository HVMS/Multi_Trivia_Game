import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from "../../redux/userSlice";
const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('email');
    }
    return (
        <Navbar data-bs-theme="dark" sticky='top' style={{ backgroundColor: "teal" }}>
            <Container>
                <Navbar.Brand href="#home">Trivia Titans</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/game-lobby">Home</Nav.Link>
                        <Nav.Link href="#link" onClick={() => navigate('/profile')}>Profile</Nav.Link>
                        <NavDropdown title="Game" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/game-lobby">Game lobby</NavDropdown.Item>
                            <NavDropdown.Item>
                                Leaderboard
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Content</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Virtual Assistant
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link onClick={()=>navigate('/team-stats') }>My Teams</Nav.Link>
                        <Nav.Link onClick={handleLogout} >Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;
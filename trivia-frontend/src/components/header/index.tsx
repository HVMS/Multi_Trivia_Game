import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from "react-router-dom";
const Header = () => {
    const navigate=useNavigate();
    return (
        <Navbar bg="primary" data-bs-theme="dark" sticky='top'>
                <Container>
                    <Navbar.Brand href="#home">Trivia Challenge</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link" onClick={()=>navigate('/profile')}>Profile</Nav.Link>
                            <NavDropdown title="Game" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Game lobby</NavDropdown.Item>
                                <NavDropdown.Item onClick={()=>navigate('/leaderboard')}>
                                    Leaderboard
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Content</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">
                                    Virtual Assistant
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
    )
}

export default Header;
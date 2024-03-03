import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import LogoutButton from './LogoutButton';

export default function Header() {
  return (
    <Navbar bg="blue" variant="dark" expand="lg" sticky="top" className="Header">
      <Container>
        <Navbar.Brand href="">To-Do List</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="">Home</Nav.Link>
          </Nav>
          <Nav>
            <LogoutButton />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

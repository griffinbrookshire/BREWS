import './Account.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  NavDropdown,
  Form,
  Container,
  Col,
  Row, FormGroup,
} from 'react-bootstrap';
import { Icon } from '@iconify/react';
import accountIcon from '@iconify/icons-mdi/account';
import axios from 'axios';

export default function Account() {

  const [likedBeers, setlikedBeers] = useState([]);
  const [likedBreweries, setLikedBreweries] = useState([]);
  const username = JSON.parse(localStorage.getItem('email')).data;

  useEffect(() => {
    async function getLikedBeers() {
      const response = await axios.get(`/api/users/${username}/beers`);
      setlikedBeers(response.data.likedBeers);
    }
    async function getLikedBreweries() {
      const response = await axios.get(`/api/users/${username}/breweries`);
      setLikedBreweries(response.data.likedBreweries);
    }
    getLikedBeers();
    getLikedBreweries();
  }, []);

  return (
    <div className={'Account'}>
      <Navbar
        className={'my-navbar'}
        bg='dark'
        variant='dark'
        expand='lg'
        fixed='top'
      >
        <Container>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Brand className='' as={Link} to={'/Landing'}>
            <img
              src='/logo.png'
              width='30'
              height='30'
              className='d-inline-block align-top'
              alt='BREWS logo'
              style={{ marginRight: '5px' }}
            />
            <span className='ml-2'>BREWS</span>
          </Navbar.Brand>

          <NavDropdown
            title={
              <div style={{ display: 'inline-block' }}>
                <Icon icon={accountIcon} /> {username}{' '}
              </div>
            }
            id='basic-nav-dropdown'
            className='justify-content-end user-menu'
          >
            <NavDropdown.Item href='/Account'>Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item
              href='/Login'
              onClick={() => {
                localStorage.clear();
              }}
            >
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Container>
      </Navbar>
      <div className={'centered'}>
        <Form>
          <FormGroup as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="2">Email:</Form.Label>
            <Col sm="10">
              <Form.Control plaintext readOnly defaultValue={username} />
            </Col>
          </FormGroup>
          <FormGroup as={Row} className="mb-3" controlId="formLikedBeerList">
            <Form.Label column sm={'8'}>Liked Beers:</Form.Label>
            <Col sm={'10'}>
              <ul className='list-group'>
                {likedBeers.map((beer) => (
                  <li key='{beer.beer._id}' className='list-group-item list-group-item-primary'>{beer.beer.name}</li>
                ))}
              </ul>
            </Col>
          </FormGroup>
          <FormGroup as={Row} className="mb-3" controlId="formLikedBreweriesList">
            <Form.Label column sm={'8'}>Liked Breweries:</Form.Label>
            <Col sm={'10'}>
              <ul className='list-group'>
                {likedBreweries.map((brewery) => (
                    <li key='{brewery.brewery._id}' className='list-group-item list-group-item-primary'>{brewery.brewery.name}</li>
                ))}
              </ul>
            </Col>
          </FormGroup>
        </Form>
      </div>
    </div>
  );
}

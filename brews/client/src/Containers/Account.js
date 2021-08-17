import './Account.css'; //Add if needed
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
  Container,
  Overlay,
  Modal,
  CloseButton,
  ListGroup,
  ListGroupItem,
  Col,
  Row, FormGroup,
} from 'react-bootstrap';
import { Icon } from '@iconify/react';
import accountIcon from '@iconify/icons-mdi/account';
import axios from 'axios';

export default function Account() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [email, setEmail] = useState('');
  const [likedBeers, setlikedBeers] = useState([]);
  const [likedBreweries, setLikedBreweries] = useState([]);

  const [username, setUsername] = useState(
    JSON.parse(localStorage.getItem('email')).data
  );

  const target = useRef(null);
  const history = useHistory();

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
  //const getLikedBeers = async function () {
  //const likedBeerList = await axios.get('/'+Username.data+'/beers');
  //setlikedBeers(likedBeerList);
  //console.log(likedBeers);
  //console.log("hello");
  //console.log(likedBeerList);
  //console.log("hi");
  //}
  //likedBeers();

  const list = {
    items: ['List Item 1', 'List Item 2', 'List Item 3'],
  };

  const state = {
    listitems: ['List Item 1', 'List Item 2', 'List Item 3'],
  };

  const arr = ['List Item 1', 'List Item 2', 'Hello'];

  function handleSubmit(event) {
    event.preventDefault(); //Not sure what this does
    //TODO: Add validation of user credentials. If validated, prime user data for use

    let path = `/Landing`;
    history.push(path);
  }

  return (
    //<div>
      //{console.log(likedBeers)}
      //{likedBeers.map((beer) => (
      //  <li key='{beer.beer._id}'>{beer.beer.name}</li>
      //))}
    //</div>
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
          <Navbar.Brand className='' as={Link} to={'/'}>
            <img
              src='/Brews.svg'
              width='30'
              height='30'
              className='d-inline-block align-top'
              alt='BREWS logo'
              style={{ marginRight: '5px' }}
            />
            <span class='ml-2'>BREWS</span>
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
              href='/'
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

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Navbar,
    Nav,
    NavDropdown,
    Form,
    FormControl,
    Button,
    Container
} from "react-bootstrap";
import MapSection from '../components/map/Map';
import MapDetail from '../components/map/MapDetail'
import client from '@google/maps';
import { Icon } from '@iconify/react';
import accountIcon from '@iconify/icons-mdi/account';
import axios from 'axios';

import "./Landing.css";

const mapsClient = client.createClient({key: "AIzaSyCOLA2dS0_zw0XW7XBdH4V8cO4qOzeWEOc" })

export default function Landing() {

    const username = JSON.parse(localStorage.getItem('email'));
    const [searchText, setSearchText] = useState("");
    const [searchType, setSearchType] = useState("Location")

    //search location lat, lon, used to draw pin on map
    //default to raleigh
    const [location, setLocation] = useState({
        address: 'Raleigh, NC',
        lat: 35.78722391345167,
        lng: -78.68123260251755,
        city: 'Raleigh'
    });

    //map zoom level
    //search sets to 13, selecting brewery zooms to 16
    const [zoomLevel, setZoomLevel] = useState(13);

    //map center, defaulting to raleigh
    //this is set on search and if a user selects a brewery in the details pane
    const [center, setCenter] = useState({
        lat: 35.78722391345167,
        lng: -78.68123260251755
    });

    //map circle points to show (in our case these are the breweries)
    //default to none, but expected format shown below commented out
    const [points, setPoints] = useState([
        // { id: 1, title: "testA", lat: 35.791913030320934, lng: -78.74587743059972 },
        // { id: 2, title: "testB", lat: 35.891913030320934, lng: -78.84587743059972 }
    ]);

    //our list of breweries 
    //used to build detail pane
    const [breweries, setBreweries] = useState([]);

    //details and beers for a selected brewery
    //used to build detail pane
    const [breweryDetail, setBreweryDetail] = useState(null);
    const [breweryBeers, setBreweryBeers] = useState(null);
    
    const handleGeocodeResponse = function(response) {
        if(response !== undefined && response !== null && response.length > 0) {
            let location_label = "";
            let lat = null;
            let lng = null;
            let city = "";

            let geocode_resp = response[0]; //use the first reply
            if('formatted_address' in geocode_resp) {
                location_label = geocode_resp.formatted_address;
            }

            //check for a 'locality' address component -- this should be the city name
            if('address_components' in geocode_resp) {
                geocode_resp.address_components.forEach(address_component => {
                    if(address_component.types.includes('locality')) {
                        city = address_component.long_name; //short_name also available
                    }
                });
            }

            if('geometry' in geocode_resp && 'location' in geocode_resp.geometry) {
                lat = geocode_resp.geometry.location.lat;
                lng = geocode_resp.geometry.location.lng;
            }

            if(location_label !== "" && lat !== null && lng !== null) {
                setLocation({
                    address: "Search Location: "+location_label,
                    lat: lat,
                    lng: lng,
                    city: city
                });

                setCenter({
                    lat: lat,
                    lng: lng,
                })

                getBreweries(city);
            }
        } else {
            console.log('no response from geocoder service');
        }
    }

    const getBreweries = async function(city) {
        const response = await axios.get('/api/breweries/search?city='+city);

        if('data' in response) {
            let brewery_list = [];
            let brewery_points = [];
            let counter = 1;

            response.data.forEach(brewery => {
                if('address' in brewery && 'coords' in brewery.address) {
                    brewery_points.push(
                        { id: counter, title: brewery.name, lat: brewery.address.coords.lat, lng: brewery.address.coords.lng }
                    );

                    brewery.displayid = counter;

                    brewery_list.push(
                        brewery
                    )

                    counter++;
                }
            });

            setZoomLevel(13);
            setPoints(brewery_points);
            setBreweries(brewery_list);
        }
        //this.setState({ totalReactPackages: response.data.total })
    }
  
    const handleSubmit = (evt) => {
        evt.preventDefault();
        clearBrewerySelect()

        if (searchType === 'Location') {
            mapsClient.geocode({address: searchText},
                (error, response) => handleGeocodeResponse(response.json.results)
            );
        } else if (searchType === 'Beer Type') {
            handleSearchByBeerType(searchText)
        }
    }

    const handleSearchByBeerType = async () => {
        const response = await axios.get('/api/breweries/type/'+searchText);

        if('data' in response) {
            let brewery_list = [];
            let brewery_points = [];
            let counter = 1;

            response.data.forEach(brewery => {
                if('address' in brewery && 'coords' in brewery.address) {
                    brewery_points.push(
                        { id: counter, title: brewery.name, lat: brewery.address.coords.lat, lng: brewery.address.coords.lng }
                    );

                    brewery.displayid = counter;

                    brewery_list.push(
                        brewery
                    )

                    counter++;
                }
            });

            setZoomLevel(11);
            setCenter({
                lat: 35.85,
                lng: -78.75
            })
            setPoints(brewery_points);
            setBreweries(brewery_list);

        }
    }

    /**
     * When a brewery is selected, center the map and pull any data we have from our API
     * @param {*} lat 
     * @param {*} lng 
     */
    const handleBrewerySelect = async (lat, lng, name) => {
        setZoomLevel(16);

        setCenter({
            lat: lat,
            lng: lng
        });

        const response = await axios.get('/api/breweries/'+name);
        if('data' in response) {
            let beer_list = []
            for (const beer of response.data.beers) {
                const beer_response = await axios.get('/api/beers/beer_id/'+beer._id);
                beer_list.push(beer_response.data)
            }
            setBreweryDetail(response.data);
            setBreweryBeers(beer_list);
        }
    }

    const clearBrewerySelect = () => {
        setBreweryDetail(null);
        setBreweryBeers(null);
        setZoomLevel(13);
    }

    const handleRecommend = (message) => {
        alert(message);
    }

    const findBeerByAttribute = (attribute) => {
        if (breweryBeers !== null) {

            //search selected brewery for beer with this attribute
            let recommended = [];
            for(const beer of breweryBeers) {
                for(const attr of beer.attributes) {
                    if (attribute === attr) {
                        recommended.push(beer.name);
                    }
                }
            }
            if (recommended.length === 0) {

                //choose random beer found in brewery if non match attribute
                const random = Math.floor(Math.random()*breweryBeers.length);
                return breweryBeers[random].name;
            }
            else {
                const random = Math.floor(Math.random()*recommended.length);
                return recommended[random]
            }
        }
        else {handleRecommend('No brewery selected!');}
    }

    const getRecommendation = async (email) => {
        const response = await axios.get('/api/users/'+email+'/beers');

        if ('data' in response) {
            let attribute_list = []
            if (response.data.likedBeers.length > 0) {

                //create list of all attributes found from the user's liked beers
                for (const it of response.data.likedBeers) {
                    let attributes = it.beer.attributes;

                    for (const it of attributes) {
                        attribute_list.push(it);
                    }
                }

                //hash search to find the most frequent element
                var hash = new Map();
                for (var i=0; i < attribute_list.length; i++) {
                    if (hash.has(attribute_list[i])) {
                        hash.set(attribute_list[i], hash.get(attribute_list[i])+1);
                    }
                    else {
                        hash.set(attribute_list[i], 1);
                    }
                }

                //find max key value
                var max_count = 0, main_attribute = -1;
                hash.forEach((value, key) => {
                    if (max_count < value) {
                        main_attribute = key;
                        max_count = value;
                    }
                });

                //search selected brewery to see if beers have attribute
                let recommended_beers = findBeerByAttribute(main_attribute);
                if (recommended_beers !== null) {
                    handleRecommend('Suggested beer:\n'+recommended_beers);
                }
            }
            else {handleRecommend('No liked beers found in profile!');}
        }
    }

    const handleSearchTypeSelect = (event) => {
        let example = "";
        if(event.target.innerHTML === 'Beer Type') {
            example = ' (e.g. IPA)'
        }

        setSearchType(event.target.innerHTML)
        document.getElementById("search-by").innerHTML = "Search By: " + event.target.innerHTML
        document.getElementById("search-bar").placeholder = "Enter " + event.target.innerHTML.toLowerCase() + example;
    }

    return(
        <div className={"Landing"}>
            <Navbar className={"my-navbar"} bg="dark" variant="dark" expand="lg" fixed="top">
                <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Brand className="" as={Link} to={"/"}>
                    <img
                        src="/logo.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="BREWS logo"
                        style={{ marginRight: '5px' }}
                    />
                    <span className="ml-2">BREWS</span>
                </Navbar.Brand>
                    <Navbar.Collapse id="basic-navbar-nav" className="">
                        <Nav className="" onClick={()=>getRecommendation(username.data)}>
                            <Button variant="outline-info">Find Me A Beer</Button>
                        </Nav>


                    <Form className="d-flex" onSubmit={handleSubmit} style={{ marginLeft: '15px' }}>
                        <FormControl
                        id="search-bar"
                        onChange={e => setSearchText(e.target.value)}
                        value={searchText}
                        type="text"
                        placeholder="Enter location"
                        style={{'marginRight': "1rem"}}
                        />
                        <Button type="submit" variant="outline-info">
                        Search
                        </Button>
                        <NavDropdown title="Search By: Location" id="search-by" className="justify-content-end user-menu">
                            <NavDropdown.Item onClick={handleSearchTypeSelect}>Location</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleSearchTypeSelect}>Beer Type</NavDropdown.Item>
                        </NavDropdown>
                    </Form>

                    </Navbar.Collapse>

                    <NavDropdown title={<div style={{display: "inline-block"}}><Icon icon={accountIcon} /> {username.data} </div>} id="basic-nav-dropdown" className="justify-content-end user-menu">
                        <NavDropdown.Item href="/Account">Profile</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/" onClick={() => {localStorage.clear()}}>Logout</NavDropdown.Item>
                    </NavDropdown>

                </Container>


                
            </Navbar>
            <MapSection handleBrewerySelect={handleBrewerySelect} center={center} location={location} zoomLevel={zoomLevel} points={points} /> 
            <MapDetail clearBrewerySelect={clearBrewerySelect} handleBrewerySelect={handleBrewerySelect} location={location} breweries={breweries} breweryDetail={breweryDetail} breweryBeers={breweryBeers} />
        </div>
    );
}
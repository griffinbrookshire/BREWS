import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ButtonGroup, Button, Badge } from 'react-bootstrap'
import { Icon, InlineIcon } from '@iconify/react';
import thumbUpOutline from '@iconify/icons-mdi/thumb-up-outline';
import thumbUp from '@iconify/icons-mdi/thumb-up';

import './map.css'

function MapDetail ({ clearBrewerySelect, handleBrewerySelect, location, breweries, breweryDetail, breweryBeers }) {

    const [email, setEmail] = useState('');
    const [likedBeers, setlikedBeers] = useState([]);
    const [likedBreweries, setLikedBreweries] = useState([]);
    const [breweryLikeButton, setBreweryLikeButton] = useState(null);
    const [breweryBeerList, setBreweryBeerList] = useState(null);
  
    const [username, setUsername] = useState(
      JSON.parse(localStorage.getItem('email')).data
    );

    const setLikedBeer = async function(beer_name) {
        const response = await axios.put(`/api/users/${username}/beers`, { name: beer_name });
        setlikedBeers(null); //trigger refresh of like beers
    }

    const setLikedBrewery = async function (brewery_name) {
        const response = await axios.put(`/api/users/${username}/breweries`, { name: brewery_name });
        setLikedBreweries(null); //trigger refresh of like button
    }

    const updateBreweryLikeButton = function () {
        if(breweryDetail != null & likedBreweries != null) {

            let liked = false;
            for(let i = 0; i < likedBreweries.length; i++) {
                let brewery = likedBreweries[i];
                if(breweryDetail.name === brewery.brewery.name) {
                    liked = true;
                }
            }          

            if(liked) {
                setBreweryLikeButton(
                <Button variant="info" size="sm" style={{float: "right"}}>
                        <Icon icon={thumbUp} />  Liked
                </Button>
                );
            } else {
                setBreweryLikeButton(
                <Button variant="outline-info" size="sm" style={{float: "right"}} onClick={function(){setLikedBrewery(breweryDetail.name)}}>
                        <Icon icon={thumbUpOutline} />  Like
                </Button>
                )
            }

        }
    }

    const checkBeerLikeButton = function (beer_name) {
        let ret = false;

        if(likedBeers != null) { 

            let liked = false;
            for(let i = 0; i < likedBeers.length; i++) {
                let beer = likedBeers[i];
                if(beer_name === beer.beer.name) {
                    ret = true;
                }
            } 

        }

        return ret;
    }

    const updateBreweryBeerList = function () {
        if((breweryBeers != null)) {
        setBreweryBeerList(breweryBeers.map(({ name, type }) => {
            return (
                <div key={name} class="">
                    <div class="beer_item">
                        {name}                         <span class="beer_type">{type}</span>

                        <br/>
                        <div>
                        {checkBeerLikeButton(name) ? (
                            <Button className="btn-xs" variant="info" size="sm" >
                                <Icon icon={thumbUp} />  Liked
                            </Button>
                        ) : (
                            <Button className="btn-xs" variant="outline-info" size="sm" onClick={function(){setLikedBeer(name)}}>
                                <Icon icon={thumbUpOutline} />  Like
                            </Button>
                        )}

                        </div>
                    
                                    
                    </div>
                    
                </div>
            );
        }));
        }
    }
   
    useEffect(() => {
      async function getLikedBreweries() {
        const response = await axios.get(`/api/users/${username}/breweries`);

        if(JSON.stringify(response.data.likedBreweries) === JSON.stringify(likedBreweries)) {
            //no need to update state
        } else {
            setLikedBreweries(response.data.likedBreweries);
        }

        updateBreweryLikeButton();
      }

      getLikedBreweries();
    }, [breweryDetail, likedBreweries]);

    useEffect(() => {
        async function getLikedBeers() {
            const response = await axios.get(`/api/users/${username}/beers`);

            if(JSON.stringify(response.data.likedBeers) === JSON.stringify(likedBeers)) {
                //no need to update state
            } else {
                setlikedBeers(response.data.likedBeers);
            }

            updateBreweryBeerList();
          }
          getLikedBeers();
    }, [breweryBeers, likedBeers]);

  return (
    <div class="detail-container">

        {/* Brewery List view -- when a search has returned breweries */}
        {(breweries.length > 0 && breweryDetail == null)  &&
        <div>
        <div>
            Found {breweries.length} breweries -- select one to view more details:
        </div>
        <hr/>
        </div>
        }

        {(breweries.length > 0 && breweryDetail == null)  &&
        breweries.map(({ displayid, name, address }) => {
            return (
                <div key={displayid} class="brewery-list-item row" onClick={function(){handleBrewerySelect(address.coords.lat, address.coords.lng, name)}}>
                    <div class="col-1"> <span class="brewery-list-number">{displayid}</span></div>
                    <div class="col-10 brewery-list-item-col"> 
                        <h4 class="brewery-list-title">{name}</h4> 
                        <div>{address.number} {address.street} {address.zip} </div>
                    </div>
                </div>
            );
            })
        }

        {/* Brewery Detail View -- when a brewery has been selected  */}
        {(breweryDetail != null) &&
            <div>
                <p class="mb-0">Selected brewery:</p>
                <h4>{breweryDetail.name}</h4>
                { breweryLikeButton }
                <div>{breweryDetail.address.number} {breweryDetail.address.street} {breweryDetail.address.zip} </div>
                <hr/>
            </div>
        }

        {/* Beer list (if brewery detail view is active) */}
        {(breweryDetail != null && breweryBeers != null) &&
            <div class="mb-3">
                Beers available:
            </div>
        }


        {(breweryDetail != null && breweryBeers != null) &&
            breweryBeerList
        }

        {(breweryDetail != null) &&
            <div class="mt-3">
                <ButtonGroup aria-label="Basic example">
                    <Button variant="outline-secondary" size="sm" onClick={function(){clearBrewerySelect()}}>Back</Button>
                </ButtonGroup>
            </div>
        }

        {/* No brewery list or details available */}
        {(breweries.length === 0 && breweryDetail == null)  &&
        <div>
        <div class=""><b>Welcome to BREWS</b>!<br/>Enter your location in the search bar and select <em>Search</em> to find nearby breweries</div>
        <hr/>

            <div class="details-no-data">
                Nothing to display
            </div>
            </div>
    }

    </div>
  )
}

export default MapDetail
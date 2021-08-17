import React from "react";
import {
  Tooltip,
  OverlayTrigger
} from "react-bootstrap";
import './map.css'

const BreweryMarker = ({ handleBrewerySelect, lat, lng, text, tooltip, $hover }) => {

  const renderTooltip = (tooltip) => (
    <Tooltip id="button-tooltip">
      {tooltip}
    </Tooltip>
  );

  return (
    <OverlayTrigger
    placement="right"
    delay={{ show: 100, hide: 100 }}
    overlay={renderTooltip(tooltip)}
  >
    <div className={$hover ? "circle hover" : "circle"} onClick={function(){handleBrewerySelect(lat, lng, tooltip)}}>
      <span className="circleText">
        {text}
      </span>
    </div>
    </OverlayTrigger>
  );
};

export default BreweryMarker;
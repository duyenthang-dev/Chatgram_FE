import React from 'react';
// import PropTypes from 'prop-types';
import './../pages/Login/Login.css';
import Row from 'react-bootstrap/Row';
const Spinner = (props) => {
    return (
        <div className="d-flex align-items-center h-100 spinner-container">
            <div className="sk-folding-cube">
                <div className="sk-cube1 sk-cube"></div>
                <div className="sk-cube2 sk-cube"></div>
                <div className="sk-cube4 sk-cube"></div>
                <div className="sk-cube3 sk-cube"></div>
            </div>
        </div>
    );
};

Spinner.propTypes = {};

export default Spinner;

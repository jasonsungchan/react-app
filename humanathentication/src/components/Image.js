import './Image.css';
import React from 'react';
import image from './car1.jpg';





export class Image extends React.Component {

    render() {
        return (
            <img className='img1' src={ image } alt="an object" />
        );
    }
}
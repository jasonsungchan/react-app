import './Grid.css';
import React from 'react';

export class Tiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tiles: []
        }
    }
    createTiles(num) {
        for (let i = 0; i < num; i++) {
            this.state.tiles.push(i+1);
        }
        
    }
    render() {
        this.createTiles(528);
        return (
            <div className={this.props.className}>
                {this.state.tiles.map((tile, index) => {
                    return <div className="tile" 
                                id={index + 1} 
                                onClick={this.props.onClick} 
                                key={index}>
                            </div>
                })}
            </div>
        );
    }
}
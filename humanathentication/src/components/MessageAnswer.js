import React from 'react';
import './MessageAnswer.css';

export class MessageAnswer extends React.Component {

    componentDidMount() {

    }
    componentDidUpdate() {

    }

    render() {
        console.log('rendering...');
        return (
            <div className='message-container'>
                <h2 className='message-answer bottom'>{this.props.message}</h2>
                <h2 className='counter bottom'>({this.props.numCorrect}/{this.props.maxCount})</h2>
                <h2 className='attempt-counter bottom'>Attempts remaining: {this.props.attempCounter} </h2>
            </div>
        );
    }
}
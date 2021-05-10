import React from 'react';
import './ImageDisplay.css';
import { Tiles } from './Grid';
import { Image } from './Image';
import { MessageAnswer } from './MessageAnswer';

export class ImageDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: 'Choose answer',
            numCorrect: 0,
            maxCount: 3,
            numAttempt: 0,
            className: 'tiles',
            disable: false
        }

        this.onClickHandler = this.onClickHandler.bind(this);
    }

    onClickHandler(e) {
        let disable = false;
        let newMessage = '';
        const tileId = e.target.id;
        newMessage = this.props.corrects.includes(+tileId) ? 'Correct!' : 'Wrong!';
        if (newMessage === 'Correct!') {
            if (this.state.numCorrect >= this.state.maxCount - 1) {
                this.setState({
                    message: 'Validation success!',
                    numCorrect: this.state.numCorrect + 1,
                })
                disable = true;
            } else {
                this.setState({
                    message: newMessage,
                    numCorrect: this.state.numCorrect + 1,
                })
            }
        } 
        else {
            if (this.state.numAttempt >= this.state.maxCount - 1) {
                this.setState({
                    message: 'Validation failed!',
                    numAttempt: this.state.numAttempt + 1,
                })
                disable = true;
            } else {
                this.setState({
                    message: newMessage,
                    numAttempt: this.state.numAttempt + 1,
                })
            }
        }
        this.props.messageAnswer(newMessage);
        if (disable) {
            this.setState({
                className: 'disabled'
            })
        }
        this.hideTile(e);
    }
    hideTile(e) {
        if (+e.target.id === +1 ||+e.target.id === +2 ||+e.target.id === +23 ||+e.target.id === +24) {
            document.getElementById(1).className = 'hidden';
            document.getElementById(2).className = 'hidden';
            document.getElementById(23).className = 'hidden';
            document.getElementById(24).className = 'hidden';
            document.querySelector('.choice3').style.textDecoration = 'line-through';
            document.querySelector('.choice3').style.color = 'rgb(241, 241, 241)';

        } else if (+e.target.id === +299 ||+e.target.id === +300 ) {
            document.getElementById(299).className = 'hidden';
            document.getElementById(300).className = 'hidden';
            document.querySelector('.choice2').style.textDecoration = 'line-through';
            document.querySelector('.choice2').style.color = 'rgb(241, 241, 241)';
        } else if (+e.target.id === +345) {
            document.getElementById(345).className = 'hidden';
            document.querySelector('.choice1').style.textDecoration = 'line-through';
            document.querySelector('.choice1').style.color = 'rgb(241, 241, 241)';
        }
    }
    render() {
        return (
            <div>
                <div className="display-container">
                    <Tiles onClick={this.onClickHandler} hide={this.hideTile} className={this.state.className} />
                    <Image />
                </div>
                <div>
                    <MessageAnswer
                        numCorrect={this.state.numCorrect}
                        maxCount={this.state.maxCount}
                        message={this.state.message}
                        attempCounter={this.state.maxCount - this.state.numAttempt} />
                </div>
            </div>
        );
    }
}

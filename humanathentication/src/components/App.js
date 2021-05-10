import React from 'react';
import './App.css';
import { ImageDisplay } from './ImageDisplay';



export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      correct: [1, 2, 23, 24, 299, 300, 345],
      incorrect: [],
    };
    this.getCorrects = this.getCorrects.bind(this);
  }
  

  componentDidMount() {

  }

  getCorrects() {
    return this.state.correct;
  }
  messageAnswer(message) {
  }


  render() {

    return (
      <div className="app">
        <div className="instruction">
          <h2 className="question">Find and click the following:</h2>
          <h2 className="choice choice1">1. Letter 'G'</h2>
          <h2 className="choice choice2">2. BMW logo</h2>
          <h2 className="choice choice3">3. Top-most window of gray buidling</h2>
        </div>
        <ImageDisplay corrects={this.getCorrects()} messageAnswer={this.messageAnswer} updateMessage={this.updateMessage} />
      </div>
    )
  }
}
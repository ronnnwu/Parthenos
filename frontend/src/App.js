import React, { Component } from 'react';
import Tutorial from './tutorial/tutorial';
import Competition from './competition/competiton';
import './App.css';


class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
          value: '',
      };
      this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
      e.preventDefault();
      if (this.state.value !=='tutorial' && e.target.value === 'tutorial'){
          this.setState({
              value: 'tutorial',
          });
      }
      else if (this.state.value !=='competition' && e.target.value === 'competition'){
          this.setState({
              value: 'competition',
          });
      }
  }

  render() {

    let displayBlock;

    if (this.state.value ==='tutorial'){
        displayBlock = <Tutorial/>;
    }
    else if (this.state.value ==='competition'){
        displayBlock = <Competition/>;
    }
    else{
        displayBlock = null;
    }

    return (
      <div className="App">
        <div className="App-Title text-center">
          <h1>Parthenos</h1>
          <p>A platform for live data competitions</p>
        </div>
        <br/>
        <div className="todo text-center">
          <button className="btn btn-info btn-large" value="tutorial" onClick={this.handleClick}>Tutorial</button>
          <span>&nbsp;&nbsp;</span>
          <button className="btn btn-info btn-large" value="competition" onClick={this.handleClick}>Competition</button>
        </div>
        <br/>
        <div className="displayBlock">
             { displayBlock }
        </div>

      </div>
    );
  }
}

export default App;

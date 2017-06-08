import React, { Component } from 'react';
import Tutorial from './tutorial/tutorial';
import Competition from './competition/competiton';
import axios from 'axios';
import './App.css';


class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
          value: '',
          problem: null,
          contest: null
      };
      this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){
      axios.get('http://sample-env-2.8t95hzwxpb.us-east-1.elasticbeanstalk.com/tutorial/1')
          .then( (response) => {
              this.setState ({
                  problem: response.data[0]
              });
          });
      axios.get('http://sample-env-2.8t95hzwxpb.us-east-1.elasticbeanstalk.com/competition/1')
          .then( (response) => {
              this.setState ({
                  contest: response.data[0]
              });
          });
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
        displayBlock = <Tutorial problem = {this.state.problem}/>;
    }
    else if (this.state.value ==='competition'){
        displayBlock = <Competition contest = {this.state.contest}/>;
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
          <br/><br/>
      </div>
    );
  }
}

export default App;

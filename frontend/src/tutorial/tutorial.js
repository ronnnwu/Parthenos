/*
 * Created by ronnnwu on 6/4/17.
 */
import React, { Component } from 'react';
import axios from 'axios';

class Tutorial extends Component{

    constructor(props){
        super(props);
        this.state = {
            showProblem : 0,
            showHint: 0,
            showAns: 0,
            problem : {},
            playerSel: [0,0,0],
            correctAns: -1
        };
        this.clickMe = this.clickMe.bind(this);
        this.clickHint = this.clickHint.bind(this);
        this.clickAns = this.clickAns.bind(this);
        this.submitClick = this.submitClick.bind(this);
        this.handleAChange = this.handleAChange.bind(this);
        this.handleBChange = this.handleBChange.bind(this);
        this.handleCChange = this.handleCChange.bind(this);
    }

    componentDidMount(){
        axios.get('http://sample-env-2.8t95hzwxpb.us-east-1.elasticbeanstalk.com/tutorial/1')
            .then( (response) => {
                this.setState ({
                    problem: response.data[0]
                });
            })
    }

    handleAChange(e){
        e.preventDefault();
        let playerSel = this.state.playerSel;
        playerSel[0] = Number(e.target.value);
        this.setState({
            playerSel: playerSel
        });

    }
    handleBChange(e){
        e.preventDefault();
        let playerSel = this.state.playerSel;
        playerSel[1] = Number(e.target.value);
        this.setState({
            playerSel: playerSel
        });

    }
    handleCChange(e){
        e.preventDefault();
        let playerSel = this.state.playerSel;
        playerSel[2] = Number(e.target.value);
        this.setState({
            playerSel: playerSel
        });

    }
    clickMe(e){
        e.preventDefault();
        this.setState({
            showProblem : this.state.showProblem? 0: 1
        })
    }
    clickAns(e){
        e.preventDefault();
        this.setState({
            showAns : this.state.showAns? 0: 1
        })
    }
    clickHint(e){
        e.preventDefault();
        this.setState({
            showHint : this.state.showHint? 0: 1
        })
    }

    submitClick(e){
        e.preventDefault();
        for (let i in this.state.problem.solution) {
            if (this.state.playerSel[0] === this.state.problem.solution[i][0] &&
                this.state.playerSel[1] === this.state.problem.solution[i][1] &&
                this.state.playerSel[2] === this.state.problem.solution[i][2]){

                this.setState({
                    correctAns: 1
                });

                return;
            }
        };

        this.setState({
            correctAns: 0
        });
    }

    render(){

        let block;
        let ans='';
        for (let i in this.state.problem.solution){
            const a = (this.state.problem.solution[i][0]+1).toString();
            const b = (this.state.problem.solution[i][1]+1).toString();
            const c = (this.state.problem.solution[i][2]+1).toString();
            ans = ans + '   |   A'+a+', '+'B'+b+', '+'C'+c;
        }


        if (this.state.showProblem === 0){
            block = (
                <div>
                    <ul>
                        <li>
                            <a onClick={this.clickMe}>Problem 1: Basketball Team Formation</a>
                        </li>
                    </ul>
                </div>
            )
        }
        else{
            block = (
                <div>
                    <a onClick={this.clickMe}>Tutorial</a><span> > Problem 1</span>
                    <br/><br/>
                    <div dangerouslySetInnerHTML = {{__html: this.state.problem.statement}} />
                    <a onClick={this.clickHint}>{ this.state.showHint ? "Hide Hint" : "Show Hint"}</a>
                    { this.state.showHint ? <span>:  {this.state.problem.hint}</span> : null }
                    <br/>
                    <br/><br/>
                    <form onSubmit={this.submitClick}>
                    <div className="form-group">
                        <span>Select a point guard (select one):</span>
                        <select className="form-control" value = {this.state.playerSel[0]} onChange={this.handleAChange}>
                            <option value = {0} >A1</option>
                            <option value = {1} >A2</option>
                            <option value = {2} >A3</option>
                        </select>
                        <br/>
                        <span>Select a center (select one):</span>
                        <select className="form-control" value = {this.state.playerSel[1]} onChange={this.handleBChange}>
                            <option value = {0} >B1</option>
                            <option value = {1} >B2</option>
                            <option value = {2} >B3</option>
                        </select>
                        <br/>
                        <span>Select a power forward (select one):</span>
                        <select className="form-control" value = {this.state.playerSel[2]} onChange={this.handleCChange}>
                            <option value = {0} >C1</option>
                            <option value = {1} >C2</option>
                            <option value = {2} >C3</option>
                        </select>

                        <br/><br/>
                        <input className="btn btn-success" type="submit" value="Submit" />
                    </div>
                    </form>
                    <div style={{color: this.state.correctAns === 1? 'Green': 'Red'}}>{this.state.correctAns === -1? null: ( this.state.correctAns === 1?
                            'Congratulation, your answer is correct.': 'Your answer is not correct.'
                    )}</div>
                    <br/>
                    <a onClick={this.clickAns}>{ this.state.showAns ? "Hide Answer" : "Show Answer"}</a>
                    { this.state.showAns ? <span>:  {ans}</span> : null }
                </div>
            );
        }


        return (
            <div>{block}</div>
        );
    }
}

export default Tutorial;
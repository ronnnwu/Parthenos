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
            problem : {}
        };
        this.clickMe = this.clickMe.bind(this);
    }

    componentDidMount(){
        axios.get('http://sample-env-2.8t95hzwxpb.us-east-1.elasticbeanstalk.com/tutorial/1')
            .then( (response) => {
                this.setState ({
                    problem: response.data[0]
                });
            })
    }


    clickMe(){
        this.setState({
            showProblem : this.state.showProblem? 0: 1
        })
    }

    render(){

        let block;

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

                </div>
            );
        }


        return (
            <div>{block}</div>
        );
    }
}

export default Tutorial;
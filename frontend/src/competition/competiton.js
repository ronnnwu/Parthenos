/*
 * Created by ronnnwu on 6/4/17.
 */
import React, { Component } from 'react';
import axios from 'axios';


class Competition extends Component{

    constructor(props){
        super(props);
        this.state = {
            showProblem : 0,
            problem: props.contest,
            language: 'python',
            textCode: `print "We love Python!"`,
            compiledOut: null,
            errerMsg: null
        };
        this.clickMe = this.clickMe.bind(this);
        this.handleCodeSubmit = this.handleCodeSubmit.bind(this);
        this.handleLangChange = this.handleLangChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);

    }

    handleCodeSubmit(e){
        e.preventDefault();
        this.setState({
            compiledOut : null,
            errerMsg: null
        });
        //console.log(this.state.textCode);
        axios.post('http://sample-env-2.8t95hzwxpb.us-east-1.elasticbeanstalk.com/'+this.state.language, {
           code: this.state.textCode
        })
            .then( (response) => {
                //console.log(response)
                if ( ('output' in response.data) ){
                    this.setState({
                        compiledOut : response.data.output
                    });
                }
                else{
                    this.setState({
                        compiledOut : null
                    });
                }
                if ( ('error' in response.data) ){
                    this.setState({
                        errerMsg : response.data.error
                    });
                }
                else{
                    this.setState({
                        errerMsg : null
                    });
                }
                if ( !(response.data.output) && !(response.data.error)){
                    this.setState({
                        compiledOut : "No output!"
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    handleTextChange(e){
        e.preventDefault();
        this.setState({
            textCode: e.target.value
        })
    }

    handleLangChange(e){
        e.preventDefault();
        this.setState({
            language: e.target.value
        })

        if (e.target.value === 'python'){
            this.setState({
                textCode: `print "We love Python!"`
            })
        }
        else if (e.target.value === 'java'){
            this.setState({
                textCode: `public class main {
    public static void main(String[] args) {
        System.out.println("We love Java!");
    }
}
                `
            })
        }
        else if (e.target.value === 'cpp'){
            this.setState({
                textCode: `#include <iostream>
using namespace std;
int main() { 
   cout<<("We love cpp!")<<endl;
   return 0;
}`
            })
        }
        else if (e.target.value === 'go'){
            this.setState({
                textCode: `package main
func main() {
    println("We love Go!")
}`
            })
        }
    }


    clickMe(e){
        e.preventDefault();
        this.setState({
            showProblem : this.state.showProblem? 0: 1
        })
    }
    render() {
        let block;
        if (this.state.showProblem === 0) {
            block = (
                <div>
                    <ul>
                        <li>
                            <a onClick={this.clickMe}>Contest 1: {this.state.problem.title}</a>
                        </li>
                    </ul>
                </div>
            )
        }
        else {
            block = (
                <div>
                    <a onClick={this.clickMe}>Competition</a><span> > Contest 1</span>
                    <br/><br/>
                    <div dangerouslySetInnerHTML = {{__html: this.state.problem.statement}} />
                    <br/>
                    <br/>
                    <form onSubmit={this.handleCodeSubmit}>
                            <select className="form-control" value={this.state.language} onChange={this.handleLangChange}>
                                <option value="cpp">c++</option>
                                <option value="java">java</option>
                                <option value="go">go</option>
                                <option value="python">python 2</option>
                            </select>
                            <br/>
                            <textarea rows="10" className="form-control" value={this.state.textCode} onChange={this.handleTextChange} />

                        <br/>
                        <input className="btn btn-success" type="submit" value="Submit" />
                    </form>
                    <br/>
                    { (this.state.compiledOut) ? <div className="bg-primary span6"> Output: {this.state.compiledOut} </div> : null}

                    { (this.state.errerMsg) ? <label className="bg-danger span6">{this.state.errerMsg}</label> : null}
                </div>
            );

        }
        return (
            <div>{block}</div>
        );
    }
}

export default Competition;
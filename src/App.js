import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

const API_URL = " https://6xq3m54y0m.execute-api.eu-west-1.amazonaws.com/dev";

class App extends Component {
	constructor(props) {
		super(props);
		// initialize the state
		this.state = {
			testData: null
		};

		this.ax = axios.create({
			baseURL: API_URL,
			timeout: 10000
		});

		// give the class functions access to the component context
		this.search = this.search.bind(this);
		this.searchCallback = this.searchCallback.bind(this);
	}

	search(params){
		console.log(`fetching test ${params.term}`);
		var ax = this.ax;

		// initiate the call
		ax.get(`/tests/${params.term}`)
		.then((response) => {
			var data = response.data
			console.log(data);
			// return the total list
			this.searchCallback(data);
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	searchCallback (data) {
		this.setState({
			testData: data
		});
	}

	render() {
		return (
			<div className="App">
				<SearchBar searchCallback={this.search}/>
				<Test data={this.state.testData}/>
			</div>
		);
	}
}

/**
 * The search header bar including input field, search type selector and search button.
 */
class SearchBar extends Component {
	constructor(props){
		super(props);
		// initialise the state
		this.state = {
			input: ""
		}

		// give the class functions access to the component context
		this.inputChange = this.inputChange.bind(this);
		this.initiateSearch = this.initiateSearch.bind(this);
	}

	/**
	 * Callback for when the search input field is updated.
	 * Updates the state with the new input value.
	 */
	inputChange(event){
		console.log("input changed");
		// set the new value in the state
		this.setState({
			input: event.target.value
		});
	}

	/**
	 * Initiate a search by calling the search callback with the values of the inputs.
	 */
	initiateSearch(event){
		// stop the form from reloading the page
		event.preventDefault();
		// create the search parameters from the current state
		let searchParams = {
			term: this.state.input
		};
		// call the callback
		this.props.searchCallback(searchParams);
	}

	render(){
		return(
			<form className="SearchForm" onSubmit={this.initiateSearch}>
				<input id="search-input" type="text" onChange={this.inputChange}/>
				<button id="search-button">Search</button>
			</form>
		);
	}
}

class Test extends Component {
	render () {
		if (this.props.data === null) {
			return null;
		}

		var d = this.props.data["Item"];
		var questions = d.questions["L"].map((q)=>{
			var options = Object.entries(q["M"].options["M"]).map(([number,option])=>{
				return (<li>{option["S"]}</li>);
			});

			return (
				<div>
				{q["M"].question["S"]}
					<ol>
						{options}
					</ol>
				</div>
			);
		});

		return (
			<div>
				{d.name["S"]}
				{questions}
			</div>
		);
	}
}

export default App;
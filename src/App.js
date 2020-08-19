import React from 'react';
import './App.css';
import firebase from "firebase";
require("dotenv").config();

var firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "covid-19-over-under.firebaseapp.com",
  databaseURL: "https://covid-19-over-under.firebaseio.com",
  projectId: "covid-19-over-under",
  storageBucket: "covid-19-over-under.appspot.com",
  messagingSenderId: "406424898192",
  appId: "1:406424898192:web:930aa112756a8289f1a615"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 8
    };
  }

  handleChange = event => {
    event.preventDefault();
    this.setState({
      value: event.target.value
    });
  }

  getVotes = async () => {
    const votesRef = db.collection("votes");
    const snapshot = await votesRef.get();

    let sum = 0;
    let denom = 0;

    snapshot.forEach(doc => {
      sum += +doc.data().weeks;
      denom += 1;
    });

    let average = sum / denom;
    this.setState({ average: average });
  }

  handleClick = async event => {
    event.preventDefault();

    await db.collection("votes").add({
      weeks: this.state.value
    });

    this.setState({
      value: 8
    });

    localStorage.setItem("voted", "yes");
  }

  componentDidMount() {
    if(localStorage.getItem("voted") === "yes"){
      this.setState({ voted: true });
    }else{
      this.setState({ voted: false });
    }

    this.getVotes();
    setInterval(() => this.getVotes(), 5000);
  }

  render() {
    return (
      <div className="App">
        <div className="header">
          <h1>How long will schools make it this fall before shutting down?</h1>
        </div>
        <div className="average">
          <h3>So far, people think that we will make it ~{this.state.average} weeks before schools get shutdown.</h3>
          <h4>Submit your own estimate:</h4>
        </div>
        {!this.state.voted && (
          <div className="input">
            <input
              type="range"
              min={0}
              max={16}
              value={this.state.value}
              onChange={e => this.handleChange(e)}
              />
            <button
              onClick={e => this.handleClick(e)}
            >
              Submit
            </button>
            <p>{this.state.value} weeks</p>
          </div>
        )}
        {this.state.voted && <p>Thank you for your submission!</p>}
        <div className="footer">
          <p style={{ fontSize: "0.7rem" }}>© 2020 <a href="https://wkoury.com">wkoury</a></p>
        </div>
      </div>
    );
  }
}

export default App;

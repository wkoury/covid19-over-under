import React from "react";
import "./App.css";
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
  constructor(props){
    super(props);
    
    this.state = {
      votes: "",
      average: ""
    }

  }

  getVotes = async () => {
    const votesRef = db.collection("votes");
    const snapshot = await votesRef.get();

    let sum = 0;
    let denom = 0;

    snapshot.forEach(doc => {
      console.log(doc.data().weeks);
      sum += +doc.data().weeks;
      denom += 1;
    });

    let average = sum / denom;
    average = average.toString().substr(0,5);
    this.setState({ average: average, votes: denom });
  }

  componentDidMount(){
    this.getVotes();
  }

  render() {
    return (
      <div className="App">
        <div className="header">
          <h1>How long did people think schools would make it this fall before shutting down?</h1>
          <h4>Thanks to everyone who voted!</h4>
        </div>
        <div className="average">
          <h3>People thought that we would make it ~{this.state.average} weeks before schools got shut down.</h3>
          <h4>{this.state.votes} votes were submitted.</h4>
        </div>
        <div className="footer">
          <p style={{ fontSize: "0.7rem" }}>© 2020 <a href="https://wkoury.com" rel="noopener noreferrer" target="_blank">wkoury</a></p>
        </div>
      </div>
    );
  }
}

export default App;

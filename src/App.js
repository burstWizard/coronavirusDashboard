import React, {Component} from 'react';
import './App.css';
import {Container, Nav} from "./components/styled-components";
import "bootstrap/dist/css/bootstrap.css";
import {Bar} from 'react-chartjs-2';
import axios from 'axios';
import CountUp from 'react-countup';


class App extends Component {
  constructor(props){
    super(props);

    this.onChangeCity = this.onChangeCity.bind(this);
    this.onChangeCountry = this.onChangeCountry.bind(this);
    this.onChangeProvince = this.onChangeProvince.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
        Country: "United States of America",
        Province:  "North Carolina",
        City: "Mecklenburg",
        queriedData: [{Country: "Loading...", Province: "Loading...", City: "Loading...", Deaths: 0, Date:"Loading...", Active:0, Confirmed: 0}],
        graphData:{},
        lastMax: {
            Deaths: 0,
            Active: 0,
            Confirmed: 0,
            Recovered: 0
        }
    }
  }
  updateSimpleQuery(){
    const tempSimple = [];
    const tempLabels = [];
    console.log("Beginning the UpdateSimple QueryFunction")
    for (var key in this.state.queriedData){
        if(this.state.queriedData[key]["Deaths"]==0 && this.state.queriedData[key]["Deaths"] == 0){
            console.log("Start")
        }else{
            if(key>0){
                if(this.state.queriedData[key]["Deaths"]<this.state.queriedData[key-1]["Deaths"]){
                    tempSimple.push(this.state.queriedData[key-1]["Deaths"])
                }else{
                    tempSimple.push(this.state.queriedData[key]["Deaths"])
                }
            }else{
                tempSimple.push(this.state.queriedData[key]["Deaths"])
            }
            tempLabels.push(this.state.queriedData[key]["Last_Update"].substring(0,10))
        }
    }
    this.setState({
        graphData:{
            labels:tempLabels,
            datasets:[
                {
                    label: "Total Deaths",
                    backgroundColor: 'rgba(0,0,0,1)',
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 2,
                    data: tempSimple
                }
            ]
        }
    })
    
}
  queryData(){

        axios.get('https://243rvvq9xb.execute-api.us-east-1.amazonaws.com/dev', {
            params:{
                County:this.state.City,
                State:this.state.Province
            },
            headers:{
              "Content-Type" : "application/json",
            }

          })
            .then(response =>{
              console.log(this.state.City)
                if(response.data.length){
                    this.setState({
                        lastMax:{
                            Deaths: this.state.queriedData[this.state.queriedData.length - 1]["Deaths"],
                            Active: this.state.queriedData[this.state.queriedData.length - 1]["Active"],
                            Confirmed: this.state.queriedData[this.state.queriedData.length - 1]["Confirmed"],
                            Recovered: this.state.queriedData[this.state.queriedData.length - 1]["Recovered"]-this.state.queriedData[this.state.queriedData.length - 1]["Active"]-this.state.queriedData[this.state.queriedData.length - 1]["Deaths"]
                        }
                    })

                    this.setState({queriedData: response.data})
                    console.log(response.data)
                    this.updateSimpleQuery()
                }else{
                    alert("Invalid Query, try to enter different parameters")
                }
            })
            .catch((error)=>{
                console.log(error)
            })
  }
  componentDidMount(){
      this.queryData();
      
  }
  onChangeCountry(e){
    console.log(e.target.value)
      this.setState({
          Country: e.target.value
      })
      console.log("Country Changed")
  }
  onChangeCity(e){
      this.setState({
          City: e.target.value
      });
      console.log(this.state.Country)
  }
  onChangeProvince(e){
      this.setState({
          Province: e.target.value
      });
      console.log(this.state.Province)
  }
  onSubmit(e){
      e.preventDefault();
      console.log("Submitted")
      console.log(this.state.Province)
      console.log(this.state.City)
      this.queryData();
  }
  render(){
  return (
    <Container>

      {/*Navigation Bar/header*/}
      <Nav className = "navbar navbar-expand-lg main-nav fixed-top">
        <Container className = "navbar-brand mb-0">
          Coronavirus Dashboard
        </Container>
        <Container className = "navbar-nav ml-auto">
          <Container>
            Created and Maintained by Hari Shankar
          </Container>
        </Container>
      </Nav>
      
      {/*Main Content Area*/}
      <Container className = "container-fluid pr-5 pl-5 pt-5 pb-5">

        {/* Query Section */}
        <Container className = "row">
          <Container className = "col-lg-4 mb-4">
            <Container className = "card query-card">
              <div className = "form">
                <input type = "text" name = "Country" autoComplete = "off" required = {true} onBlur = {this.onChangeCountry}/>
                <label htmlFor = "Country" className = "label-name">
                  <span className = "content-name">Country</span>
                </label>
              </div>
            </Container>
          </Container>
          <Container className = "col-lg-4 mb-4">
            <Container className = "card query-card">
              <div className = "form">
                <input type = "text" name = "Province" autoComplete = "off" required = {true} onBlur = {this.onChangeProvince}/>
                <label htmlFor = "Province" className = "label-name">
                  <span className = "content-name">Province</span>
                </label>
              </div>
            </Container>
          </Container>
          <Container className = "col-lg-3 mb-4">
            <Container className = "card query-card">
              <div className = "form">
                <input type = "text" name = "City" autoComplete = "off" required = {true} onBlur = {this.onChangeCity}/>
                <label htmlFor = "City" className = "label-name">
                  <span className = "content-name">City</span>
                </label>
              </div>
            </Container>
          </Container>
          <Container className = "col-lg-1 mb-4">
            <Container classname = "card query-card">
              <input type="image" src={require("./assets/search.png")} name="saveForm" className="btTxt submit" id="saveForm" width="65" onClick = {this.onSubmit}/>
            </Container>
          </Container>
        </Container>

        <Container className = "row">
          <Container className = "col-lg-9">
            <Container className = "row mb-4">
              <Container className = "col-lg-4">
                <Container className="card grid-card">
                  <Container className = "card-heading">
                    <Container>
                      Total Deaths
                    </Container>
                  </Container>
                  <Container className="card-value pt-1 number-text">
                    <span><CountUp end={this.state.queriedData[this.state.queriedData.length - 1]["Deaths"]} start={this.state.lastMax["Deaths"]} /></span>
                  </Container>
                </Container>
              </Container>
              <Container className = "col-lg-4">
                <Container className="card grid-card">
                  <Container className = "card-heading">
                    <Container>
                      Total Confirmed Cases
                    </Container>
                  </Container>
                  <Container className="card-value pt-1 number-text">
                    <span><CountUp end={this.state.queriedData[this.state.queriedData.length - 1]["Confirmed"]} start={this.state.lastMax["Confirmed"]}/></span>
                  </Container>
                </Container>
              </Container>
              <Container className = "col-lg-4">
                <Container className="card grid-card">
                  <Container className = "card-heading">
                    <Container>
                      Total Active Cases
                    </Container>
                    
                  </Container>
                  <Container className="card-value pt-1 number-text">
                  <span><CountUp end={this.state.queriedData[this.state.queriedData.length - 1]["Active"]} start={this.state.lastMax["Active"]}/></span>
                  </Container>
                </Container>
              </Container>
            </Container>
            <Container className = "row">
              <Container className = "col-lg-12">
                <Container className = "card grid-card">
                  <Bar
                    data={this.state.graphData}
                    options={{
                    title:{
                    display:true,
                    text:'Total Coronavirus Deaths',
                    fontSize:20
                    },
                    legend:{
                    display:false,
                    position:'right'
                    }
                }}
                height = {100}
                />
                </Container>
                </Container>
            </Container>
          </Container>
          <Container className = "col-lg-3">
            <Container className = "card grid-card">
              
            </Container>
          </Container>
        </Container>
        {/*Left Section*/}

      </Container>
    </Container>
  );
  }
}

export default App;

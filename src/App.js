import React from 'react';
import './App.css';

const weatherBitApiKey = '679dcaf864aa415c812b8a4fe23ba67f';

class MyWeatherComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      weatherForecastData: [],
      city: '',
      returnedCityState: '',
      currentTime: '',
      error: ''
    }
  }

  onChangeCity = (e) => {
    this.setState({city: e.target.value});
  }

  isNumeric(inputtxt) {
    var letters = /^[0-9]+$/;
    if(inputtxt.match(letters)) {
      return true;
    }
    else {
      return false;
    }
  }

  componentDidMount() {
    setInterval(() => {
      let date = new Date();
      this.setState({currentTime: date.toDateString() + ' ' + date.toLocaleTimeString('en-US')})
    }, 1000);
  }

  getWeather = () => {
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${this.state.city}&units=I&key=${weatherBitApiKey}`;
    let selectedData = [];

    fetch(url)
    .then(res => res.json())
    .then(json => {
      selectedData = json.data.slice(0, 7).map((item) => {
        return({date: new Date(item.datetime).toDateString(), day: new Date(item.datetime).toDateString().substr(0, 3), maxTemp: item.max_temp, minTemp: item.min_temp, humidity: item.rh, icon: item.weather.icon, description: item.weather.description})
      })
      this.setState({weatherForecastData: selectedData, returnedCityState: json.city_name + ', ' + (this.isNumeric(json.state_code) ? json.country_code : json.state_code) + ' (' + json.timezone + ')', error: ''});
    })
    .catch(error => this.setState({error: `Error locating forecast for: ${this.state.city}`}))
  }

  render() {
    let today = new Date();
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return(
      <div id='mainDiv'>
        <div>{this.state.currentTime}</div>
        <h1 id='title'>Winnetka Weatherworks</h1>
        <label>City:</label>
        <div className="divider"/>
        <input id='cityInput' onChange={this.onChangeCity} name={'City'} value={this.state.city}></input>
        <div className="divider"/>
        <button id='getWeatherButton' onClick={this.getWeather}>Get 7-day Forecast</button>
        <div id='errorDiv'>{this.state.error}</div>

        <div>
          <div id='cityDiv'>{this.state.returnedCityState}</div>
          {this.state.weatherForecastData.map((item, index) => {
            return(
              <div key={index} id='forecastDayDiv'>
                <div>
                  {item.day}
                </div>
                <div>
                  <img src={process.env.PUBLIC_URL + '/icons/' + item.icon + '.png'} alt="Smiley face" height="80" width="80"/>
                </div>
                <div>
                  {item.description}
                </div>
                <div>
                  {item.maxTemp + '\xB0' + '/' + item.minTemp + '\xB0'}
                </div>
                <div>
                  Humidity {item.humidity + '%'}
                </div>
              </div>
            )
          })}
        </div>
        <div className="footer">
          <p>Winnetka Weatherworks, Inc. Copyright 2020</p>
        </div>
      </div>
    )
  }
}

function App() {
  return (
    <div className="App">
      <MyWeatherComponent>
      </MyWeatherComponent>
    </div>
  );
}

export default App;

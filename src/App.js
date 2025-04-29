import React from 'react';
import './App.css'; // Import your custom CSS
import thunder from './thunder.png'; // Import image directly

function App() {

  /*
    const currentDate = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[currentDate.getMonth()];
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    const formattedDate = `${month} ${day},${year}`;
  */
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(currentDate);

  console.log(formattedDate); // Example output: "May 29, 2024"


  return (
    <div className="App">
      <div className="container">
        <h1 className="container_date">{formattedDate}</h1>
        <div className="weather_data">
          <h2 className="container_city">Pune</h2>
          <img className="container_img" src={thunder} alt="Thunderstorm" />
          <h2 className="container_degree">30°</h2>
          <h2 className="country_per">Thunderstorm</h2>
          <form className="form">
            <input className="input" type="text" placeholder="Search city" />
            <button className="btn" type="submit">Search</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;

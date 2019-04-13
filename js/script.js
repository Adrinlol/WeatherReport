// After the page loads, we get information about the user
window.addEventListener('load', ()=>{
    let long;
    let lat;
    let temperatureDescription = document.querySelector('.temperature-description');
    let temperatureDegree = document.querySelector('.temperature-degree');
    let locationTimezone = document.querySelector('.location-timezone');
    let temperatureSpan = document.querySelector('.temperature span');
    // Button that toggles the temperature
    let temperatureChange = document.querySelector('.toggle-btn');
    
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            // We need to use proxy to get around the bug
            const proxy = 'https://cors-anywhere.herokuapp.com/';
            // Api from Dark Sky that uses long and lat
            const api = `${proxy}https://api.darksky.net/forecast/c3974de5d9efd62be582169eb6e3138e/${lat},${long}`;

            fetch(api)
            // Once we get the information
            .then(data => {
                // After it made to json we use .then again
                return data.json();
            })
            .then(data => {
                // Pulling out information from the api

                const{temperature, summary, icon} = data.currently;
                // Set DOM elements from the api
                temperatureDegree.textContent = temperature;
                temperatureDescription.textContent = summary;
                locationTimezone.textContent = data.timezone;
                //Formula for celius
                let  celsius = Math.floor (temperature - 32) * (5/9);
                //Set Icon
                setIcons(icon, document.querySelector('.icon'));
                // Toggle between Celcius and fahrenheit
                temperatureChange.addEventListener('click', () => {
                    if (temperatureSpan.textContent === "°C"){
                        temperatureSpan.textContent = "°F";
                        temperatureDegree.textContent = temperature;

                    }else{
                        temperatureSpan.textContent = "°C";
                        temperatureDegree.textContent = Math.floor(celsius);
                    }
                });
            });
        });

    }else{
        h1.textContent = 'Please allow us to get your current location.';
    };
    function setIcons (icon, iconID){
        const skycons = new Skycons({color: 'white'});
        // Look for every - and replace it with _ from the api
        const currentIcon = icon.replace(/-/g,"_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }
});
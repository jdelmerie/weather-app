window.addEventListener("DOMContentLoaded", function () {
    let whichTown = document.getElementById("whichTown"); // selection de ville
    let loadTown = document.getElementById("loadTown"); // boutton pour charger les villes

    loadTown.addEventListener("click", getTowns); // event pour récup les villes
    // whichTown.addEventListener("change", infoWeather); // event pour charger les données de chaque ville choisie

    // function qui permet de gérer tous les fetch
    async function getJson(url) {
        let response = await fetch(url);
        let json = await response.json();
        return json;
    }

    // function pour récup les données des villes et créer les options pour afficher chaque ville sélectionnée
    async function getTowns() {
        let towns = await getJson("http://meteo.webboy.fr/");
   
        towns.forEach(town => {
            let option = document.createElement("option");
            option.setAttribute("value", town.id);
            let townName = document.createTextNode(town.name);
            option.appendChild(townName);
            whichTown.appendChild(option);
        });

        whichTown.addEventListener("change", function(){
            infoWeather()
        });

        infoWeather(towns[0].id);
        loadTown.style.color = "grey";
        loadTown.disabled = true;
    }

   

    // function pour récup les données de la météo des villes
    async function infoWeather() {
        let weather = document.getElementById("weather"); // bloc pour afficher la méteo 
        weather.classList.replace("hide", "show"); // afficher le bloc de la méteo 

        let myAPI = "af16bc6d476e94f7cb140ea2bf8abe12"; // ma clé API 

        let townId = document.getElementById("whichTown").value; // récup l'id de chaque ville
        let townInfo = await getJson(`https://api.openweathermap.org/data/2.5/weather?id=${townId}&units=metric&appid=${myAPI}&lang=fr`);
        showWeather(townInfo);

        console.log(townInfo)
    }

    // function pour afficher les données de la météo des villes
    function showWeather(townInfo) {
        // affiche le nom de la ville choisie
        let townName = document.getElementById("townLoaded");
        townName.innerHTML = townInfo.name;

        // récup l'icon de la météo puis je crée une balise img pour insérer l'icon
        let icon = document.getElementById("icon");
        icon.innerHTML = "";

        let townInfoWeatherIcon = townInfo.weather[0].icon;
        let weatherIcon = document.createElement("img");
        weatherIcon.src = `http://openweathermap.org/img/wn/${townInfoWeatherIcon}@2x.png`;
        icon.appendChild(weatherIcon);

        // affiche la température en Celsius 
        let temp = document.getElementById("temperature");
        let tempData = Math.floor(townInfo.main.temp);
        temp.innerHTML = `${tempData} °C`;

        // affiche la vitesse du vent 
        let wind = document.getElementById("windForce");
        let windForce = Math.floor(townInfo.wind.speed * 3.6);
        wind.innerHTML = `${windForce} km/h`;

        // affiche la direction du vent 
        let windDirection = document.getElementById("windDirection");
        windDirection.style.transform = `rotate(${townInfo.wind.deg}deg)`;

        // défini le point de lat et lon 
        let getLat = townInfo.coord.lat > 0 && townInfo.coord.lat < 90 ? "N" : "S";
        let getLon = townInfo.coord.lon > 0 && townInfo.coord.lon < 180 ? "E" : "O";

        //affiche les coord gps
        let coordLat = document.getElementById("coordLat");
        coordLat.innerHTML = `${townInfo.coord.lat} ${getLat} ,`;
        let coordLon = document.getElementById("coordLon");
        coordLon.innerHTML = `${townInfo.coord.lon} ${getLon}`;

        //affiche la date du dernier relevé
        let lastUpdate = new Date(townInfo.dt * 1000);
        const optionDate = { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: '2-digit', minute:'2-digit' };
        let lastReport = document.getElementById("lastReport")
        lastReport.innerHTML = lastUpdate.toLocaleTimeString("fr-FR", optionDate);
    }
});


(function () {

    const API_KEY = 'eb256dd9b4e8d41d15f72d1b39675dce';
    const BASE_URL = 'https://api.openweathermap.org/data/2.5';
    const $searchForm = $('#search-form');
    const $searchInput = $('#search-input');
    const $today = $('#today');
    const $forecastContainer = $('#forecast-container');
    const $history = $('#history');

    $searchForm.on('submit', handleSearch);

    function handleSearch(e) {
        e.preventDefault();

        let city = $searchInput.val();

        getWeather(city).then(displayWeather);
        getForecast(city).then(displayForecast);

        storeSearch(city);
        renderHistory(city);

        $today.addClass('with-border');
    }

   function getWeather(city) {
        const url = `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`;

        return fetch(url).then(res => res.json());
        
    }

    function getForecast(city) {
        const url = `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`;

        return fetch(url).then(res => res.json());
    }

    function displayWeather(data) {
        $today.empty();

        const name = data.name;
        const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        const temp = data.main.temp;
        const humidity = data.main.humidity;
        const wind = data.wind.speed;

        const markup = `
        <h2>
          The weather in ${name} now: 
        </h2>
        <img src="${icon}" />
        <p>Temperature: ${temp} &deg;C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${wind}m/s</p>
      `;

        $today.html(markup);
    }

    function displayForecast(data) {
        $forecastContainer.empty();

        const days = data.list.filter(reading => reading.dt_txt.includes('12:00:00'));

        const forecastTitle = "<h2>Weather forecast for the next 5 days:</h2>";
        $forecastContainer.append(forecastTitle);

        days.forEach(day => {
            const date = dayjs(day.dt_txt).format('DD/MM/YYYY');
            const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
            const temp = day.main.temp;
            const humidity = day.main.humidity;
                

            const markup = `
        
          <div class="forecast-day">
            <h3>${date}</h3>
            <img src="${icon}" />
            <p>Temp: ${temp} &deg;C</p>
            <p>Humidity: ${humidity}%</p>
            
          </div>
        `;


            $forecastContainer.append(markup);
        });
    }

    function storeSearch(city) {
        let searches = JSON.parse(localStorage.getItem('searches')) || [];
        searches.push(city);
        localStorage.setItem('searches', JSON.stringify(searches));
    }

    function renderHistory(city) {

        const btn = $('<button></button>').text(city);

        btn.on('click', function () {

            $('#today').empty();
            $('#forecast-container').empty();

            getWeather(city).then(function (weather) {
                displayWeather(weather);
            });
            getForecast(city).then(function (forecast) {
                displayForecast(forecast);
            });

        });

        $('#history').append(btn);

    }

   function init() {
        let searches = JSON.parse(localStorage.getItem('searches')) || [];

        if (searches.length > 0) {
            handleSearch({ target: { value: searches[0] } });
        }

        searches.forEach(city => {
            renderHistory(city);
        });
    }

    init();

})();
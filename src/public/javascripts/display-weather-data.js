async function displayWeatherData() {
	let weatherData = JSON.parse(localStorage.getItem('weather-data'));

	if (!weatherData || weatherData.timestampCreated < (new Date().getTime() - 3600000)) {
		weatherData = await getPrettyWeatherForecastObject();
		localStorage.setItem('weather-data', JSON.stringify(weatherData));
	}

	const tableBody = document.querySelector('#weather-table tbody');

	for (const timestamp in weatherData) {
		if (timestamp === 'timestampCreated') continue;

		if (weatherData.hasOwnProperty(timestamp)) {
			const rowData = weatherData[timestamp];
			const row = document.createElement('tr');
			row.innerHTML = `
      <td>${timestamp}</td>
      <td>${rowData.temperature}</td>
      <td>${rowData.rain}</td>
      <td>${rowData.showers}</td>
      <td>${rowData.snowfall}</td>
      <td>${rowData.surface_pressure}</td>
      `;
			tableBody.appendChild(row);
		}
	}
}

async function getPrettyWeatherForecastObject() {
	const weather = await getWeatherForecastFromAPI();

	if (!weather) return null;

	const output = {};

	for (let i = 0; i < weather.hourly.time.length; i++) {
		const time = weather.hourly.time[i];
		output[new Date(time).toLocaleDateString('cs-CZ') + ' ' + new Date(time).toLocaleTimeString('cs-CZ')] = {
			temperature: weather.hourly.temperature_2m[i],
			rain: weather.hourly.rain[i],
			showers: weather.hourly.showers[i],
			snowfall: weather.hourly.snowfall[i],
			surface_pressure: weather.hourly.surface_pressure[i],
		};
	}

	output['timestampCreated'] = new Date().getTime();

	return output;
}

async function getWeatherForecastFromAPI() {
	console.log('Obtaining data from API...');

	return await fetch('https://api.open-meteo.com/v1/forecast?latitude=50.73672181237923&longitude=15.740117513911002&hourly=temperature_2m,rain,showers,snowfall,surface_pressure&forecast_days=1')
		.then(res => res.json())
		.catch(error => {
			return null;
		});
}

displayWeatherData();
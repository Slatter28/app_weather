import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Loading from './Loading';
import Rain from './Rain';
import dayImage from '../assets/day_image.svg'
import nightImage from '../assets/night_image.svg'
import Sun from './Sun';

const CardWeather = ({ lat, lon }) => {

    const [weather, setWeather] = useState()
    const [temperature, setTemperature] = useState()
    const [isTime, setTime] = useState(false)
    const [isCelsius, setIsCelsius] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [isSun, setIsSun] = useState(false)



    useEffect(() => {
        if (lon) {
            const ApiKey = '3a1bbefc324b0aa6dc9ad64e9dd5a8c1';
            const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${ApiKey}`;

            axios.get(URL)
                .then(resp => {
                    setWeather(resp.data)
                    const temp = {
                        celsius: `${Math.round(resp.data.main.temp - 273.15)} ºC`,
                        fahrenheit: `${Math.round(resp.data.main.temp - 273.15) * 9 / 5 + 32} ºF`
                    }
                    const currentTime = new Date()
                    const time = new Date((currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000)) + (1000 * resp.data.timezone))
                    if(time.getTime()>18){
                        setTime(true)
                    }
                    if ((Math.round(resp.data.main.temp - 273.15)) > 25) {
                        setIsSun(true)
                    }
                    setTemperature(temp)
                    setIsLoading(false)
                })
                .catch(err => console.log(err))
        }

    }, [lat, lon])

    const handleCLick = () => setIsCelsius(!isCelsius)

    console.log(weather);

    if (isLoading) {
        return (
            <Loading />
        )
    } else {
        return (
            <div>

                {isSun ? <Sun /> : <Rain />}

                <div className='Card'>
                    <div className='Card__header'>
                        <div className='Card__title'>
                            <h1>Weather App</h1>
                            <h2>{`${weather?.name}, ${weather?.sys.country}`}</h2>
                        </div>
                        <img src={isTime ? dayImage : nightImage} alt="xx" />
                    </div>

                    <div className='Card__body'>
                        <h2>{isCelsius ? temperature?.celsius : temperature?.fahrenheit}</h2>
                        <img src={weather && `http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt="cloud" />


                    </div>
                    <div className='Card__footer'>
                        <h3>&#34;{weather?.weather[0].description}&#34; </h3>
                        <ul>
                            <li><span> 🌫 Wind Speed </span>{weather?.wind.speed}</li>
                            <li><span> ☁ Clouds </span>{weather?.clouds.all}</li>
                            <li><span> 🌡 Pressure </span>{weather?.main.pressure}</li>
                        </ul>
                    </div>
                    <div>

                    </div>
                    <div className='Card__btn'>
                        <button onClick={handleCLick}> {isCelsius ? 'Change to F' : 'Change to C'}</button>
                    </div>
                </div>

            </div>
        )
    }

}

export default CardWeather

function getCityInput() {
    return document.getElementById("cityInput").value;
}

// ToDo -> have an icon and a description for day and night???
// ToDo -> display a vertical image in mobile and horizontal on computers

async function getImage() {
    const CLIENT_ID = '8b3303518e733b03bb9fbe890041915da381de31ef0602ad71dc8adfd4b79f83'
    let response = await fetch(`https://api.unsplash.com/search/photos?query=${getCityInput()}&client_id=${CLIENT_ID}`)
        .catch(error => {
            console.error('There was an error', error);
        });
    let data = await response.json().catch(error => {
        console.error('There was an error', error);
    });
    if (data.results.length) {
        let image = data.results[0].urls.regular;
        for (let i = 0; i < data.results.length; i++) {
            if (data.results[i].width > data.results[i].height) {
                const largeImg = document.getElementById('largeImg');
                largeImg.setAttribute('src', image);
                break;
            }
            else if (data.results[i].width < data.results[i].height) {

            }
        }
        //document.body.style.backgroundImage = `url(${image})`;
    }

}

async function fetchWeatherData() {
    const APPID = "7fb5612e9f6ac65b21e4280dacefbb25";
    let countryInput = document.getElementById("countryInput").value;
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${getCityInput()},${countryInput}&units=metric&APPID=` + APPID, {
            method: 'GET',
            credentials: 'same-origin'
        });
        return await response.json();
    } catch (error) {
        console.error("There was an error:", error);
    }
}

function updateCity() {
    let cityOutput = document.getElementById("cityOutput");
    if (!!getCityInput()) {
        cityOutput.innerText = getCityInput();
    }
}

async function updateCountry() {
    const weather = await fetchWeatherData();
    let countryOutput = document.getElementById("countryOutput");
    if (!!getCityInput()) {
        countryOutput.innerText = `, ${weather.city.country}`;
        document.getElementById("countryInput").setAttribute("value", weather.city.country);
    }
}

async function receiveWeatherData() {
    let allDaysArray = [];
    const API_DATAPOINTS = 40;
    const HOURS_IN_DAY = 24;
    const HOUR_INTERVAL = 3;
    const DATAPOINTS_PER_DAY = HOURS_IN_DAY / HOUR_INTERVAL
    const weather = await fetchWeatherData();
    console.log('weather', weather);
    if (weather.cod !== '200') {
        alert("There was an error fetching your data. " +
            "\r\n Please check these possible problems and try again:" +
            "\r\n - City name and spelling" +
            "\r\n - There is no city of that name in the country indicated" +
            "\r\n - Please only enter 2 letter country ID rather than full country name");
    }


//Splitting array of 40 data points into days from midnight
    function dataSlicedIntoDays() {
        //isolating just hours in order to find midnight and split days from here
        const beginningOfHourString = 11;
        const endOfHourString = 19;
        let numberToLoop;
        let hoursStringArray = [];
        for (let i = 0; i < weather.list.length; i++) {
            hoursStringArray.push(weather.list[i].dt_txt.slice(beginningOfHourString, endOfHourString));
        }
        let midnight = hoursStringArray.indexOf("00:00:00");
        if (midnight === 0 && API_DATAPOINTS === 40) {
            numberToLoop = 6
        } else {
            numberToLoop = 7
        }
        let firstPoint = 0;
        let lastPoint = midnight;
        for (let i = 1; i < numberToLoop; i++) {
            allDaysArray.push(weather.list.slice(firstPoint, lastPoint));
            firstPoint = lastPoint;
            lastPoint = DATAPOINTS_PER_DAY * i + allDaysArray[0].length;
        }
        return allDaysArray;
    }

    console.log("allDaysArray", allDaysArray)
//Processing data and getting what I need from the response
    //Formatting the date to display as a heading per card
    function getDisplayDate(day) {
        let options = {weekday: 'long', month: 'short', day: 'numeric'};
        let date = new Date(day[0].dt_txt);
        return date.toLocaleDateString("en-UK", options);
    }

    function currentInfo() {
        let tempDiff = feelTempAverage(dataSlicedIntoDays()[0]) - temperatureAverage(dataSlicedIntoDays()[0]);
        let diff;
        let description = weather.list[0].weather[0].description;
        if (tempDiff > 0) {
            diff = Math.abs(tempDiff) + " degree(s) warmer than"
        }
        if (tempDiff === 0) {
            diff = " the same as"
        }
        if (tempDiff < 0) {
            diff = Math.abs(tempDiff) + " degree(s) colder than"
        }
        return {
            "icon": weather.list[0].weather[0].icon,
            "description": description[0].toUpperCase() + description.substr(1),
            "temp": Math.round(weather.list[0].main.temp),
            "feels_like": Math.round(weather.list[0].main.feels_like),
            "difference": diff
        }
    }

    //Getting the average 'feels like' temperature per day
    function feelTempAverage(day) {
        return Math.round(day.reduce((a, b) => {
            return a + b.main.feels_like
        }, 0) / day.length);
    }

    //Getting the average temperature per day
    function temperatureAverage(day) {
        return Math.round(day.reduce((a, b) => {
            return a + b.main.temp
        }, 0) / day.length);
    }

    //Getting the average humidity per day
    function humidityAverage(day) {
        return "Humidity: " + Math.round(day.reduce((a, b) => {
            return a + b.main.humidity
        }, 0) / day.length) + "%";
    }

    //Getting the maximum temperature per day
    function maxTemp(day) {
        return "Maximum: " + Math.round(
            day.reduce((
                a, b) => {
                    return Math.max(a, b.main.temp_max)
                }, 0
            ));
    }

//Getting the minimum temperature per day
    function minTemp(day) {
        return "Minimum: " + Math.round(
            day.reduce((
                a, b) => {
                    return Math.min(a, b.main.temp_min)
                }, 1000
            ));
    }

    function getMostOccurring(ArrayToUse) {
        const count = array =>
            array.reduce((a, b) => ({
                ...a,
                [b]: (a[b] || 0) + 1
            }), {}) // don't forget to initialize the accumulator

        const sortable = [];
        for (let detail in count(ArrayToUse)) {
            sortable.push([detail, count(ArrayToUse)[detail]]);
        }

        sortable.sort(function (a, b) {
            return b[1] - a[1];
        });
        return sortable[0][0];
    }

//Getting the most reoccurring description per day
    function description(day) {
        let descriptionArray = [];
        for (let i = 0; i < day.length; i++) {
            let descripString = day[i].weather[0].description
            descriptionArray.push(descripString[0].toUpperCase() + descripString.substr(1));
        }
        return getMostOccurring(descriptionArray);
    }

//Getting the most reoccurring icon per day
    function icon(day) {
        let iconArray = [];
        let iconNumbers = [];
        let AMicons = [];
        let PMicons = [];
        for (let i = 0; i < day.length; i++) {
            iconArray.push(day[i].weather[0].icon.slice(2, 3));
            iconNumbers.push(day[i].weather[0].icon.slice(0, 2));
            if (iconArray[i] === 'd') {
                AMicons.push(day[i].weather[0].icon);
            }
            if (iconArray[i] === 'n') {
                PMicons.push(day[i].weather[0].icon);
            }
        }
        //ToDo dont forget to slice off the d/n and then only display the day or night one at correct times
        return getMostOccurring(iconNumbers);
    }

//Putting it all together in the front end
    function makeNowCard() {
        let nowCard = document.getElementById("nowCard");
        let url = `http://openweathermap.org/img/wn/${currentInfo().icon}@2x.png`
        let template = document.querySelector('#now');
        let clone = template.content.cloneNode(true);
        let img = clone.querySelector('#nowIcon');
        let p = clone.querySelectorAll("p");
        let span = clone.querySelector("span")

        img.setAttribute('src', url);
        img.setAttribute('alt', currentInfo().description);
        p[0].textContent = currentInfo().description;
        p[1].textContent = "Temperature: " + currentInfo().temp;
        p[2].textContent = "Feels like: " + currentInfo().feels_like;
        span.textContent = currentInfo().difference;

        return nowCard.appendChild(clone);
    }

    let nowContainer = document.getElementById("nowContainer");
    nowContainer.appendChild(makeNowCard());

    function makeCards(day, icon, alt, heading, descrip, min, max, humidity) {
        let url = `http://openweathermap.org/img/wn/${icon}d@2x.png`
        let cardWhole = document.getElementById("cards");
        let template = document.querySelector('#template');

        let clone = template.content.cloneNode(true);
        let h4 = clone.querySelector('h4');
        let img = clone.querySelector('img');
        let p = clone.querySelectorAll("p");

        img.setAttribute('src', url);
        img.setAttribute('alt', alt);
        h4.textContent = heading;
        p[0].textContent = descrip.toString();
        p[1].textContent = min.toString();
        p[2].textContent = max.toString();
        p[3].textContent = humidity.toString();

        return cardWhole.appendChild(clone);
    }

    function fillCards() {
        let container = document.getElementById("container");
        let cardWhole = document.getElementById("cards");
        if (!cardWhole.innerText.includes("card")) {
            for (let i = 0; i < 6; i++) {
                container.appendChild(makeCards(allDaysArray[i],
                    icon(allDaysArray[i]),
                    "weather icon",
                    getDisplayDate(allDaysArray[i]),
                    description(allDaysArray[i]),
                    minTemp(allDaysArray[i]),
                    maxTemp(allDaysArray[i]),
                    humidityAverage(allDaysArray[i])
                ));
            }
        }
    }

    return fillCards();
}

function clearCards(cardToClear) {
    while (cardToClear.firstChild) {
        cardToClear.removeChild(cardToClear.firstChild);
    }
}

// Fibonacci easter egg
function fibonacci(fibInput) {
    let a = 0;
    let b = 1;
    let c;
    let fib = [a, b];

    for (let i = 0; i < 201; i++) {
        c = a + b;
        a = b;
        b = c;
        fib.push(c);
    }

    function fibValue() {
        let value = fib[fibInput]
        let lastNumber = fibInput.toString().split('').pop()
        let nth;
        if (lastNumber == 3 && fibInput !== `13`) {
            nth = 'rd';
        } else if (lastNumber == 2 && fibInput !== `12`) {
            nth = 'nd';
        } else if (lastNumber == 1 && fibInput !== `11`) {
            nth = 'st';
        } else {
            nth = 'th';
        }
        if (fibInput <= 200) {
            return alert(`You found an easter egg!
        \r\nThe value of the ${fibInput}${nth} number in the Fibonacci Sequence is ${value}`);
        }
        if (fibInput > 200) {
            return alert(`You found an easter egg!
        \r\n Please enter a number smaller than 200`);
        }
    }

    return fibValue();
}

function weatherOrFib() {
    if (getCityInput() >= 0) {
        fibonacci(getCityInput())
    } else {
        clearCards(document.getElementById("cards"));
        clearCards(document.getElementById("nowCard"));
        receiveWeatherData().then();
        updateCity();
        updateCountry().then();
        getImage().then()
    }
}


function revealCountryInput(){
    const changeCountry = document.getElementById("setDifferentCountry");
    if (changeCountry.style.display === "none") {
        changeCountry.style.display = "inline";
    }
}

function clearCards(cardToClear) {
    while (cardToClear.firstChild) {
        cardToClear.removeChild(cardToClear.firstChild);
    }
}

//set up for visual interest before search fills page with content
function randomIcons(elementID) {
    const iconArray = [ "01d", "02d", "03d", "04d", "09d", "10d", "11d", "13d", "50d"]
    let newImgs = iconArray.map((icon) => {
        let img = document.createElement("img");
        let url = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        img.setAttribute("src", url);
        img.setAttribute("class", "startIcons");
        img.setAttribute("alt", "weather_icon");
        img.setAttribute("width", "100px");
        img.setAttribute("height", "100px");
        return img;
    });
    let container = document.getElementById(elementID)
    return newImgs.map((newImg) => container.appendChild(newImg))
}
function randomBackgroundImagesBeforeSearch (){
    let keywordsArray = ["summer beach", "autumn", "winter", "spring", "warm", "autumn leaves", "snow man", "spring blooms"]
    let randomNumber = Math.floor(Math.random() * keywordsArray.length);
    return getImage(keywordsArray[randomNumber]);
}
window.onload = function() {
    randomIcons("slider")
    randomIcons("slider2")
    randomBackgroundImagesBeforeSearch().then()
};

//get all information into page
function onEnter(e) {
    // look for window.event in case event isn't passed in
    e = e || window.event;
    if (e.keyCode === 13)
    {
        document.getElementById('tellMe').click();
        return false;
    }
    return true;
}

function weatherOrFib() {
    if (getCityInput() >= 0) {
        fibonacci(getCityInput())
    } else {
        const scrollingIcons = document.getElementById("beforeSearch");
        if (scrollingIcons.style.display === "flex") {
            scrollingIcons.style.display = "none";
        }
        clearCards(document.getElementById("cards"));
        clearCards(document.getElementById("nowCard"));
        receiveWeatherData().then();
        updateCity();
        updateCountry().then();
        getImage(getCityInput()).then()
    }
}
var stationRepository = (function () {
    var stationList = [];
    var jsonUrl = 'https://delacorteclock.github.io/LA-Metro-Stations/stationdatabase.json';

    //Get all station objects in an array
    function getAll() {
        return stationList;
    }

    //Push station object into array
    function add(station) {
        stationList.push(station);
    }

    //Add button to info box
    function addListItem(station) {
        var infoList = document.querySelector('.information-box__list');
        var buttonContainer = document.createElement('li');
        var button = document.createElement('button');
        button.innerText = station.name;
        button.classList.add('information-box__button');
        buttonContainer.appendChild(button);
        infoList.appendChild(buttonContainer);
        detailLog(button, station);
    }

    //Add event listener to a button with handler function which puts corresponding station's name into showDetails()
    function detailLog(button, station) {
        button.addEventListener('click', function () {
            showDetails(station);
        });
    }

    //Use console.log() for inputted station
    function showDetails(station) {
        loadDetails(station).then(function () {
            console.log(station);
        });
    }

    //Show loading warning message
    function showLoadingMessage() {
        warning = document.querySelector('#loading-box');
        warning.classList.add('showing');
    }

    //Hide loading warning message
    function hideLoadingMessage() {
        warning = document.querySelector('#loading-box');
        warning.classList.remove('showing');
    }

    //Load list of stations in the railway
    function loadList() {
        showLoadingMessage();
        return fetch(jsonUrl).then(function (result) {
            return result.json();
        }).then(function (json) {
            //Array of info for railway stops
            json.forEach(function (stop) {
                //Each json object literal needs name, id and url generated from line name
                var currentStop = {
                    name: stop.name,
                    id: stop.id,
                    lineUrl: 'https://delacorteclock.github.io/LA-Metro-Stations/lines/' + stop.line.toLowerCase() + '.json'
                };
                add(currentStop);
                console.log(currentStop);
                //Delay loading message to eliminate aesthetically unpleasant 'flashing' 
                setTimeout(hideLoadingMessage, 1500);
            });
        }).catch(function (e) {
            console.error(e);
            setTimeout(hideLoadingMessage, 1500);
        });
    }

    function loadDetails(station) {
        showLoadingMessage();
        var url = station.lineUrl;
        //Use line details exclusively for V0.5
        return fetch(url).then(function (result) {
            return result.json();
        }).then(function (info) {
            //Correction for json format
            info = info[0];
            station.line = info.line;
            station.letter = info.letter;
            station.hex = info.hex;
            station.terminal1 = info.terminal1;
            station.terminal2 = info.terminal2;
            station.weight = info.weight;
            station.logoUrl = info.logoUrl;
            station.infoUrl = info.infoUrl;
            setTimeout(hideLoadingMessage, 1500);
        }).catch(function (e) {
            console.error(e);
            setTimeout(hideLoadingMessage, 1500);
        });
    }

    return {getAll: getAll, add: add, addListItem: addListItem, loadList: loadList, loadDetails: loadDetails};
})();

//Use getAll to get station information
var trainStops = stationRepository.getAll();
trainStops.forEach(informationLoop);

/***For each object in stationList inform readers about the stopName and railLine and then give the track count. 
 * Also use number of tracks to determine whether the word 'track' should be singular or plural.
 * Call stations with one track miniature***/
function informationLoop(station) {
    stationRepository.addListItem(station);
}

stationRepository.loadList().then(function () {
    stationRepository.getAll().forEach(function (station) {
        stationRepository.addListItem(station);
    });
});
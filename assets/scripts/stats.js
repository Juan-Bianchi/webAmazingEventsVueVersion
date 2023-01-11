const highLowConatiner = document.getElementById('highest-lowest');
const pastContainer = document.getElementById('past-stats');
const upcomingContainer = document.getElementById('upcoming-stats');


fetch('https://mindhub-xj03.onrender.com/api/amazing')
    .then(response => response.json())
    .then(dataAPI => { 
        manageDataApi(dataAPI);
    })
    .catch(err => console.error(err.message));



// CUADRO SUPERIOR

function obtainHighestPercAttendance( events ) {
    let percentages = events.map (event => (event.assistance? event.assistance: event.estimate) / event.capacity * 100);
    let highestPerInd = percentages.indexOf(Math.max(...percentages));
    let highest = events[highestPerInd];

    return highest;
}


function obtainLowestPercAttendance( events ) {
    
    let percentages = events.map (event => (event.assistance? event.assistance: event.estimate) / event.capacity * 100);
    let lowestPerInd = percentages.indexOf(Math.min(...percentages));
    let lowest = events[lowestPerInd];
    
    return lowest;
}


function obtainLargerCapacity( events ) {
    let capacities = events.map (event => event.capacity);
    let largerCapInd = capacities.indexOf(Math.max(...capacities));
    let largerCap = events[largerCapInd];
    
    return largerCap;
}


function renderHighestLowest ( container, events, obtainHighestPercAttendanc, obtainLowestPercAttendance, obtainLargerCapacity ) {
    let highest = obtainHighestPercAttendanc(events);
    let lowest = obtainLowestPercAttendance(events);
    let largerCap = obtainLargerCapacity(events);
    container.innerHTML += `<td>${highest.name}: ${( (highest.assistance? highest.assistance: highest.estimate) / highest.capacity * 100 ).toFixed(2)}%</td>
                            <td>${lowest.name}: ${( (lowest.assistance? lowest.assistance: lowest.estimate) / lowest.capacity * 100 ).toFixed(2)}%</td>
                            <td>${largerCap.name}: ${largerCap.capacity} p.</td>`;
}



//CUADROS PAST Y UPCOMING

function obtainStatistics( events ) {
    let categories = events.map(event => event.category).filter( (category, index, array) => array.indexOf(category) === index);
    let categObjects = categories.map( categ => {
        return {
            category : `${categ}`,
            revenue : 0,
            attend : 0,
            capacity: 0
        };
    })

    for(let event of events) {
        for(let categ of categObjects) {
            if(categ.category === event.category) {
                categ.revenue += Math.round((event.assistance ? event.assistance: event.estimate) * event.price);
                categ.attend += (event.assistance ? event.assistance: event.estimate);
                categ.capacity += event.capacity;
            }
        }
    }
    
    categObjects = categObjects.map(cat => {
        return {
            name : `${cat.category}`,
            revenue : cat.revenue,
            percAttend : (cat.attend / cat.capacity * 100).toFixed(2)
        };
    });

    return categObjects;
}


function renderStatisticsByCateg (statistics, container) {
    statistics.forEach( category => {
        container.innerHTML += `<tr class="table-info">
                                    <td>${category.name}</td>
                                    <td>$ ${category.revenue}</td>
                                    <td>${category.percAttend} %</td>
                                </tr>`
    })
}


// MANEJO DE DATA API

function filterPastEvents (compData) {

    return compData.events.filter(event => compData.currentDate > event.date);
}

function filterUpcomingEvents (compData) {

    return compData.events.filter(event => compData.currentDate <= event.date);
}


function manageDataApi (dataApi) {

    //creo tablaSuperior
    renderHighestLowest(highLowConatiner, dataApi.events, obtainHighestPercAttendance, obtainLowestPercAttendance, obtainLargerCapacity);

    //filtro eventos por fecha
    const past = filterPastEvents(dataApi);
    const upcoming = filterUpcomingEvents(dataApi);

    //creo tabla con past events
    const pastStats = obtainStatistics (past);
    renderStatisticsByCateg(pastStats, pastContainer);

    //creo tabla con upcoming events
    const upcomingStats = obtainStatistics (upcoming);
    renderStatisticsByCateg(upcomingStats, upcomingContainer);

}
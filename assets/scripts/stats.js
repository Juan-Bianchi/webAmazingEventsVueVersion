const { createApp } = Vue;

createApp( {
    data(){
        return{
            data : {},
            events : [],
            pastEvents : [],
            upcomingEvents : [],
            highestPerc : undefined,
            lowestPerc : undefined,
            highestCapac : undefined,
            statsByCategoryPast : [],
            statsByCategoryUp : []
        }
    },

    created() {
        fetch('https://mindhub-xj03.onrender.com/api/amazing')
            .then(resolve => resolve.json())
            .then(dataAPI => {
                this.data = Object.assign({}, dataAPI);
                this.events = [... this.data.events];
                this.manageDataApi();
            })
            .catch(err => console.error(err.message));
    },

    methods: {
        filterPastEvents () {
            this.pastEvents = this.data.events.filter(event => this.data.currentDate > event.date);
        },
        
        filterUpcomingEvents () {
            this.upcomingEvents = this.data.events.filter(event => this.data.currentDate <= event.date);
        },

        obtainHighestPercAttendance() {
            let percentages = this.pastEvents.map(event => event.assistance / event.capacity * 100);
            let maxInd = percentages.indexOf(Math.max(... percentages));
            this.highestPerc = this.pastEvents[maxInd];
        },

        obtainLowestPercAttendance() {
            let percentages = this.pastEvents.map(event => event.assistance / event.capacity * 100);
            let minInd = percentages.indexOf(Math.min(... percentages));
            this.lowestPerc = this.pastEvents[minInd];
        },

        obtainLargerCapacity() {
            let capacities = this.events.map(event => event.capacity);
            let maxCap = capacities.indexOf(Math.max(... capacities));
            this.highestCapac = this.events[maxCap];
        },

        obtainStatistics() {
            let listCategPas = [... new Set(this.pastEvents.map( event => event.category))];
            let listCategUp = [... new Set(this.upcomingEvents.map( event => event.category))];

            this.statsByCategoryPast = listCategPas.map(categ => { return {category: `${categ}`, percentage: 0, revenue: 0, cant: 0};});
            this.statsByCategoryUp = listCategUp.map(categ => { return {category: `${categ}`, percentage: 0, revenue: 0, cant: 0};});

            for(let event of this.pastEvents){
                for(let category of this.statsByCategoryPast) {
                    if(category.category === event.category) {
                        category.percentage += event.assistance / event.capacity * 100;
                        category.revenue += event.assistance * event.price;
                        category.cant ++;
                    }
                }
            }

            for(let event of this.upcomingEvents){
                for(let category of this.statsByCategoryUp) {
                    if(category.category === event.category) {
                        category.percentage += event.estimate / event.capacity * 100;
                        category.revenue += event.estimate * event.price;
                        category.cant ++;
                    }
                }
            }

            this.statsByCategoryPast.forEach(category => { category.percentage = (category.percentage / category.cant).toFixed(2);});
            this.statsByCategoryUp.forEach(category => { category.percentage = (category.percentage / category.cant).toFixed(2);});
        },

        manageDataApi() {

            this.filterPastEvents ();    
            this.filterUpcomingEvents ();
    
            this.obtainHighestPercAttendance();
            this.obtainLowestPercAttendance();
            this.obtainLargerCapacity();
    
            this.obtainStatistics();
        }
    }
}).mount('#app');
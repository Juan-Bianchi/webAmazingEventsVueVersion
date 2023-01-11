const {createApp} = Vue;

createApp ( {

    data () {
        return {
            events: [],
            filteredEvents: [],
            categories: [],
            searchValue: "",
            checks: []
        }
    },

    created() {

        fetch('https://mindhub-xj03.onrender.com/api/amazing')
            .then(resolve => resolve.json())
            .then(dataAPI => {
                let title = document.querySelector('title');
                
                if(title.innerText == 'Amazing Events | Home') {
                    this.events = dataAPI.events;
                }
                else if (title.innerText == 'Amazing Events | Past Events'){
                    this.events = dataAPI.events.filter(event => event.date < dataAPI.currentDate);
                }
                else {
                    this.events = dataAPI.events.filter(event => event.date >= dataAPI.currentDate);
                }

                this.filteredEvents = [... this.events];
                
                this.categories = this.events.map(event => event.category);
                this.categories = [... new Set(this.categories)];

            })
            .catch(err => console.error(err.message));

    },

    methods: {
        doubleFilter : function(){
            let eventsFilteredBySearch = this.events.filter(event => event.name.toLowerCase().includes(this.searchValue.toLowerCase()));
            if(!this.checks.length) {
                this.filteredEvents = eventsFilteredBySearch;
            }
            else {
                this.filteredEvents = eventsFilteredBySearch.filter(event => this.checks.includes( event.category));
            }
        }
    }

}).mount('#app')


const {createApp} = Vue;

createApp ( {
    data (){
        return {
            events: [],
            event: undefined,

        }
    },

    created(){
        let urlString = location.search;
        let parameters = new URLSearchParams(urlString);
        let id = parameters.get('id');

        fetch('https://mindhub-xj03.onrender.com/api/amazing')
            .then(resolve => resolve.json())
            .then(dataAPI => {
                this.events = dataAPI.events;
                this.event = this.events.find( event => event._id === id);
            })
            .catch(err => console.error(err.message));
    }

}).mount('#app')


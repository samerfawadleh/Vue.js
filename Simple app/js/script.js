
var eventBus = new Vue();

const NotFound = { template: '<p>Page not found</p>' }

const Destinations = {
	data() {
	  return {
		wishlistDestinations: this.$root.$data.wishlistDestinations,
	  }
	},
	template: `<destination-page :wishlistDestinations="wishlistDestinations"></destination-page>`
}
const Wishlist = { 
	data() {
	  return {
	  	wishlistDestinations: this.$root.$data.wishlistDestinations,
	  }
	},
	template: `<wishlist-page :wishlistDestinations="wishlistDestinations"></wishlist-page>`
}

const routes = {
  '/destinations': Destinations,
  '/wishlist': Wishlist
}

const wishlistDestinations = {
	destinations: [{
				id: 1,
				name: 'Jad Hotel Suites',
				image: './images/jadHotel.jpg',
				description: 'The 4 stars hotel is set 2 km away from Al Baraka Mall and Jordan Gate Towers, while being 5 km away from Abdoun Mall and Abdoun Bridge, 7 km away from Mecca Mall, and 25 km away from Queen Alia International Airport.',
				inWishlist: false
			},
			{
				id: 2,
				name: 'Royal Mirage',
				image: './images/royal.jpg',
				description: 'This property offers transfers from the airport (surcharges may apply). Guests must contact the property with arrival details before travel, using the contact information on the booking confirmation. ',
				inWishlist: false
			},{
				id: 3,
				name: 'S Hotel Bahrain',
				image: './images/s.jpg',
				description: 'Hotels near Wahoo Waterpark, Bahrain If you’re looking for some fun, S Hotel Bahrain could certainly help you out, as it’s close to the famous Wahoo Waterpark and is also near most tourist attractions in Bahrain. The hotel has this semi S-shaped exterior that makes it a delight to see. Cool breeze also abounds as lots of palm trees surround the hotel.',
				inWishlist: false
			},{
				id: 4,
				name: 'Hilton Garden Inn',
				image: './images/hilton.jpg',
				description: 'With a stay at Hilton Garden Inn Dubai Al Muraqabat, you\'ll be centrally located in Dubai, walking distance from Hamarain Centre and close to Reef Mall. This hotel is within close proximity of Al Ghurair Centre and Deira City Centre.',
				inWishlist: false
			}],
			wishlist: [],
}

Vue.component('nav-bar', {
	template: `
		<div class="nav-bar">
			<span v-for="(page, index) in pages" :key="index" @click="updateSelectedPage(index)">{{ page }}</span>
		</div>
	`,
	data() {
		return {
			pages: ['Destinations', 'Wishlist'],
		}
	},
	methods: {
		updateSelectedPage(index){
			eventBus.$emit('page-changed', index)
		}
	}
})

Vue.component('destination-page', {
	props: {
		wishlistDestinations: {
			type: Object,
			required: true
		}
	},
	template: `
		<div>
			<nav-bar></nav-bar>

			<p>Please select any destination to add it to your whishlist!</p>
				
			<div class="cards-container">
				<div class="card" v-for="(destination, index) in wishlistDestinations.destinations" :key="destination.id" @click="addToWishlist(index)">
					<div class="col cardHeader">
						<h1>{{ destination.name }}</h1> <span class="tickImage" v-show="destination.inWishlist"><img src="./images/tick.png"/></span>
					</div>

					<div class="col">
						<img :src="destination.image">
					</div>

					<div class="col">
						{{ destination.description }}
					</div>
				</div>
				
			</div>
		</div>
	`,
	methods: {
		addToWishlist(index) {
			if(!this.wishlistDestinations.destinations[index].inWishlist){
				let destinationAdded = {id: this.wishlistDestinations.destinations[index].id, name: this.wishlistDestinations.destinations[index].name,
					description: this.wishlistDestinations.destinations[index].description, checked: false}
				this.wishlistDestinations.wishlist.push(destinationAdded);
				this.wishlistDestinations.destinations[index].inWishlist = true;
			}
		}
	}
})

Vue.component('wishlist-page', {
	props: {
		wishlistDestinations: {
			type: Object,
			required: true
		}
	},
	template: `
		<div>
			<nav-bar></nav-bar>

			<div v-if="wishlistDestinations.wishlist.length" class="wishlistTable">
				<table>
					<tr>
						<th>Name</th>
						<th>Description</th>
						<th>Visited</th>
						<th>Actions</th>				
					</tr>
					<tr v-for="(item, index) in wishlistDestinations.wishlist" :key="item.id">
						<td>{{ item.name }}</td>
						<td>{{ item.description }}</td>
						<td><input id="checkbox" type="checkbox" v-model="item.checked" true-value="true" false-value="false"><label for="checkbox">Visited</label></td>
						<td><button @click="removeFromWishlist(index)">Remove</button></td>
					</tr>
				</table>
			</div>
			<h2 v-else>No records found!</h2>
		</div>
	`,
	methods: {
		removeFromWishlist(index){
			for(var i=0; i<this.wishlistDestinations.destinations.length; i++){
				if(this.wishlistDestinations.wishlist[index].id === this.wishlistDestinations.destinations[i].id){
					this.wishlistDestinations.destinations[i].inWishlist = false;
					break;
				}
			}
			this.wishlistDestinations.wishlist.splice(index, 1);
		}
	}
})

var vm = new Vue({
	el: '#app',
	data: {
		currentRoute: '/destinations',
		wishlistDestinations,
	},
	computed: {
	    ViewComponent () {
	      return routes[this.currentRoute] || NotFound
	    }
	    
	},
	mounted() {
		eventBus.$on('page-changed', index => {
			if(index === 0) {
				this.currentRoute = '/destinations';
			} else {
				this.currentRoute = '/wishlist';
			}
		})
	},
	render (h) {return h(this.ViewComponent) }
})

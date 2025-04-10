const Restaurant = require('../models/restaurant')

const restaurantsController = {}

restaurantsController.showRestaurants = async function(req, res){
    try{
        const restaurants = await Restaurant.find()
        console.log(restaurants)
        res.render('restaurants/restaurants', { restaurants })
    } catch(err){
        res.status(500).json({message: 'Error loading restaurants'})
    }   
}

module.exports = restaurantsController
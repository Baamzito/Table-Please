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

restaurantsController.showRestaurantDetails = async function(req, res) {
    try {
        const restaurantId = req.params.id;
        
        const restaurant = await Restaurant.findById(restaurantId).lean();
        
        if (!restaurant) {
            return res.status(404).render('error', { 
                message: 'Restaurante não encontrado'
            });
        }
        
        return res.render('restaurants/restaurantDetails', { restaurant });
        
    } catch (err) {
        console.error('Erro ao buscar detalhes do restaurante:', err);
        return res.status(500).render('error', { 
            message: 'Não foi possível carregar os detalhes do restaurante',
            error: process.env.NODE_ENV === 'development' ? err : {}
        });
    }
}

restaurantsController.showCreateRestaurant = function(req, res) {
    res.render('index', { title: 'Express' });
}

module.exports = restaurantsController
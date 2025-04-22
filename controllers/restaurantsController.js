const Restaurant = require('../models/restaurant')

const restaurantsController = {}

restaurantsController.showRestaurants = async function(req, res){
    try{
        const restaurants = await Restaurant.find()
        console.log(restaurants)
        res.render('restaurants/restaurants', { title: 'Restaurants', restaurants: restaurants })
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
    res.render('restaurants/create');
}

restaurantsController.createRestaurant = async function(req, res) {
    try {
        const newRestaurant = new Restaurant({
            name: req.body.name,
            address: {
                street: req.body.street,
                city: req.body.city,
                postcode: req.body.postcode
            },
            contact: {
                phone: req.body.phone,
                email: req.body.email,
                website: req.body.website
            },
            ownerId: req.user._id  // Pega o user autenticado
        });

        await newRestaurant.save();
        res.redirect('/restaurants');
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'Erro ao criar restaurante' });
    }
};

restaurantsController.editRestaurant = async function(req, res) {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant || !restaurant.ownerId.equals(req.user._id)) {
        return res.status(403).render('error', { message: 'Não autorizado' });
    }

    restaurant.name = req.body.name;
    restaurant.address = {
        street: req.body.street,
        city: req.body.city,
        postcode: req.body.postcode
    };
    restaurant.contact = {
        phone: req.body.phone,
        email: req.body.email,
        website: req.body.website
    };

    await restaurant.save();
    res.redirect('/restaurants/' + restaurant._id);
};

restaurantsController.deleteRestaurant = async function(req, res) {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant || !restaurant.ownerId.equals(req.user._id)) {
        return res.status(403).render('error', { message: 'Não autorizado' });
    }

    await restaurant.deleteOne();
    res.redirect('/restaurants');
};

module.exports = restaurantsController
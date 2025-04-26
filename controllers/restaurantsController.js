const Restaurant = require('../models/restaurant')
const Menu = require('../models/menu')
const MenuItem = require('../models/menuItem')
const User = require('../models/user');

const restaurantsController = {}

restaurantsController.showRestaurants = async function(req, res){
    try{
        const restaurants = await Restaurant.find()
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
       
        const menus = await Menu.find({ restaurantId: restaurantId, active: true }).lean();

        const menuIds = menus.map(menu => menu._id);
        const menuItems = await MenuItem.find({ menuId: { $in: menuIds } }).lean();
       
        for (const menu of menus) {
            menu.items = menuItems.filter(item => 
                item.menuId.toString() === menu._id.toString()
            );
        }
       
        return res.render('restaurants/restaurantDetails', {
            title: restaurant.name,
            restaurant,
            menus,
            menuItems
        });
       
    } catch (err) {
        console.error('Erro ao buscar detalhes do restaurante:', err);
        return res.status(500).render('error', {
            message: 'Não foi possível carregar os detalhes do restaurante',
            error: process.env.NODE_ENV === 'development' ? err : {}
        });
    }
}

restaurantsController.searchRestaurants = async function(req, res){
    const { name, city } = req.query
    const filter = {};

  if (name) {
    filter.name = { $regex: name, $options: 'i' };
  }

  if (city) {
    filter['address.city'] = { $regex: city, $options: 'i' };
  }

  try {
    const results = await Restaurant.find(filter);
    res.render('restaurants/restaurants',{ title: 'Restaurants', restaurants: results })
  } catch (err) {
    res.status(500).json({ error: 'Internal error' });
  }

}

module.exports = restaurantsController
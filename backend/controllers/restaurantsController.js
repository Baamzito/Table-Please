const Restaurant = require('../models/restaurant')
const Menu = require('../models/menu')
const MenuItem = require('../models/menuItem')
const { default: mongoose } = require('mongoose')

const restaurantsController = {}

restaurantsController.getAllRestaurants = async function(req, res){
    try{
        const restaurants = await Restaurant.find();
        return res.status(200).json({ restaurants });
    } catch(err){
        return res.status(500).json({ error: 'Internal server error' })
    }   
}

restaurantsController.getRestaurantById = async function(req, res) {
    try {
        const restaurantId = req.params.id;
       
        const restaurant = await Restaurant.findById(restaurantId).lean();
       
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found.' });
        }
       
        const restaurantObjectId = new mongoose.Types.ObjectId(restaurantId);
        const menus = await Menu.find({ restaurantId: restaurantObjectId, active: true }).lean();
        const menuIds = menus.map(menu => menu._id);
        const menuItems = await MenuItem.find({ menuId: { $in: menuIds } }).lean();

        for (const menuItem of menuItems) {
             menuItem.image = `${process.env.BASE_URL}${menuItem.image}`;
        }
        
        for (const menu of menus) {
            menu.items = menuItems.filter(item => 
                item.menuId.toString() === menu._id.toString()
            );
        }
       
        return res.status(200).json({ restaurant, menus });
       
    } catch (err) {
        console.error('Internal server error:', err);
        return res.status(500).json({ error: 'Internal server error' });
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
    return res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = restaurantsController
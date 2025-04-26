const Restaurant = require('../models/restaurant');
const Menu = require('../models/menu');
const MenuItem = require('../models/menuItem');
const fs = require('fs');
const path = require('path');

let ownerController = {}

ownerController.showMyRestaurants = async function (req, res) {
    try {
        const restaurants = await Restaurant.find({ owner: req.user.id });
        res.render('owner/my-restaurants', {
            title: 'My Restaurants',
            restaurants: restaurants
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

ownerController.showCreateRestaurant = function (req, res) {
    res.render('owner/create-restaurant', {
        title: 'Create New Restaurant'
    });
};

ownerController.createRestaurant = async function (req, res) {
    try {
        const { name, address_street, address_city, address_postcode, contact_phone, contact_email } = req.body;
        const ownerId = req.user.id;

        const errors = [];

        if (!name || name.trim() === '') errors.push('Name is required.');
        if (!address_street || address_street.trim() === '') errors.push('Street is required.');
        if (!address_city || address_city.trim() === '') errors.push('City is required.');
        if (!address_postcode || address_postcode.trim() === '') errors.push('Postcode is required.');
        if (!contact_phone || contact_phone.trim() === '') errors.push('Phone is required.');

        if (contact_email && !/.+@.+\..+/.test(contact_email)) {
            errors.push('Invalid email format.');
        }

        if (errors.length > 0) {
            return res.render('owner/create-restaurant', {
                title: 'Create New Restaurant',
                body: req.body,
                error: errors.join(' ')
            });
        }

        await Restaurant.create({
            name,
            address: {
                street: address_street,
                city: address_city,
                postcode: address_postcode
            },
            contact: {
                phone: contact_phone,
                email: contact_email
            },
            owner: ownerId
        });

        res.redirect('/owner/my-restaurants');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

ownerController.showEditRestaurant = async function (req, res) {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        res.render('owner/edit-restaurant', {
            title: 'Edit Restaurant',
            restaurant
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

ownerController.updateRestaurant = async function (req, res) {
    try {
        const { name, address_street, address_city, address_postcode, contact_phone, contact_email } = req.body;

        const errors = [];

        if (!name || name.trim() === '') errors.push('Name is required.');
        if (!address_street || address_street.trim() === '') errors.push('Street is required.');
        if (!address_city || address_city.trim() === '') errors.push('City is required.');
        if (!address_postcode || address_postcode.trim() === '') errors.push('Postcode is required.');
        if (!contact_phone || contact_phone.trim() === '') errors.push('Phone is required.');

        if (contact_email && !/.+@.+\..+/.test(contact_email)) {
            errors.push('Invalid email format.');
        }

        if (errors.length > 0) {
            return res.render('owner/edit-restaurant', {
                title: 'Edit Restaurant',
                restaurant: {
                  _id: req.params.id,
                  name,
                  address: {
                    street: address_street,
                    city: address_city,
                    postcode: address_postcode
                  },
                  contact: {
                    phone: contact_phone,
                    email: contact_email
                  }
                },
                error: errors.join(' ')
              });
        }
      
          const updatedData = {
            name,
            address: {
              street: address_street,
              city: address_city,
              postcode: address_postcode
            },
            contact: {
              phone: contact_phone,
              email: contact_email
            }
          };
      
          await Restaurant.findByIdAndUpdate(req.params.id, updatedData, { new: true });
      
          res.redirect('/owner/my-restaurants');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

ownerController.deleteRestaurant = async function (req, res) {
    try {
        const menus = await Menu.find({ restaurantId: req.params.id });
        
        for (const menu of menus) {
            const menuItems = await MenuItem.find({ menuId: menu._id });
            
            for (const item of menuItems) {
                if (item.image) {
                    const imagePath = path.join(__dirname, '../public', item.image);
                    
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                        console.log(`Deleted image: ${imagePath}`);
                    }
                }
            }
            
            await MenuItem.deleteMany({ menuId: menu._id });
        }
        
        await Menu.deleteMany({ restaurantId: req.params.id });
        
        await Restaurant.findByIdAndDelete(req.params.id);
        
        res.redirect('/owner/my-restaurants');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

ownerController.showRestaurantMenus = async function (req, res) {
    try {
        const restaurant = await Restaurant.findById(req.params.restaurantId)

        const menus = await Menu.find({ restaurantId: req.params.restaurantId })

        res.render('owner/restaurant-menus', {
            title: `Menus for ${restaurant.name}`,
            restaurant,
            menus
        })
    } catch (error) {
        console.log(error)
        res.redirect('/owner/my-restaurants')
    }
};

ownerController.showCreateMenu = async function (req, res) {
    try {
        const restaurant = await Restaurant.findById(req.params.restaurantId)

        res.render('owner/create-menu', {
            title: 'Create New Menu',
            restaurant
        })
    } catch (error) {
        console.log(error)
        res.redirect('/owner/my-restaurants')
    }
};

ownerController.createMenu = async function (req, res) {
    try {
        const { name, description, active } = req.body

        const menu = await Menu.create({
            name: name,
            description: description,
            restaurantId: req.params.restaurantId,
            active: active
        });

        console.log(menu)
        res.redirect(`/owner/restaurant/${req.params.restaurantId}/menus`);
    } catch (error) {
        res.render('owner/create-menu', {
            title: 'Create New Menu',
            restaurant: { _id: req.params.restaurantId },
            body: req.body,
            error: error.message
        });
    }
};

ownerController.showEditMenu = async function (req, res) {
    try {
        const menu = await Menu.findById(req.params.menuId);
        const restaurant = await Restaurant.findById(menu.restaurantId);

        res.render('owner/edit-menu', {
            title: 'Edit Menu',
            menu,
            restaurant
        });
    } catch (error) {
        req.session.error = 'Error fetching menu details';
        res.redirect('/owner/my-restaurants');
    }
};

ownerController.updateMenu = async function (req, res) {
    try {
        const menu = await Menu.findById(req.params.menuId);

        await Menu.findByIdAndUpdate(req.params.menuId, req.body);

        res.redirect(`/owner/restaurant/${menu.restaurantId}/menus`);
    } catch (error) {
        res.render('owner/edit-menu', {
            title: 'Edit Menu',
            menu: { ...req.body, _id: req.params.menuId },
            restaurant: { _id: req.body.restaurantId },
            error: error.message
        });
    }
};

ownerController.deleteMenu = async function (req, res) {
    try {
        const menu = await Menu.findById(req.params.menuId);
        const restaurant = await Restaurant.findById(menu.restaurantId);

        await MenuItem.deleteMany({ menuId: req.params.menuId });

        await Menu.findByIdAndDelete(req.params.menuId);

        res.redirect(`/owner/restaurant/${menu.restaurantId}/menus`);
    } catch (error) {
        req.session.error = 'Error deleting menu';
        res.redirect('/owner/my-restaurants');
    }
};

ownerController.showMenuItems = async function (req, res) {
    try {
        const menu = await Menu.findById(req.params.menuId);
        const restaurant = await Restaurant.findById(menu.restaurantId);
        const menuItems = await MenuItem.find({ menuId: req.params.menuId });

        res.render('owner/menu-items', {
            title: `Items in ${menu.name}`,
            menu,
            restaurant,
            menuItems
        });
    } catch (error) {
        req.session.error = 'Error fetching menu items';
        res.redirect('/owner/my-restaurants');
    }
};

ownerController.showCreateMenuItem = async function (req, res) {
    try {
        const menu = await Menu.findById(req.params.menuId);
        const restaurant = await Restaurant.findById(menu.restaurantId);

        res.render('owner/create-menu-item', {
            title: 'Add New Menu Item',
            menu,
            restaurant
        });
    } catch (error) {
        console.log(error)
        res.redirect('/owner/my-restaurants');
    }
};

ownerController.createMenuItem = async function (req, res) {
    try {
        const menu = await Menu.findById(req.params.menuId);
        const restaurant = await Restaurant.findById(menu.restaurantId);

        if (req.file) {
            imagePath = '/uploads/' + req.file.filename;
        }

        await MenuItem.create({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            available: req.body.available === 'true',
            itemInfo: {
                calories: req.body.itemInfo_calories,
                proteins: req.body.itemInfo_proteins,
                fats: req.body.itemInfo_fats,
                carbohydrates: req.body.itemInfo_carbohydrates,
                fiber: req.body.itemInfo_fiber,
                sodium: req.body.itemInfo_sodium,
            },
            price: Number(req.body.price),
            menuId: req.params.menuId,
            image: imagePath
        })

        res.redirect(`/owner/menu/${req.params.menuId}/items`);
    } catch (error) {
        console.log(error); 
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

ownerController.showEditMenuItem = async function (req, res) {
    try {
        const menuItem = await MenuItem.findById(req.params.itemId);
        const menu = await Menu.findById(menuItem.menuId);
        const restaurant = await Restaurant.findById(menu.restaurantId);

        res.render('owner/edit-menu-item', {
            title: 'Edit Menu Item',
            menuItem,
            menu,
            restaurant
        });
    } catch (error) {
        req.session.error = 'Error fetching menu item details';
        res.redirect('/owner/my-restaurants');
    }
};

ownerController.updateMenuItem = async function (req, res) {
    try {
        const menuItem = await MenuItem.findById(req.params.itemId);
        const menu = await Menu.findById(menuItem.menuId);

        const updateData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            available: req.body.available === 'true',
            itemInfo: {
                calories: req.body.itemInfo_calories,
                proteins: req.body.itemInfo_proteins,
                fats: req.body.itemInfo_fats,
                carbohydrates: req.body.itemInfo_carbohydrates,
                fiber: req.body.itemInfo_fiber || undefined,
                sodium: req.body.itemInfo_sodium || undefined
            }
        };

        if (req.file) {
            if (menuItem.image) {
                const oldImagePath = path.join(__dirname, '../public', menuItem.image);
                
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            
            updateData.image = '/uploads/' + req.file.filename;
        }

        await MenuItem.findByIdAndUpdate(req.params.itemId, updateData);

        res.redirect(`/owner/menu/${menuItem.menuId}/items`);
    } catch (error) {
        console.log(error);
    }
};

ownerController.deleteMenuItem = async function (req, res) {
    try {
        const menuItem = await MenuItem.findById(req.params.itemId);
        const menu = await Menu.findById(menuItem.menuId);
        const restaurant = await Restaurant.findById(menu.restaurantId);

        if (menuItem.image) {
            const oldImagePath = path.join(__dirname, '../public', menuItem.image);
            
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        await MenuItem.findByIdAndDelete(req.params.itemId);

        res.redirect(`/owner/menu/${menuItem.menuId}/items`);
    } catch (error) {
        console.log(error);
    }
};

module.exports = ownerController;
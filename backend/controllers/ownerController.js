const Restaurant = require('../models/restaurant');
const Menu = require('../models/menu');
const MenuItem = require('../models/menuItem');
const fs = require('fs');
const path = require('path');
const { Types } = require('mongoose');

let ownerController = {}

ownerController.getMyRestaurants = async function (req, res) {
    try {
        const restaurants = await Restaurant.find({ owner: req.user.id });
        res.status(200).json(restaurants);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
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
            return res.status(400).json({ errors: errors });
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

        return res.status(201).json({ message: 'Restaurant created successfully.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

ownerController.getRestaurantById = async function (req, res) {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        return res.status(200).json({ restaurant });
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
      
          return res.status(200).json({ message: 'Restaurant updated successfully.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

ownerController.deleteRestaurant = async function (req, res) {
    try {
        const restaurantId = req.params.id;
        const menus = await Menu.find({ restaurantId });
        
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
        
        await Menu.deleteMany({ restaurantId });
        await Restaurant.findByIdAndDelete(restaurantId);
        
        return res.status(200).json({ message: 'Restaurant and related data deleted successfully.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

ownerController.showRestaurantMenus = async function (req, res) {
    try {
        const restaurantId = req.params.restaurantId;

        if (!Types.ObjectId.isValid(restaurantId)) {
            return res.redirect('/owner/my-restaurants');
        }

        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.redirect('/owner/my-restaurants');
        }

        const menus = await Menu.find({ restaurantId: restaurantId })

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
        const restaurantId = req.params.restaurantId;

        if (!Types.ObjectId.isValid(restaurantId)) {
            return res.redirect('/owner/my-restaurants');
        }

        const restaurant = await Restaurant.findById(restaurantId)

        if (!restaurant) {
            return res.redirect('/owner/my-restaurants');
        }

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
        const restaurantId = req.params.restaurantId;

        if (!Types.ObjectId.isValid(restaurantId)) {
            return res.redirect('/owner/my-restaurants');
        }

        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.redirect('/owner/my-restaurants');
        }

        const { name, description, active } = req.body
        const errors = [];

        if (!name || name.trim() === '') errors.push('Name is required.');
        if (!description || description.trim() === '') errors.push('Description is required.');

        if (errors.length > 0) {
            return res.render('owner/create-menu', {
                title: 'Create Menu',
                restaurant: restaurant,
                error: errors.join(' ')
              });
        }

        const menu = await Menu.create({
            name: name,
            description: description,
            restaurantId: req.params.restaurantId,
            active: active
        });

        res.redirect(`/owner/restaurant/${req.params.restaurantId}/menus`);
    } catch (error) {
        console.log(error)
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
        const menuId = req.params.menuId;

        if (!Types.ObjectId.isValid(menuId)) {
            return res.redirect('/owner/my-restaurants');
        }

        const menu = await Menu.findById(menuId);

        if (!menu) {
            return res.redirect('/owner/my-restaurants');
        }

        const restaurant = await Restaurant.findById(menu.restaurantId);

        if (!restaurant) {
            return res.redirect('/owner/my-restaurants');
        }

        res.render('owner/edit-menu', {
            title: 'Edit Menu',
            menu,
            restaurant
        });
    } catch (error) {
        console.error(error);
        res.redirect('/owner/my-restaurants');
    }
};

ownerController.updateMenu = async function (req, res) {
    try {
        const menuId = req.params.menuId;

        if (!Types.ObjectId.isValid(menuId)) {
            return res.redirect('/owner/my-restaurants');
        }

        const menu = await Menu.findById(menuId);

        if (!menu) {
            return res.redirect('/owner/my-restaurants');
        }

        const restaurant = await Restaurant.findById(menu.restaurantId);

        if (!restaurant) {
            return res.redirect('/owner/my-restaurants');
        }

        const { name, description } = req.body;
        const errors = []

        if (!name || name.trim() === '') errors.push('Name is required.');
        if (!description || description.trim() === '') errors.push('Description is required.');

        if (errors.length > 0) {
            return res.render('owner/edit-menu', {
                title: 'Edit Menu',
                menu: menu,
                restaurant: restaurant,
                error: errors.join(' ')
              });
        }

        await Menu.findByIdAndUpdate(req.params.menuId, req.body);

        res.redirect(`/owner/restaurant/${menu.restaurantId}/menus`);
    } catch (error) {
        console.log(error)
        res.redirect('/owner/my-restaurants');
    }
};

ownerController.deleteMenu = async function (req, res) {
    try {
        const menuId = req.params.menuId;

        if (!Types.ObjectId.isValid(menuId)) {
            return res.redirect('/owner/my-restaurants');
        }

        const menu = await Menu.findById(menuId);

        if (!menu) {
            return res.redirect('/owner/my-restaurants');
        }

        const restaurant = await Restaurant.findById(menu.restaurantId);

        if (!restaurant) {
            return res.redirect('/owner/my-restaurants');
        }

        await MenuItem.deleteMany({ menuId: menuId });
        await Menu.findByIdAndDelete(menuId);

        res.redirect(`/owner/restaurant/${menu.restaurantId}/menus`);
    } catch (error) {
        console.log(error);
        res.redirect('/owner/my-restaurants');
    }
};

ownerController.showMenuItems = async function (req, res) {
    try {
        const menuId = req.params.menuId;

        if (!Types.ObjectId.isValid(menuId)) {
            return res.redirect('/owner/my-restaurants');
        }

        const menu = await Menu.findById(menuId);

        if (!menu) {
            return res.redirect('/owner/my-restaurants');
        }

        const restaurant = await Restaurant.findById(menu.restaurantId);

        if (!restaurant) {
            return res.redirect('/owner/my-restaurants');
        }

        const menuItems = await MenuItem.find({ menuId: req.params.menuId });

        res.render('owner/menu-items', {
            title: `Items in ${menu.name}`,
            menu,
            restaurant,
            menuItems
        });
    } catch (error) {
        console.log(error)
        res.redirect('/owner/my-restaurants');
    }
};

ownerController.showCreateMenuItem = async function (req, res) {
    try {
        const menuId = req.params.menuId;

        if (!Types.ObjectId.isValid(menuId)) {
            return res.redirect('/owner/my-restaurants');
        }

        const menu = await Menu.findById(menuId);

        if (!menu) {
            return res.redirect('/owner/my-restaurants');
        }

        const restaurant = await Restaurant.findById(menu.restaurantId);

        if (!restaurant) {
            return res.redirect('/owner/my-restaurants');
        }

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
        const menuId = req.params.menuId;

        if (!Types.ObjectId.isValid(menuId)) {
            return res.redirect('/owner/my-restaurants');
        }

        const menu = await Menu.findById(menuId);

        if (!menu) {
            return res.redirect('/owner/my-restaurants');
        }

        const restaurant = await Restaurant.findById(menu.restaurantId);

        if (!restaurant) {
            return res.redirect('/owner/my-restaurants');
        }

        const { name, description, category, available, price } = req.body;

        const errors = []

        if (!name || name.trim() === '') errors.push('Name is required.');
        if (!description || description.trim() === '') errors.push('Description is required.');
        if (!price || isNaN(price)) errors.push('Valid price is required.');

        const itemInfo = {
            calories: req.body.itemInfo_calories ? Number(req.body.itemInfo_calories) : null,
            proteins: req.body.itemInfo_proteins ? Number(req.body.itemInfo_proteins) : null,
            fats: req.body.itemInfo_fats ? Number(req.body.itemInfo_fats) : null,
            carbohydrates: req.body.itemInfo_carbohydrates ? Number(req.body.itemInfo_carbohydrates) : null,
            fiber: req.body.itemInfo_fiber ? Number(req.body.itemInfo_fiber) : null,
            sodium: req.body.itemInfo_sodium ? Number(req.body.itemInfo_sodium) : null,
        };

        Object.keys(itemInfo).forEach(key => {
            if (itemInfo[key] === null || isNaN(itemInfo[key])) {
                errors.push(`${key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()} is required and must be a valid number.`);
            }
        });

        if (!req.file) {
            errors.push('Image is required.');
        }

        if (errors.length > 0) {
            return res.render('owner/create-menu-item', {
                title: 'Add New Menu Item',
                menu,
                restaurant,
                error: errors
            });
        }

        let imagePath = null;
        if (req.file) {
            imagePath = '/uploads/' + req.file.filename;
        }

        await MenuItem.create({
            name: name,
            description: description,
            category: category,
            available: available === 'true',
            itemInfo: itemInfo,
            price: Number(price),
            menuId: menuId,
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
        const itemId = req.params.itemId;

        if (!Types.ObjectId.isValid(itemId)) {
            return res.redirect('/owner/my-restaurants');
        }

        const menuItem = await MenuItem.findById(itemId);

        if (!menuItem) {
            return res.redirect('/owner/my-restaurants');
        }

        const menu = await Menu.findById(menuItem.menuId);

        if (!menu) {
            return res.redirect('/owner/my-restaurants');
        }

        const restaurant = await Restaurant.findById(menu.restaurantId);

        if (!restaurant) {
            return res.redirect('/owner/my-restaurants');
        }

        res.render('owner/edit-menu-item', {
            title: 'Edit Menu Item',
            menuItem,
            menu,
            restaurant
        });
    } catch (error) {
        console.log(error)
        res.redirect('/owner/my-restaurants');
    }
};

ownerController.updateMenuItem = async function (req, res) {
    try {
        const itemId =  req.params.itemId;

        if (!Types.ObjectId.isValid(itemId)) {
            return res.redirect('/owner/my-restaurants');
        }

        const menuItem = await MenuItem.findById(itemId);

        if (!menuItem) {
            return res.redirect('/owner/my-restaurants');
        }

        const menu = await Menu.findById(menuItem.menuId);

        if (!menu) {
            return res.redirect('/owner/my-restaurants');
        }

        const restaurant = await Restaurant.findById(menu.restaurantId);

        if (!restaurant) {
            return res.redirect('/owner/my-restaurants');
        }

        const { name, description, price, category, available, itemInfo_calories, itemInfo_proteins, itemInfo_fats, itemInfo_carbohydrates, itemInfo_fiber, itemInfo_sodium } = req.body;
        const errors = [];

        if (!name || name.trim() === '') errors.push('Name is required.');
        if (!description || description.trim() === '') errors.push('Description is required.');
        if (!price || isNaN(price)) errors.push('Valid price is required.');
        
        const itemInfo = {
            calories: itemInfo_calories ? Number(itemInfo_calories) : null,
            proteins: itemInfo_proteins ? Number(itemInfo_proteins) : null,
            fats: itemInfo_fats ? Number(itemInfo_fats) : null,
            carbohydrates: itemInfo_carbohydrates ? Number(itemInfo_carbohydrates) : null,
            fiber: itemInfo_fiber ? Number(itemInfo_fiber) : null,
            sodium: itemInfo_sodium ? Number(itemInfo_sodium) : null,
        };

        Object.keys(itemInfo).forEach(key => {
            if (itemInfo[key] === null || isNaN(itemInfo[key])) {
                errors.push(`${key.charAt(0).toUpperCase() + key.slice(1)} is required and must be a valid number.`);
            }
        });

        if (errors.length > 0) {
            return res.render('owner/edit-menu-item', {
                title: 'Edit Menu Item',
                menuItem,
                menu,
                restaurant,
                error: errors
            });
        }

        const updateData = {
            name,
            description,
            price: Number(price),
            category,
            available: available === 'true',
            itemInfo,
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
        const itemId =  req.params.itemId;

        if (!Types.ObjectId.isValid(itemId)) {
            return res.redirect('/owner/my-restaurants');
        }

        const menuItem = await MenuItem.findById(itemId);
        
        if (!menuItem) {
            return res.redirect('/owner/my-restaurants');
        }

        const menu = await Menu.findById(menuItem.menuId);

        if (!menu) {
            return res.redirect('/owner/my-restaurants');
        }

        const restaurant = await Restaurant.findById(menu.restaurantId);

        if (!restaurant) {
            return res.redirect('/owner/my-restaurants');
        }

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
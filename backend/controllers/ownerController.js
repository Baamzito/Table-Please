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

ownerController.getMenusByRestaurant = async function (req, res) {
    try {
        const restaurantId = req.params.restaurantId;

        if (!Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: 'Invalid restaurant ID.' });
        }

        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        const menus = await Menu.find({ restaurantId: restaurantId })

        return res.status(200).json({ menus });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' });
    }
};

ownerController.createMenu = async function (req, res) {
    try {
        const restaurantId = req.params.restaurantId;

        if (!Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: 'Invalid restaurant ID.' });
        }

        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        const { name, description, active } = req.body
        const errors = [];

        if (!name || name.trim() === '') errors.push('Name is required.');
        if (!description || description.trim() === '') errors.push('Description is required.');

        if (errors.length > 0) {
            return res.status(400).json({ message: errors.join(' ') });
        }

        const menu = await Menu.create({
            name: name,
            description: description,
            restaurantId: req.params.restaurantId,
            active: active
        });

        return res.status(201).json({ message: 'Menu created successfully.', menu });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

ownerController.getMenuById = async function (req, res) {
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

        return res.status(200).json({ menu });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

ownerController.updateMenu = async function (req, res) {
    try {
        const menuId = req.params.menuId;

        if (!Types.ObjectId.isValid(menuId)) {
            return res.status(400).json({ error: 'Invalid menu ID.' });
        }

        const menu = await Menu.findById(menuId);

        if (!menu) {
            return res.status(404).json({ error: 'Menu not found.' });
        }

        const restaurant = await Restaurant.findById(menu.restaurantId);

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found.' });
        }

        const { name, description } = req.body;
        const errors = []

        if (!name || name.trim() === '') errors.push('Name is required.');
        if (!description || description.trim() === '') errors.push('Description is required.');

        if (errors.length > 0) {
            return res.status(400).json({ error: errors.join(' ') });
        }

        await Menu.findByIdAndUpdate(req.params.menuId, req.body);

        res.status(200).json({ message: 'Menu updated successfully.' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error.' });
    }
};

ownerController.deleteMenu = async function (req, res) {
    try {
        const menuId = req.params.menuId;

        if (!Types.ObjectId.isValid(menuId)) {
            return res.status(400).json({ message: 'Invalid menu ID.' });
        }

        const menu = await Menu.findById(menuId);

        if (!menu) {
            return res.status(404).json({ message: 'Menu not found.' });
        }

        const restaurant = await Restaurant.findById(menu.restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        await MenuItem.deleteMany({ menuId: menuId });
        await Menu.findByIdAndDelete(menuId);

        return res.status(200).json({ message: 'Menu deleted successfully.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

ownerController.getMenuItemsByMenu = async function (req, res) {
    try {
        const menuId = req.params.menuId;

        if (!Types.ObjectId.isValid(menuId)) {
            return res.status(400).json({ message: 'Invalid menu ID.' });
        }

        const menu = await Menu.findById(menuId);

        if (!menu) {
            return res.status(404).json({ message: 'Menu not found.' });
        }

        const restaurant = await Restaurant.findById(menu.restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        const rawMenuItems = await MenuItem.find({ menuId });
        const baseUrl = 'http://localhost:3000/';

        const menuItems = [];
        for (let item of rawMenuItems) {
        const plainItem = item.toObject();
        if (plainItem.image) {
            plainItem.image = baseUrl + plainItem.image;
        }
        menuItems.push(plainItem);
        }

        return res.status(200).json({ menuItems });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error.' });
    }
};

ownerController.createMenuItem = async function (req, res) {
    try {
        const menuId = req.params.menuId;

        if (!Types.ObjectId.isValid(menuId)) {
            return res.status(400).json({ message: 'Invalid menu ID.' });
        }

        const menu = await Menu.findById(menuId);

        if (!menu) {
            return res.status(404).json({ message: 'Menu not found.' });
        }

        const restaurant = await Restaurant.findById(menu.restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
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
            return res.status(400).json({ message: 'Validation errors.', errors });
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

        return res.status(201).json({ message: 'Menu item created successfully.' });
    } catch (error) {
        console.log(error); 
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

ownerController.getMenuItemById = async function (req, res) {
    try {
        const itemId = req.params.itemId;

        if (!Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: 'Invalid item ID.' });
        }

        const menuItem = await MenuItem.findById(itemId);

        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found.' });
        }

        const menu = await Menu.findById(menuItem.menuId);

        if (!menu) {
            return res.status(404).json({ message: 'Menu not found.' });
        }

        const restaurant = await Restaurant.findById(menu.restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        if (menuItem.image) {
            menuItem.image = `${process.env.BASE_URL}${menuItem.image}`;
        }

        return res.status(200).json({ menuItem });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

ownerController.updateMenuItem = async function (req, res) {
    try {
        const itemId =  req.params.itemId;

        if (!Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: 'Invalid menu item ID.' });
        }

        const menuItem = await MenuItem.findById(itemId);

        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found.' });
        }

        const menu = await Menu.findById(menuItem.menuId);

        if (!menu) {
            return res.status(404).json({ message: 'Menu not found.' });
        }

        const restaurant = await Restaurant.findById(menu.restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
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
            return res.status(400).json({ message: 'Validation errors.', errors });
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

        return res.status(200).json({ message: 'Menu item updated successfully.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

ownerController.deleteMenuItem = async function (req, res) {
    try {
        const itemId =  req.params.itemId;

        if (!Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: 'Invalid item ID.' });
        }

        const menuItem = await MenuItem.findById(itemId);
        
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found.' });
        }

        const menu = await Menu.findById(menuItem.menuId);

        if (!menu) {
            return res.status(404).json({ message: 'Menu not found.' });
        }

        const restaurant = await Restaurant.findById(menu.restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        if (menuItem.image) {
            const oldImagePath = path.join(__dirname, '../public', menuItem.image);
            
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        await MenuItem.findByIdAndDelete(req.params.itemId);

        return res.status(200).json({ message: 'Menu item deleted successfully.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = ownerController;
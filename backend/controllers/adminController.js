const User = require('../models/user')
const Restaurant = require('../models/restaurant')

let adminController = {}

adminController.getStats = async function (req, res) {
    try {
        const pendingUsers = await User.find({ role: 'restaurant', validated: false }).sort({ createdAt: -1 });
        const validatedUsersCount = await User.countDocuments({ role: 'restaurant', validated: true });
        const pendingUsersCount = pendingUsers.length;
        const totalRestaurantUsersCount = await User.countDocuments({ role: 'restaurant' });
        const totalRestaurantsCount = await Restaurant.countDocuments();

        res.json({
            validatedUsersCount,
            pendingUsersCount,
            totalRestaurantUsersCount,
            totalRestaurantsCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

adminController.getPendingUsers = async function (req, res) {
    try {
        const pendingUsers = await User.find({ role: 'restaurant', validated: false }).sort({ createdAt: -1 });

        const usersWithFullImageUrl = pendingUsers.map(user => {
            return {
                ...user.toObject(),
                profileImage: user.profileImage 
                  ? `${process.env.BASE_URL}${user.profileImage}` 
                  : `${process.env.BASE_URL}/images/default-avatar.jpg`
            };
        });

        res.json(usersWithFullImageUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch pending users' });
    }
}


adminController.validateUser = async function (req, res) {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user || user.role !== 'restaurant') {
            return res.status(400).json({ error: 'Invalid user or role' });
        }

        await User.findByIdAndUpdate(userId, { validated: true });

        res.json({ message: 'User validated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to validate user' });
    }
}

adminController.addRestaurant = async function (req, res) {
    try {
        const newRestaurant = new Restaurant({
            name: req.body.name,
            address: {
                street: req.body.address_street,
                city: req.body.address_city,
                postcode: req.body.address_postcode
            },
            contact: {
                phone: req.body.contact_phone,
                email: req.body.contact_email || ""
            },
            owner: req.body.owner,
        });

        await newRestaurant.save();

        res.status(201).json({ message: 'Restaurant added successfully', restaurant: newRestaurant });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add restaurant' });
    }
}

adminController.editRestaurant = async function (req, res) {
    try {
        const restaurantId = req.params.id;
        const updates = req.body;

        const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, updates, { new: true });

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        res.json({ message: 'Restaurant updated successfully', restaurant });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update restaurant' });
    }
}

adminController.deleteRestaurant = async function (req, res) {
    try {
        const restaurantId = req.params.id;

        await Restaurant.findByIdAndDelete(restaurantId);

        res.json({ message: 'Restaurant removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete restaurant' });
    }
}

adminController.getValidatedRestaurants = async function (req, res) {
    try {
        const restaurantsList = await Restaurant.find()
            .populate('owner', 'firstName lastName username')
            .sort({ name: 1 });

        res.json(restaurantsList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch validated restaurants' });
    }
}

adminController.getAllRestaurants = async function (req, res) {
    try {
        const allRestaurants = await Restaurant.find()
            .populate('owner', 'firstName lastName username')
            .sort({ name: 1 });

        res.json(allRestaurants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch all restaurants' });
    }
}

module.exports = adminController;

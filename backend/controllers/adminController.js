const User = require('../models/user')
const Restaurant = require('../models/restaurant')

let adminController = {}

adminController.showDashboard = async function (req, res) {
    try {
        const userData = await User.findById(req.user.id)
        const pendingUsers = await User.find({ role: 'restaurant', validated: false }).sort({ createdAt: -1 });
        const validatedUsersCount = await User.countDocuments({ role: 'restaurant', validated: true });
        const pendingUsersCount = pendingUsers.length;
        const totalRestaurantUsersCount = await User.countDocuments({ role: 'restaurant' });
        const totalRestaurantsCount = await Restaurant.countDocuments();
        const restaurantsList = await Restaurant.find().populate('owner', 'firstName lastName username profileImage').sort({ name: 1 }).limit(9);
        const restaurantOwners = await User.find({ role: 'restaurant', validated: true }).select('firstName lastName username');

        res.render('admin/dashboard', {
            title: 'Dashboard',
            admin: userData,
            pendingUsers,
            validatedUsersCount,
            pendingUsersCount,
            totalRestaurantUsersCount,
            totalRestaurantsCount,
            restaurantsList,
            restaurantOwners
        });

    } catch (error) {
        console.error(error);
        res.status(500).render('error', {
            message: 'An error ocurred',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
}

adminController.validateUser = async function (req, res) {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.render('admin/dashboard', {
                error: 'User not found',
                title: 'Dashboard',
                admin: req.user,
                pendingUsers: await User.find({ role: 'restaurant', validated: false }).sort({ createdAt: -1 }),
                validatedUsersCount: await User.countDocuments({ role: 'restaurant', validated: true }),
                pendingUsersCount: await User.countDocuments({ role: 'restaurant', validated: false }),
                totalRestaurantUsersCount: await User.countDocuments({ role: 'restaurant' }),
                totalRestaurantsCount: await Restaurant.countDocuments(),
                restaurantsList: await Restaurant.find().populate('owner', 'firstName lastName username profileImage').sort({ name: 1 }).limit(9),
                restaurantOwners: await User.find({ role: 'restaurant', validated: true }).select('firstName lastName username')
            });
        }

        if (user.role !== 'restaurant') {
            return res.render('admin/dashboard', {
                error: 'Only users with restaurant role can be validated',
                title: 'Dashboard',
                admin: req.user,
                pendingUsers: await User.find({ role: 'restaurant', validated: false }).sort({ createdAt: -1 }),
                validatedUsersCount: await User.countDocuments({ role: 'restaurant', validated: true }),
                pendingUsersCount: await User.countDocuments({ role: 'restaurant', validated: false }),
                totalRestaurantUsersCount: await User.countDocuments({ role: 'restaurant' }),
                totalRestaurantsCount: await Restaurant.countDocuments(),
                restaurantsList: await Restaurant.find().populate('owner', 'firstName lastName username profileImage').sort({ name: 1 }).limit(9),
                restaurantOwners: await User.find({ role: 'restaurant', validated: true }).select('firstName lastName username')
            });
        }

        await User.findByIdAndUpdate(userId, { validated: true });

        const pendingUsers = await User.find({role: 'restaurant',validated: false}).sort({ createdAt: -1 });
        const validatedUsersCount = await User.countDocuments({role: 'restaurant',validated: true});
        const pendingUsersCount = pendingUsers.length;
        const restaurantsList = await Restaurant.find().populate('owner', 'firstName lastName username profileImage').sort({ name: 1 }).limit(9);
        const restaurantOwners = await User.find({role: 'restaurant',validated: true}).select('firstName lastName username');

        res.render('admin/dashboard', {
            success: `${user.firstName} ${user.lastName} was validated successfully`,
            title: 'Dashboard',
            admin: req.user,
            pendingUsers,
            validatedUsersCount,
            pendingUsersCount,
            totalRestaurantUsersCount: await User.countDocuments({ role: 'restaurant' }),
            totalRestaurantsCount: await Restaurant.countDocuments(),
            restaurantsList,
            restaurantOwners
        });

    } catch (error) {
        console.error(error);
        res.redirect('/admin/dashboard');
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

        console.log(newRestaurant)

        await newRestaurant.save();

        res.render('admin/dashboard', {
            success: 'Restaurant added successfully',
            title: 'Dashboard',
            admin: req.user,
            pendingUsers: await User.find({ role: 'restaurant', validated: false }).sort({ createdAt: -1 }),
            validatedUsersCount: await User.countDocuments({ role: 'restaurant', validated: true }),
            pendingUsersCount: await User.countDocuments({ role: 'restaurant', validated: false }),
            totalRestaurantUsersCount: await User.countDocuments({ role: 'restaurant' }),
            totalRestaurantsCount: await Restaurant.countDocuments(),
            restaurantsList: await Restaurant.find().populate('owner', 'firstName lastName username profileImage').sort({ name: 1 }).limit(9),
            restaurantOwners: await User.find({ role: 'restaurant', validated: true }).select('firstName lastName username')
        });

    } catch (error) {
        console.error(error);
        res.redirect('/admin/dashboard');
    }
}

adminController.editRestaurant = async function (req, res) {
    try {
        const restaurantId = req.params.id;
        const { name, description } = req.body;
        const address = req.body.address;

        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.render('admin/dashboard', {
                error: 'Restaurant not found',
                title: 'Dashboard',
                admin: req.user,
                pendingUsers: await User.find({ role: 'restaurant', validated: false }).sort({ createdAt: -1 }),
                validatedUsersCount: await User.countDocuments({ role: 'restaurant', validated: true }),
                pendingUsersCount: await User.countDocuments({ role: 'restaurant', validated: false }),
                totalRestaurantUsersCount: await User.countDocuments({ role: 'restaurant' }),
                totalRestaurantsCount: await Restaurant.countDocuments(),
                restaurantsList: await Restaurant.find().populate('owner', 'firstName lastName username profileImage').sort({ name: 1 }).limit(9),
                restaurantOwners: await User.find({ role: 'restaurant', validated: true }).select('firstName lastName username')
            });
        }

        restaurant.name = name;
        restaurant.description = description;
        restaurant.address = address;

        await restaurant.save();

        res.render('admin/dashboard', {
            success: 'Restaurant updated successfully',
            title: 'Dashboard',
            admin: req.user,
            pendingUsers: await User.find({ role: 'restaurant', validated: false }).sort({ createdAt: -1 }),
            validatedUsersCount: await User.countDocuments({ role: 'restaurant', validated: true }),
            pendingUsersCount: await User.countDocuments({ role: 'restaurant', validated: false }),
            totalRestaurantUsersCount: await User.countDocuments({ role: 'restaurant' }),
            totalRestaurantsCount: await Restaurant.countDocuments(),
            restaurantsList: await Restaurant.find().populate('owner', 'firstName lastName username profileImage').sort({ name: 1 }).limit(9),
            restaurantOwners: await User.find({ role: 'restaurant', validated: true }).select('firstName lastName username')
        });

    } catch (error) {
        console.error(error);
        res.redirect('/admin/dashboard');
    }
};

adminController.deleteRestaurant = async function (req, res) {
    try {
        const restaurantId = req.params.id;

        await Restaurant.findByIdAndDelete(restaurantId);

        res.render('admin/dashboard', {
            success: 'Restaurant removed successfully',
            title: 'Dashboard',
            admin: req.user,
            pendingUsers: await User.find({ role: 'restaurant', validated: false }).sort({ createdAt: -1 }),
            validatedUsersCount: await User.countDocuments({ role: 'restaurant', validated: true }),
            pendingUsersCount: await User.countDocuments({ role: 'restaurant', validated: false }),
            totalRestaurantUsersCount: await User.countDocuments({ role: 'restaurant' }),
            totalRestaurantsCount: await Restaurant.countDocuments(),
            restaurantsList: await Restaurant.find().populate('owner', 'firstName lastName username profileImage').sort({ name: 1 }).limit(9),
            restaurantOwners: await User.find({ role: 'restaurant', validated: true }).select('firstName lastName username')
        });

    } catch (error) {
        console.error(error);
        res.redirect('/admin/dashboard');
    }
}

//Fazer a view 'restaurants', talvez alterar para 'all-owners'
adminController.getValidatedRestaurants = async function (req, res) {
    try {
        const restaurantsList = await Restaurant.find()
            .populate('owner', 'firstName lastName username')
            .sort({ name: 1 });

        res.render('admin/restaurants', {
            title: 'All Restaurants',
            admin: req.user,
            restaurants: restaurantsList
        });

    } catch (error) {
        console.error(error);
        res.redirect('/admin/dashboard');
    }
}

//Fazer a view 'all-restaurants'
adminController.getAllRestaurants = async function (req, res) {
    try {
        const allRestaurants = await Restaurant.find()
            .populate('owner', 'firstName lastName username')
            .sort({ name: 1 });

        res.render('admin/all-restaurants', {
            title: 'Todos os Restaurantes',
            admin: req.user,
            restaurants: allRestaurants
        });

    } catch (error) {
        console.error(error);
        res.redirect('/admin/dashboard');
    }
}

module.exports = adminController
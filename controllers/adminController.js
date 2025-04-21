const User = require('../models/user')
const Restaurant = require('../models/restaurant')

let adminController = {}

adminController.showDashboard = async function (req, res) {
    try {
        const userData = await User.findById(req.user.id)
        // Obter usuários com role restaurante que não estão validados
        const pendingUsers = await User.find({
            role: 'restaurant',
            validated: false
        }).sort({ createdAt: -1 });

        // Obter contagem de restaurantes validados
        const validatedCount = await User.countDocuments({
            role: 'restaurant',
            validated: true
        });

        // Obter contagem de restaurantes pendentes
        const pendingCount = pendingUsers.length;

        // Obter total de restaurantes
        const totalRestaurantsCount = await User.countDocuments({ role: 'restaurant' });

        // Obter restaurantes validados para o container de gestão
        const validatedRestaurants = await Restaurant.find()
            .populate('owner', 'firstName lastName username')
            .sort({ name: 1 })
            .limit(9); // Limitando a 9 para a exibição em grid

        // Obter usuários com role restaurante para o dropdown de adicionar restaurante
        const restaurantOwners = await User.find({
            role: 'restaurant',
            validated: true
        }).select('firstName lastName username');

        res.render('admin/dashboard', {
            title: 'Dashboard',
            admin: userData,
            pendingUsers,
            validatedCount,
            pendingCount,
            totalRestaurantsCount,
            validatedRestaurants,
            restaurantOwners
        });

    } catch (error) {
        console.error('Erro no painel de administração:', error);
        res.status(500).render('error', {
            message: 'Ocorreu um erro ao carregar o painel de administração',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
}

adminController.validateUser = async function (req, res) {
    try {
        const userId = req.params.id;

        // Encontrar o usuário pelo ID
        const user = await User.findById(userId);

        if (!user) {
            return res.render('admin/dashboard', {
                error: 'User not found',
                // Include all the other data needed for the dashboard
                title: 'Dashboard',
                admin: req.user,
                // Fetch all needed data again
                pendingUsers: await User.find({
                    role: 'restaurant',
                    validated: false
                }).sort({ createdAt: -1 }),
                validatedCount: await User.countDocuments({
                    role: 'restaurant',
                    validated: true
                }),
                pendingCount: await User.countDocuments({
                    role: 'restaurant',
                    validated: false
                }),
                totalRestaurantsCount: await User.countDocuments({ role: 'restaurant' }),
                validatedRestaurants: await Restaurant.find()
                    .populate('owner', 'firstName lastName username')
                    .sort({ name: 1 })
                    .limit(9),
                restaurantOwners: await User.find({
                    role: 'restaurant',
                    validated: true
                }).select('firstName lastName username')
            });
        }

        if (user.role !== 'restaurant') {
            return res.render('admin/dashboard', {
                error: 'Only users with restaurant role can be validated',
                // Include all the other data needed for the dashboard
                title: 'Dashboard',
                admin: req.user,
                // Fetch all needed data again
                pendingUsers: await User.find({
                    role: 'restaurant',
                    validated: false
                }).sort({ createdAt: -1 }),
                validatedCount: await User.countDocuments({
                    role: 'restaurant',
                    validated: true
                }),
                pendingCount: await User.countDocuments({
                    role: 'restaurant',
                    validated: false
                }),
                totalRestaurantsCount: await User.countDocuments({ role: 'restaurant' }),
                validatedRestaurants: await Restaurant.find()
                    .populate('owner', 'firstName lastName username')
                    .sort({ name: 1 })
                    .limit(9),
                restaurantOwners: await User.find({
                    role: 'restaurant',
                    validated: true
                }).select('firstName lastName username')
            });
        }

        // Atualizar usuário para status validado
        user.validated = true;
        await user.save();

        // Mensagem de sucesso e redirecionamento
        res.render('admin/dashboard', {
            success: `${user.firstName} ${user.lastName} was validated successfully`,
            title: 'Dashboard',
            admin: req.user,
            pendingUsers,
            validatedCount: await User.countDocuments({
                role: 'restaurant',
                validated: true
            }),
            pendingCount: pendingUsers.length,
            totalRestaurantsCount: await User.countDocuments({ role: 'restaurant' }),
            validatedRestaurants: await Restaurant.find()
                .populate('owner', 'firstName lastName username')
                .sort({ name: 1 })
                .limit(9),
            restaurantOwners: await User.find({
                role: 'restaurant',
                validated: true
            }).select('firstName lastName username')
        });

    } catch (error) {
        console.error('Erro ao validar utilizador:', error);
        res.redirect('/admin/dashboard');
    }
}

adminController.addRestaurant = async function (req, res) {
    try {
        const { name, owner, description } = req.body;
        const address = req.body.address;

        // Criar novo restaurante
        const newRestaurant = new Restaurant({
            name,
            owner,
            description,
            address
        });

        await newRestaurant.save();

        res.render('admin/dashboard', {
            success: 'Restaurant added successfully',
            title: 'Dashboard',
            admin: req.user,
            pendingUsers: await User.find({
                role: 'restaurant',
                validated: false
            }).sort({ createdAt: -1 }),
            validatedCount: await User.countDocuments({
                role: 'restaurant',
                validated: true
            }),
            pendingCount: await User.countDocuments({
                role: 'restaurant',
                validated: false
            }),
            totalRestaurantsCount: await User.countDocuments({ role: 'restaurant' }),
            validatedRestaurants: await Restaurant.find()
                .populate('owner', 'firstName lastName username')
                .sort({ name: 1 })
                .limit(9),
            restaurantOwners: await User.find({
                role: 'restaurant',
                validated: true
            }).select('firstName lastName username')
        });

    } catch (error) {
        console.error('Erro ao adicionar restaurante:', error);
        res.redirect('/admin/dashboard');
    }
}

adminController.editRestaurant = async function (req, res) {
    try {
        const restaurantId = req.params.id;
        const { name, description } = req.body;
        const address = req.body.address;

        // Encontrar e atualizar o restaurante
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.render('admin/dashboard', {
                error: 'Restaurant not found',
                title: 'Dashboard',
                admin: req.user,
                pendingUsers: await User.find({
                    role: 'restaurant',
                    validated: false
                }).sort({ createdAt: -1 }),
                validatedCount: await User.countDocuments({
                    role: 'restaurant',
                    validated: true
                }),
                pendingCount: await User.countDocuments({
                    role: 'restaurant',
                    validated: false
                }),
                totalRestaurantsCount: await User.countDocuments({ role: 'restaurant' }),
                validatedRestaurants: await Restaurant.find()
                    .populate('owner', 'firstName lastName username')
                    .sort({ name: 1 })
                    .limit(9),
                restaurantOwners: await User.find({
                    role: 'restaurant',
                    validated: true
                }).select('firstName lastName username')
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
            pendingUsers: await User.find({
                role: 'restaurant',
                validated: false
            }).sort({ createdAt: -1 }),
            validatedCount: await User.countDocuments({
                role: 'restaurant',
                validated: true
            }),
            pendingCount: await User.countDocuments({
                role: 'restaurant',
                validated: false
            }),
            totalRestaurantsCount: await User.countDocuments({ role: 'restaurant' }),
            validatedRestaurants: await Restaurant.find()
                .populate('owner', 'firstName lastName username')
                .sort({ name: 1 })
                .limit(9),
            restaurantOwners: await User.find({
                role: 'restaurant',
                validated: true
            }).select('firstName lastName username')
        });

    } catch (error) {
        console.error('Erro ao editar restaurante:', error);
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
            pendingUsers: await User.find({
                role: 'restaurant',
                validated: false
            }).sort({ createdAt: -1 }),
            validatedCount: await User.countDocuments({
                role: 'restaurant',
                validated: true
            }),
            pendingCount: await User.countDocuments({
                role: 'restaurant',
                validated: false
            }),
            totalRestaurantsCount: await User.countDocuments({ role: 'restaurant' }),
            validatedRestaurants: await Restaurant.find()
                .populate('owner', 'firstName lastName username')
                .sort({ name: 1 })
                .limit(9),
            restaurantOwners: await User.find({
                role: 'restaurant',
                validated: true
            }).select('firstName lastName username')
        });

    } catch (error) {
        console.error('Erro ao remover restaurante:', error);
        res.redirect('/admin/dashboard');
    }
}

adminController.getValidatedRestaurants = async function (req, res) {
    try {
        const validatedRestaurants = await Restaurant.find()
            .populate('owner', 'firstName lastName username')
            .sort({ name: 1 });

        res.render('admin/restaurants', {
            title: 'Validated Restaurants',
            admin: req.user,
            restaurants: validatedRestaurants
        });

    } catch (error) {
        console.error('Erro ao obter restaurantes validados:', error);
        res.redirect('/admin/dashboard');
    }
}

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
        console.error('Erro ao obter todos os restaurantes:', error);
        req.flash('error', 'Ocorreu um erro ao carregar todos os restaurantes');
        res.redirect('/admin/dashboard');
    }
}

module.exports = adminController
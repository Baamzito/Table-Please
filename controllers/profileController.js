const User = require('../models/user')
const fs = require('fs');
const path = require('path');

let profileController = {}

profileController.showProfile = async function (req, res) {
    try {
        const userData = await User.findById(req.user.id)
        res.render('profile/profile', { title: 'Profile', user: userData })
    } catch (error) {
        res.status(500).send('Error fetching profile data.');
    }
}

profileController.showEditProfile = async function (req, res) {
    try {
        const userData = await User.findById(req.user.id)
        res.render('profile/profile-edit', { title: 'Profile Edit', user: userData })
    } catch (error) {
        res.status(500).send('Error fetching profile data.');
    }
}

profileController.updateProfile = async function (req, res) {
    try {
        const userId = req.user.id;
        const { firstName, lastName, username, email, address_street, address_city, address_postalCode } = req.body;

        if (!username || typeof username !== 'string' || username.trim().length < 5) {
            return res.render('profile/profile-edit', {
                title: 'Profile Edit',
                error: 'Username is required and must be at least 5 characters long.',
                user: await User.findById(userId)
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.render('profile/profile-edit', {
                title: 'Profile Edit',
                error: 'Please enter a valid email address.',
                user: await User.findById(userId)
            });
        }

        if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
            return res.render('profile/profile-edit', {
                title: 'Profile Edit',
                error: 'First name is required.',
                user: await User.findById(userId)
            });
        }

        if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
            return res.render('profile/profile-edit', {
                title: 'Profile Edit',
                error: 'Last name is required.',
                user: await User.findById(userId)
            });
        }

        if (address_street && typeof address_street !== 'string') {
            return res.render('profile/profile-edit', {
                title: 'Profile Edit',
                error: 'Street address must be valid text.',
                user: await User.findById(userId)
            });
        }

        if (address_city && typeof address_city !== 'string') {
            return res.render('profile/profile-edit', {
                title: 'Profile Edit',
                error: 'City must be valid text.',
                user: await User.findById(userId)
            });
        }

        if (address_postalCode) {
            const postalRegex = /^[0-9]{4}-[0-9]{3}$/;
            if (!postalRegex.test(address_postalCode)) {
                return res.render('profile/profile-edit', {
                    title: 'Profile Edit',
                    error: 'Please enter a valid postal code in format XXXX-XXX.',
                    user: await User.findById(userId)
                });
            }
        }


        const existingUsername = await User.findOne({ username, _id: { $ne: userId } });
        if (existingUsername) {
            return res.render('profile/profile-edit', {
                title: 'Profile Edit',
                error: 'Username already exists. Please choose another one.',
                user: await User.findById(userId)
            });
        }

        const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
        if (existingEmail) {
            return res.render('profile/profile-edit', {
                title: 'Profile Edit',
                error: 'Email already registered. Please use another email.',
                user: await User.findById(userId)
            });
        }

        const updateData = {
            firstName,
            lastName,
            username,
            email,
            address: {
                street: address_street || '',
                city: address_city || '',
                postalCode: address_postalCode || ''
            }
        }

        if (req.file) {
            updateData.profileImage = '/uploads/' + req.file.filename;

            const oldUser = await User.findById(userId);
            if (oldUser.profileImage && oldUser.profileImage !== '/images/default-avatar.jpg') {
                const oldImagePath = path.join(__dirname, '..', 'public', oldUser.profileImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        } else if (req.body.removeImage === 'true') {
            const oldUser = await User.findById(userId);

            if (oldUser.profileImage && oldUser.profileImage !== '/images/default-avatar.jpg') {
                const oldImagePath = path.join(__dirname, '..', 'public', oldUser.profileImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            updateData.profileImage = '/images/default-avatar.jpg';
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).send('User not found.');
        }

        res.redirect('/profile');
    } catch (error) {
        console.error('Error updating profile: ', error);
        try {
            const userData = await User.findById(req.user.id);
            return res.render('profile/profile-edit', {
                title: 'Profile Edit',
                error: 'Error updating profile: ' + error.message,
                user: userData
            });
        } catch (secError) {
            return res.status(500).send('Error updating profile: ' + error.message);
        }
    }
}

profileController.showChangePassword = async function (req, res) {
    try {
        const userData = await User.findById(req.user.id);
        res.render('profile/change-password', { title: 'Change Password', user: userData });
    } catch (error) {
        res.status(500).send('Error loading password change page');
    }
}

profileController.updatePassword = async function (req, res) {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.render('profile/change-password', {
                title: 'Change Password',
                error: 'Incorrect current password.',
                user: user
            });
        }

        if (newPassword !== confirmPassword) {
            return res.render('profile/change-password', {
                title: 'Change Password',
                error: 'New passwords do not match.',
                user: user
            });
        }

        if (newPassword.length < 5) {
            return res.render('profile/change-password', {
                title: 'Change Password',
                error: 'Password must be at least 5 characters long.',
                user: user
            });
        }

        user.password = newPassword;
        await user.save();

        res.render('profile/profile', {
            title: 'Change Password',
            success: 'Password changed successfully!',
            user: user
        });
    } catch (error) {
        console.error('Error changing password:', error);
    }
}

module.exports = profileController
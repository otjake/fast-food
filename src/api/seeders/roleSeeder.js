const mongoose = require('mongoose')
const Role = require('../models/Role');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI).then(() => console.log("connected to Db")).catch((err) => console.log(err));

const roles = [
    {
        name: 'Admin',
        description: 'Administrator role',
        permissions: ['create', 'read', 'update', 'delete']
    },
    {
        name: 'Customer',
        description: 'Customer role',
        permissions: ['read']
    },
    // Add more roles as needed
];

async function seedRoles() {
    try {
        const existingRolesCount = await Role.countDocuments();

        if (existingRolesCount > 0) {
            console.log(`Found ${existingRolesCount} existing roles. Deleting...`);
            await Role.deleteMany();
            console.log('Existing roles deleted successfully.');
        } else {
            console.log('No existing roles found. Skipping deletion.');
        }
        for (const roleData of roles) {
            const role = new Role(roleData);
            await role.save();
            console.log(`Role '${role.name}' seeded successfully`);
        }

        console.log('Roles seeding completed');
        process.exit();

    } catch (error) {
        console.error('Error seeding roles', error);
    }
}

seedRoles().then(()=>{
    mongoose.connection.close()
});

const app = require('./app');
require('dotenv').config();

const mongoose = require('./config/db');

const PORT = process.env.PORT || 3000;
mongoose.connect()
    .then(() => {
        console.log('Connected to Database');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
        process.exit(1); // Exit process if unable to connect
    });


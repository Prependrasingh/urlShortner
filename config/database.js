const mongoose = require("mongoose");

const dbconnect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);

        console.log("DB connected successfully");
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = dbconnect;
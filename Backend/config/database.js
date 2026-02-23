const mongoose= require("mongoose");
require("dotenv").config();

exports.connect = ()=>{
    // ✅ DEPLOYMENT FIX: Connection retry logic with timeout
    const options = {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    };

    mongoose.connect(process.env.MONGODB_URL, options)
    .then(()=> {
        console.log("✅ Database connection established successfully");
        console.log(`💾 Connected to: ${mongoose.connection.name}`);
    })
    .catch((error)=>{
        console.error("❌ Database connection failed:", error.message);
        console.error("🔄 Retrying connection in 5 seconds...");
        
        // ✅ DEPLOYMENT FIX: Retry connection once after 5 seconds
        setTimeout(() => {
            mongoose.connect(process.env.MONGODB_URL, options)
            .then(() => console.log("✅ Database reconnected successfully"))
            .catch((retryError) => {
                console.error("❌ Database retry failed:", retryError.message);
                process.exit(1);
            });
        }, 5000);
    });

    // ✅ DEPLOYMENT FIX: Handle connection events
    mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err.message);
    });
}

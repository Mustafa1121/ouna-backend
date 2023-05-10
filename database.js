const mongoose = require('mongoose')

exports.connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('mongoDB connected')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
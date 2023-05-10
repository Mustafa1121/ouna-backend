const mongoose = require('mongoose')

exports.connectDB = async () => {
    try {
        console.log(process.env.MONGO_URL)
        await mongoose.connect(process.env.MONGO_URL)
        console.log('mongoDB connected')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
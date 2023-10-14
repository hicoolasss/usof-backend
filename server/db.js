import mongoose from 'mongoose';

const uri = "mongodb+srv://criops:1111@atlascluster.9ztpgyb.mongodb.net/usof?retryWrites=true&w=majority";

async function connectToDatabase() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("You successfully connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectToDatabase();

export default connectToDatabase;

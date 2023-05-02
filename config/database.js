const mongoose=require('mongoose');
const PORT = process.env.PORT || 4000

const connection = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://usmanshop:Usman12345@easyshopping.x8xdn9x.mongodb.net/UsmanShop?retryWrites=true&w=majority');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports=connection;

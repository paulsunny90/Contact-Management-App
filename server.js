import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import routes from "./routes/contact.routes.js"
dotenv.config()


const app = express()
app.use(express.json())
app.use("/api/contact",routes)



app.use(express.static("public"))
const PORT =process.env.PORT||3000;
connectDB().then(() => {


app.listen(PORT, () =>{
    console.log(`http://localhost:${PORT}/`)
});
});

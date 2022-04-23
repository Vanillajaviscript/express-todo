/////////////////////
//Importing our dependencies
/////////////////////
require("dotenv").config(); // get our .env variables
const express = require("express"); //web framework
const mongoose = require("mongoose"); //object document manager (work with DB)
const methodOverride = require("method-override");// override request methods, post to put, or delete;
const morgan = require("morgan"); //used for logging info when a request is made
////////////////////////////////////////////////////////////////////////////////////////////
//Setup Database Connection
////////////////////////////////////////////////////////////////////////////////////////////
const DATABASE_URL = process.env.DATABASE_URL; //Loading DB URL
//Establish connection
mongoose.connect(DATABASE_URL);
//Save the connection object
const cxn = mongoose.connection;
//Mongoose messages for status
cxn.on("open", () => console.log("MongoDB is open"))
cxn.on("close", () => console.log("MongoDB is closed"))
cxn.on("error", (err) => console.log(err));
////////////////////////////////////////////////////////////////////////////////////////////
//Schemas and Models
////////////////////////////////////////////////////////////////////////////////////////////
//Schema the definition of our data type
//Model, the object for working with our data type
const todoSchema = new mongoose.Schema({
    text: String,
    completed: Boolean
}, {timestamps: true});

const Todo = mongoose.model("Todo", todoSchema);

////////////////////////////////////////////////////////////////////////////////////////////
//Create express Application
////////////////////////////////////////////////////////////////////////////////////////////
const app = express();
////////////////////////////////////////////////////////////////////////////////////////////
//Middleware - app.use(middleware function)
////////////////////////////////////////////////////////////////////////////////////////////
app.use(methodOverride("_method"));//Allows to override request methods for form submissions
app.use(morgan("dev")); //Log every request
app.use(express.urlencoded({extended: true}));//Parses html form bodies into req.body
app.use("/public", express.static("public"));//Serve files statically
////////////////////////////////////////////////////////////////////////////////////////////
//Routes 
////////////////////////////////////////////////////////////////////////////////////////////
app.get("/", async (req, res) => {
    //go get todos
    const todos = await Todo.find({}).catch((err) => res.send(err));

    //render index.ejs
    res.render("index.ejs", {todos});
});
app.get("/todos/seed", async (req, res) => {
    // delete all existing todos
    await Todo.remove({}).catch((err) => res.send(err))
    // add your sample todos
    const todos = await Todo.create([
        {text: "eat breakfast", completed: false},
        {text: "eat lunch", completed: false},
        {text: "eat dinner", completed: false}
    ]).catch((err) => res.send(err))
    // send the todos as json
    res.json(todos)
})
////////////////////////////////////////////////////////////////////////////////////////////
//Listener
////////////////////////////////////////////////////////////////////////////////////////////
const PORT = process.env.PORT;
app.listen(PORT, () => {console.log(`Server is live on port: ${PORT}`)});
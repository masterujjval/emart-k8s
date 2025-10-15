const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const colors = require("colors");

const mongooseURI = require("./config/keys").mongoURI;

const userRoutes = require("./routes/user");
const shopRoutes = require("./routes/shop");


const app = express();


// here iam adding this for metrics
const client = require('prom-client');
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests received',
});
register.registerMetric(httpRequestCounter);


// till here 

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(express.static(process.cwd()+"/client/dist/client/"));


app.get('/', (req,res) => {
  res.sendFile(process.cwd()+"/client/dist/client/index.html")
})

app.use("/api/user", userRoutes);
app.use("/api/shop", shopRoutes);

// here we go again
app.use((req, res, next) => {
  httpRequestCounter.inc();
  next();
});

// here we stop 


// here we go again
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
// here we stop 

mongoose
  .connect(mongooseURI)
  .then(() => {
  
    console.log("\nConnected to".magenta, "E-MART".cyan, "database".magenta);
  })
  .catch(err => console.log("Error connecting to database".cyan, err));


// here we go again

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// here we stop again

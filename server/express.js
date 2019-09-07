var path = require('path')
var express = require('express'); 
var app = express();

// Static Files
app.use(express.static(path.join(__dirname, '../', 'alurabank/app')));

// Cross Origin
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
  next();
});

// Logging on console for each request
app.use((req, resp, next) => {
  const now = new Date();
  const time = `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`;
  const path = `"${req.method} ${req.path}"`;
  const m = `${req.ip} - ${time} - ${path}`;
  console.log(m);
  next();
});


// Start the server
app.listen('8000', () => {
  // eslint-disable-next-line no-console
  console.log('Local DevServer Started on port 8000...');
});


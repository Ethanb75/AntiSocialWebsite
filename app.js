const express = require('express');
const path = require('path');
const compression = require('compression');
const app = express();
const PORT = process.env.PORT || 3000;


// app.use(h5bp({ 
//   root: __dirname + '/public'
// }));

if (process.env.PORT) {
  app.get('*', function(req, res, next) {
    if(req.headers['x-forwarded-proto'] != 'https')
      res.redirect('https://www.antisocial.to' + req.url);
      // req.headers['']
    else
      next(); /* Continue to other routes if we're not redirecting */
  });
};



// serve
app.use(express.static(path.join(__dirname, 'public')));

// compress all responses
app.use(compression())

app.listen(PORT, () => {
  console.log('listening on port 3000')
})
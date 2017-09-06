const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

if (process.env.PORT) {
  app.get('*', function(req, res, next) {
    if(req.headers['x-forwarded-proto'] != 'https')
      res.redirect('https://www.antisocial.com' + req.url);
    else
      next(); /* Continue to other routes if we're not redirecting */
  });
};

app.listen(PORT, () => {
  console.log('listening on port 3000')
})
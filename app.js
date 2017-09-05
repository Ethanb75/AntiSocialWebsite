const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function(req,res,next) {
  if (PORT !== 3000) {
    if(req.headers['x-forwarded-proto']!='https')
      res.redirect('https://antisocial.to'+req.url);
    else
      next();
  }
});

app.listen(PORT, () => {
  console.log('listening on port 3000')
})
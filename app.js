const express = require('express');
const path = require('path');
const expressStaticGzip = require("express-static-gzip");
const fs = require('fs');
const url = require('url')
const app = express();
const PORT = process.env.PORT || 3000;

let files = {};


fs.readdir('src', (err, data) => {
  data.forEach(name => {
    return name.includes('.') ? files[`${name}`] = fs.readFileSync(path.join(__dirname, 'src', `${name}`), {encoding: 'utf8'}).split('\n').filter(line => line.match(/src *?= *?"(.*)"/) != null) : null;
  })
  console.log(files);
})


// fs.readdir('public', (error, data) => {
//   // console.log(data);
//   // error means it's trying to read a file in a dir but it's a dir
//   data.forEach(name => {
//     // console.log(name);
//     if (name.includes('.')) {
      // files[`${name}`] = fs
      // .readFileSync(path.join(__dirname, 'public', `${name}`), {encoding: 'utf8'})
      // .split('\n')
      // .filter(line => line.match(/src *?= *?"(.*)"/) != null)
      // .map(line => line.match(/src *?= *?"(.*)"/)[1]);
//     } else {
//       return;
//     }
      
//   });
//   console.log(files);
// });

// app.use((request, response, next)=>{
//   let urlName = url.parse(request.url).pathname.substr(1)
//   if (urlName === '' || urlName === '/') urlName = 'index.html'
//   console.log('Request for: ', urlName);
//   if (files[urlName]) {
//     let assets = files[urlName]
//       .filter(name=>(name.substr(0,4)!='http'))
//       .map((fileToPush)=>{
//         let fileToPushPath = path.join(__dirname, 'public', fileToPush)
//         return (cb)=>{
//           if (fileToPushPath.length>100) return cb()
//           fs.readFile(fileToPushPath, (error, data)=>{
//             if (error) return cb(error)
//             console.log('Will push: ', fileToPush, fileToPushPath)
//             try {
//               response.push(`/${fileToPush}`, {}).end(data)
//               cb()
//             } catch(e) {
//               cb(e)
//             }

//           })
//         }
//       })
//     // Uncomment to disable server push
//     // assets = []
//     console.log('Total number of assets to push: ', assets.length)
//     assets.unshift((cb)=>{
//       fs.readFile(path.join(__dirname, 'public', urlName), (error, data)=>{
//         if (error) return cb(error)
//         response.write(data);
//         // console.log(data)
//         cb();
//       });
//     });

//     require('neo-async').parallel(assets, (results)=>{
//       response.end();
//     });
//   } else {
//     return next();
//   };
// });


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
 
app.use("/", expressStaticGzip("./public"));

app.listen(PORT, () => {
  console.log('listening on port 3000')
})
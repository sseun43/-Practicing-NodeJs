const https=require("https");
const fs=require("fs");
const express=require("express")
const app=express();

app.set("port", process.env.PORT || 8180);


const body=JSON.stringify({"password":"ratkaisutalkootapahtuma"})

console.log("fetching")

var store;

const options = {
  hostname: 'fortum.hackjunction.com',
  path: '/api/locations/2',
  method: 'POST',
  
  headers: {
    'Content-Type': 'application/json',
    /*'Content-Length': Buffer.byteLength(postData)*/
  }
};

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
  	store+=chunk
    /*console.log(`${chunk}`);*/
  });
  res.on('end', () => {
  	store=store.split("\r\n").map(v=>v.split(" "))
    store=store.filter(v=>v[1]==="20:00:00")
    console.log(store);
    store.shift()

    app.get("/",function(req,res){
      res.json(store)
    })

    app.listen(app.get("port"), function() {
      console.log("App is listening on port 8180");
    });

      fs.writeFile("electricity.txt",store,function (err) {
  if (err) throw err;
  console.log('Saved!')
    })
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// write data to request body
req.write(body);
req.end()
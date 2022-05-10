var http = require('http'); 

function RandomFair (max){
    let x = 0.1+((Math.floor(10*(Math.random())))/10);
    if (x > max / 10){
        return RandomFair(max);
    }
    return Math.floor(10*x);
}

var server = http.createServer(function (req, res) {   
    if (req.url == '/rolldice') { //check the URL of the current request
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({ Die1: RandomFair(6), Die2: RandomFair(6)}));  
            res.end();  
    }
});

server.listen(7000);
console.log(server)
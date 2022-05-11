var http = require('http'); 
const url = require('url');

function RandomFair (max){
    let x = 0.1+((Math.floor(10*(Math.random())))/10);
    if (x > max / 10){
        return RandomFair(max);
    }
    return Math.floor(10*x);
}


var MonopolyGame = {
    Dice: [RandomFair(6),RandomFair(6)],
    BoardBalance: 0,
    P1:[{Credit: 0, Debit: 0, Balance:5000000}],
    P2:[{Credit: 0, Debit: 0, Balance:5000000}]
}

function CreditOrDebit(playerNum, amount){
    var newBalance = playerNum[playerNum.length - 1].Balance + amount;
    var newLedgerEntry = {Credit: 0, Debit: 0, Balance:0};
    newLedgerEntry.Balance = newBalance;
    if (amount < 0) {
        newLedgerEntry.Debit = amount * -1;
    } else {
        newLedgerEntry.Credit = amount;
    }
    playerNum.push(newLedgerEntry);
}

var server = http.createServer(function (req, res) {   
    res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	res.setHeader('Access-Control-Allow-Headers', '*');
    //console.log(req);
    const queryObject = url.parse(req.url, true).query;
    //console.log(queryObject);

    if (req.url == '/rolldice') { //check the URL of the current request
            res.writeHead(200, {'Content-Type': 'application/json'});
            MonopolyGame.Dice[0] = RandomFair(6);
            MonopolyGame.Dice[1] = RandomFair(6);
            res.end();  
    }
    if (req.url == '/data') { //check the URL of the current request
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(MonopolyGame));  
        res.end();  
    }
    if (req.url.startsWith('/creditordebit')) { //check the URL of the current request
        //192.168.1.2:7000/?player=1&debit=300000&action=boardcredit
        //192.168.1.2:7000/?player=2&credit=40000
        console.log("creditordebit");
        res.writeHead(200, {'Content-Type': 'application/json'});
        var player = MonopolyGame.P1;
        if(queryObject.player === "2"){
            console.log("For Player 2");
            player = MonopolyGame.P2;
        }
        if(queryObject.action === "boardcredit"){
            console.log("Crediting from board");
            CreditOrDebit(player, MonopolyGame.BoardBalance);
            MonopolyGame.BoardBalance = 0;
        }
        else if(queryObject.action === "boarddebit"){
            console.log("Crediting to board");
            if(!isNaN(parseInt(queryObject.amount))){
                CreditOrDebit(player, -1 * parseInt(queryObject.amount));
            }
            MonopolyGame.BoardBalance += parseInt(queryObject.amount);
            
        }
        else if(!isNaN(parseInt(queryObject.credit))){
            console.log("Crediting to player");
            CreditOrDebit(player, parseInt(queryObject.credit));
        }
        else if(!isNaN(parseInt(queryObject.debit))){
            console.log("Debiting from player");
            CreditOrDebit(player, -1 * parseInt(queryObject.debit));
        }

        res.end();  
    }
});

server.listen(7000);
var io = require('socket.io-client');
socket = io.connect("https://coinchat.org", {secure: true}, {reconnect:false});

var username = "dbzbot";
var outputBuffer = [];
var owner = "hjdask";
var minTip = 0.25;
var balance = 5;
var challenger1="NULL";
var challenger2="NULL";
var play=0;
var c1_choice="NULL";
var c2_choice="NULL";
var user=[];
var user1;
var user2;








socket.on('connect', function(){
		//Your session key (aka API key)
		//Get this from your browser's cookies.
    socket.emit('login', {session: ""});
    socket.on('loggedin', function(data){

	socket.on("balance", function(data){
						if (data.change){
            					balance = balance + data.change;
   				        }
   	     				else{
            					balance = data.balance;
      				        }
        					console.log('Current Balance: ' + balance + 'mBTC', 10);
					});
	
	
	 
    	setTimeout(function()
    	{		socket.emit("getcolors", {});
    			
    			socket.on('chat', function(data)
			{
					
				
					


					if(contains(data.message, ["!balance"]) && data.room=="oldgame" && (data.user== "gaara" || data.user=="hjdask") )
						outputBuffer.push({room: data.room, message: "Balance: "+balance});

					if(contains(data.message, ["!test"]) && data.user!="dbzbot")
						outputBuffer.push({room: data.room, message: " "+data.user+", I am online."});

					if(contains(data.message, ["!shutdown"]) && data.room=="oldgame" && data.user== "gaara" )
						process.exit(0);
	
					if(contains(data.message, ["!help"]) && data.room=="oldgame" && data.user!= "dbzbot" )
					{
						outputBuffer.push({room: data.room, message: " "+data.user+" Welcome to my room. I am DBZbot. I host a a very popular game, 'ROCK PAPER SCISSORS'. \\ Tip the bot 0.3. And pm the bot your choice. To do so, type '/pm dbzbot rock' or '/pm dbzbot scissors' or '/pm dbzbot paper'. \\ When your opponent tips the bot, you will be tagged to know the result. If you win, you will get 0.55."});
						console.log("REACHED");
					}
					
					if(contains(data.message, ["!register"]))
					{	
						user=data.user.toLowerCase();
						if(user[0]>"d")
							socket.emit('joinroom', {join: "dbzbot:"+user});		
						else
							socket.emit('joinroom', {join: user+":dbzbot"});
					}

										

					if(contains(data.message, ["HI!"]) && (data.room == data.user.toLowerCase()+":dbzbot") || (contains(data.message, ["HI!"]) && data.room== "dbzbot:"+data.user.toLowerCase()))
					{
						user=data.user.toLowerCase();
						if(user[0]>"d")
							outputBuffer.push({room:"dbzbot:"+user, message: "HI! I am dbzbot. Pleasure to meet you."}); 
						else
							outputBuffer.push({room:user+":dbzbot", message: "HI! I am dbzbot. Pleasure to meet you."});
					}

	
						

							

					if(contains(data.message, ["!owner"]) && data.room=="oldgame" && data.user!= "dbzbot" )
						outputBuffer.push({room: data.room, message: " "+data.user+", I am owned by hjdask."});
	
					
					if(contains(data.message, ["<span class='label label-success'>has tipped " + username]) && data.room=="oldgame")
					{
						socket.emit("getbalance", {});
						

						
					
						var secondary=data.message.split(" dbzbot ")[1].split(" ")[0];
						var amount=parseFloat(secondary);
						var res= amount*2-(0.1*amount);
						var ret = amount-(amount*0.02);
						

						if(play==0)
						{	
						if(amount!=0.3)
						{	
							tip("oldgame", data.user, ret , "Exceeding maximum bet");
							socket.emit("getbalance", {});
						}	
						else
						
						{		
							if(challenger1=="NULL")
							{
							
								challenger1=data.user;
								user1=data.user.toLowerCase();
								
								if(user1[0]>"d")
									socket.emit('joinroom', {join: "dbzbot:"+user1});		
								else
									socket.emit('joinroom', {join: user1+":dbzbot"});

								outputBuffer.push({room: data.room, message: "Contender 1 :  " +data.user+ " is ready. Waiting for contender 2 to tip!" });
								
								console.log("Challenger1 is ready.");
								
							}
						
								
							else if(challenger1!="NULL" && challenger2=="NULL")
							{  	
								challenger2=data.user;
								user2=data.user.toLowerCase();
								if(challenger1==challenger2)
								{
									outputBuffer.push({room: data.room, message: "You have already tipped, " +data.user+ ". Waiting for your contender to tip."});
									
									tip(data.room, challenger1, 0.28, " ");
									socket.emit("getbalance", {});
								
									challenger2="NULL"; user2="NULL";
								}
								else if(challenger1!=challenger2)
								{
									play=1;
									if(user2[0]>"d")
										socket.emit('joinroom', {join: "dbzbot:"+user2});		
									else
										socket.emit('joinroom', {join: user2+":dbzbot"});
									outputBuffer.push({room: data.room, message: " "+challenger1+" and "+challenger2+". Please make sure you have sent a pm to the bot with your choice."});
									console.log("Challenger1 is ready.");
							
									
								}
	
										
							}				
						}}
						else
							tip("oldgame", data.user, ret, "Game in progress");
					}
					
					
					if(contains(data.message,["rock"]) && data.user==challenger1 && (data.room == "dbzbot:"+user1 || data.room == user1+":dbzbot") )
					{
						
						c1_choice="rock";
						console.log(challenger1+": ROCK");
						outputBuffer.push({room: data.room, message: "Thank you for messaging. Please go to #oldgame."});
						
					}
					if(contains(data.message,["paper"]) && data.user==challenger1 && (data.room == "dbzbot:"+user1 || data.room == user1+":dbzbot") )
					{
						
						c1_choice="paper"; 
						console.log("Challenger1: PAPER");
						outputBuffer.push({room: data.room, message: "Thank you for messaging. Please go to #oldgame."});
						
					}
					if(contains(data.message,["scissors"]) && data.user==challenger1 && (data.room == "dbzbot:"+user1 || data.room == user1+":dbzbot") )
					{
						
						c1_choice="scissors"; 
						console.log("Challenger1: scissors");
						outputBuffer.push({room: data.room, message: "Thank you for messaging. Please go to #oldgame."});
						
					}
					if(contains(data.message,["rock"]) && data.user==challenger2 &&(data.room == "dbzbot:"+user2 || data.room == user2+":dbzbot") )
					{
						
						c2_choice="rock"; 
						console.log("Challenger2: ROCK");
						outputBuffer.push({room: data.room, message: "Thank you for messaging. Please go to #oldgame."});
						
					}
					if(contains(data.message,["paper"]) && data.user==challenger2 &&(data.room == "dbzbot:"+user2 || data.room == user2+":dbzbot") )
					{
						
						c2_choice="paper"; 
						console.log("Challenger2: PAPER");
						outputBuffer.push({room: data.room, message: "Thank you for messaging. Please go to #oldgame."});
						
					}
					if(contains(data.message,["scissors"]) && data.user==challenger2 &&(data.room == "dbzbot:"+user2 || data.room == user2+":dbzbot"))
					{
						
						c2_choice="scissors"; 
						console.log("Challenger2: scissors");
						outputBuffer.push({room: data.room, message: "Thank you for messaging. Please go to #oldgame."});
						
					}
					
					if(c1_choice!="NULL" && c2_choice!="NULL")
					{
						if(c1_choice==c2_choice)
						{
							outputBuffer.push({room:"oldgame", message: " "+challenger1+" : "+c1_choice+" \\ "+challenger2+" : "+c2_choice+" \\ Both have chosen the same. Please pm me with your choices again."});
							c1_choice="NULL";
							c2_choice="NULL";
						}
						else if(c1_choice=="rock" && c2_choice=="paper")
						{
							outputBuffer.push({room: "oldgame", message: " "+challenger1+" : "+c1_choice+" \\ "+challenger2+" : "+c2_choice+" \\ Paper beats Rock. "+challenger2+" wins. "});
							tip("oldgame", challenger2, 0.55, " Congrats! ");
							
							challenger1="NULL";
							challenger2="NULL";
							c1_choice="NULL";
							c2_choice="NULL";
							user1="NULL";
							user2="NULL";
							play=0;
						} 
						else if(c1_choice=="paper" && c2_choice=="rock")
						{
							outputBuffer.push({room: "oldgame", message: " "+challenger1+" : "+c1_choice+" \\ "+challenger2+" : "+c2_choice+" \\ Paper beats Rock. "+challenger1+" wins. "});
							tip("oldgame", challenger1, 0.55, " Congrats! ");	
							challenger1="NULL";
							challenger2="NULL";
							c1_choice="NULL";
							c2_choice="NULL";
							user1="NULL";
							user2="NULL";
							play=0;
						} 
						else if(c1_choice=="rock" && c2_choice=="scissors")
						{
							outputBuffer.push({room: "oldgame", message: " "+challenger1+" : "+c1_choice+" \\ "+challenger2+" : "+c2_choice+" \\ Rock beats Scissors. "+challenger1+" wins. "});
							tip("oldgame", challenger1, 0.55, " Congrats! ");
							challenger1="NULL";	
							challenger2="NULL";
							c1_choice="NULL";
							c2_choice="NULL";
							user1="NULL";
							user2="NULL";
							play=0;
						} 
						else if(c1_choice=="scissors" && c2_choice=="rock")
						{
							outputBuffer.push({room: "oldgame", message: " "+challenger1+" : "+c1_choice+" \\ "+challenger2+" : "+c2_choice+" \\ Rock beats Scissors. "+challenger2+" wins. "});
							tip("oldgame", challenger2, 0.55, " Congrats! ");	
							challenger1="NULL";
							challenger2="NULL";
							c1_choice="NULL";
							c2_choice="NULL";
							user1="NULL";
							user2="NULL";
							play=0;
						} 
						else if(c1_choice=="paper" && c2_choice=="scissors")
						{
							outputBuffer.push({room: "oldgame", message: " "+challenger1+" : "+c1_choice+" \\ "+challenger2+" : "+c2_choice+" \\ Scissors beat Paper. "+challenger2+" wins. "});
							tip("oldgame", challenger2, 0.55, " Congrats! ");	
							challenger1="NULL";	
							challenger2="NULL";
							c1_choice="NULL";
							c2_choice="NULL";
							user1="NULL";
							user2="NULL";
							play=0;
						} 
						else if(c1_choice=="scissors" && c2_choice=="paper")
						{
							outputBuffer.push({room: "oldgame", message: " "+challenger1+" : "+c1_choice+" \\ "+challenger2+" : "+c2_choice+" \\ Scissors beat Paper. "+challenger1+" wins. "});
							tip("oldgame", challenger1, 0.55, " Congrats! ");	
							challenger1="NULL";	
							challenger2="NULL";
							c1_choice="NULL";
							c2_choice="NULL";
							user1="NULL";
							user2="NULL";
							play=0;
						} 
					}





			}
			
		);	
    		}, 600);
    	setInterval(function(){
        //CoinChat has a 550ms anti spam prevention. You can't send a chat message more than once every 550ms.
        if(outputBuffer.length > 0){
                if(outputBuffer[0].tipObj){
                        socket.emit("tip", outputBuffer.splice(0,1)[0].tipObj);
                }
                else{
                        var chat = outputBuffer.splice(0,1)[0];
                        socket.emit("chat", {room: chat.room, message: chat.message, color: "000"});
                }
        }
}, 600);
    });
    socket.on('disconnect', function(){});
});

console.log("WORKING");

function contains(string, terms){
	for(var i=0; i<terms.length; i++){
		if(string.toLowerCase().indexOf(terms[i].toLowerCase()) == -1){
			return false;
		}
	}
	return true;
}




function tip(roomName, userName, amount, note){
	if(amount <= balance && amount >= minTip){ 
		outputBuffer.push({tipObj: {user: userName, room: roomName, tip: amount, message: note}});
	}
	else{
		outputBuffer.push({room: roomName, message: "Sorry " + userName + " I don't seem to have enough to tip you back. " + owner + " owes you: " + amount + "mBTC for: " + note, color: "000"});
	}
}
socket.on("disconnect" , function(){process.exit();
})
;

var express= require('express');
var bodyParser=require('body-parser');
var request=require('request');

const APP_TOKEN='EAAEO5UiOUXABADYI1EZAjOyjbI4o7LAwaWmMgFozKiLtIh2FQUH849m74AFGNlzSsKZCKasfRZBxJhoCjgGfKn2LTTTRzQPPVBwZBUFZAwb1MlOnK3CGcVQ243p7FTJBZC5IBLBkzxOYqZBxHQlKoburUvhvQnz6nUQodaeh38KtkuZCsMdua6SX';

var app=express();

app.use(bodyParser.json());

app.listen(3000,function() {
    console.log("Servidor  en 3000");    
});


app.get('/',function(req,res){
    res.send("Welcome to chatbot ")
});
//valida servidor
app.get('/webhook',function(req,res){
    if(req.query['hub.verify_token']=='tok'){
        res.send(req.query['hub.challenge']);
    }else{
        res.send('No tienes permitido el acceso');
    }
});

//valida eventos
app.post('/webhook',function(req,res){
    var data=req.body;
    
    if(data.object=='page'){
        data.entry.forEach(function(pageEntry){
            pageEntry.messaging.forEach(function(messagingEvent){
                if(messagingEvent.message){
                reciveMessage(messagingEvent);
                }
            });
        });
        res.sendStatus(200);
    }//end if
});

//recive mensaje
function reciveMessage(event){
    var senderID=event.sender.id;
    var messageText=event.message.text;
    console.log(senderID);
    console.log(messageText);
    evaluateMessage(senderID,messageText);
}

function evaluateMessage(recipientId,message) {
    var finalMessage='';
    if(isContain(message,'ayuda')){
        finalMessage='¿En qué puedo ayudarte?';
    }else{
        finalMessage='ste man';        
    }
    sendMessageText(recipientId,finalMessage);
}

function sendMessageText(recipientId,message){
    var messageData={
        recipient:{
            id:recipientId
        },
        message:{
            text:message
        }
    };
    callSendApi(messageData);
}
function callSendApi(messageData){
    request({
        uri:'https://graph.facebook.com/v2.6/me/messages',
        qs:{access_token:APP_TOKEN},
        method:'POST',
        json:messageData
    },function(error,response,data){
        if(error){
            console.log('Error enviando msg');
        }else{
            console.log('Mensaje exitoso');
        }
    });
}

function isContain(sentence,wordToFind){
    return sentence.indexOf(wordToFind)>-1;
}
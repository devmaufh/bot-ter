var express= require('express');
var bodyParser=require('body-parser');
var request=require('request');
var watson = require('watson-developer-cloud');
var assistant = new watson.AssistantV1({
    username: '7edf3dcc-bc80-459d-bc8c-f6aee7092a0a',
    password: 'WR2bXia2KCvd',
    version: '2018-07-10'
});
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
        console.log('Acceso permitido-console text');
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
function reciveMessage(event) {
    var senderID=event.sender.id;
    var messageText=event.message.text;
    console.log("reciveMessage   "+senderID);
    console.log("reciveMessage   "+messageText);
    sendTextToWatson(senderID,messageText);
}


function sendTextToWatson(senderId,inputText) {
    var finalMessage='';
    assistant.message({
        workspace_id: '78e65f34-cd53-4391-aa9e-e8cc5afa3a6e',
        input: { 'text': inputText }
    }, function (err, response) {
        if (err){
            finalMessage=err;
            //console.log('error:', err);
        }
        else{
            finalMessage=response.output.text[0];
            //console.log(JSON.stringify(response, null, 2));
            console.log("sendTextToWatson        "+finalMessage);
        }
        sendMessageText(senderId,finalMessage+"");

    });
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
var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    //session.send("You said: %s", session.message.text);
    
        var welcomeCard = new builder.HeroCard(session)
        .title("Welcome. How may I help you today?")
        .images([
            builder.CardImage.create(session, 'https://cdn.fptshop.com.vn/Uploads/Thumbs/2014/6/17/201406171458409498_WalmartApp.png')
        ])
        .text('I can give you information regarding any job abend and recommend some action based on past record')
        .buttons([
        builder.CardAction.postBack(session, "Get Started", "Get Started")]);
        var msg = new builder.Message(session).addAttachment(welcomeCard);
        builder.Prompts.choice(session, msg, ["Get Started"]);
    //session.send('You reached the Greeting intent. You said \'%s\'.', session.message.text);
});

var recognizer = new builder.LuisRecognizer("https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/9038247e-dff4-4977-ad87-3166cc03fc1c?subscription-key=c097bb8304244b2dbcce31d13912feff&verbose=true&timezoneOffset=0&q=");
bot.recognizer(recognizer);


bot.dialog('GreetingDialog', [
    function (session) {
        var welcomeCard = new builder.HeroCard(session)
        .title("Welcome. How may I help you today?")
        .images([
            builder.CardImage.create(session, 'https://cdn.fptshop.com.vn/Uploads/Thumbs/2014/6/17/201406171458409498_WalmartApp.png')
        ])
        .text('I can give you information regarding any job abend and recommend some action based on past record')
        .buttons([
        builder.CardAction.postBack(session, "Get Started", "Get Started")]);
        var msg = new builder.Message(session).addAttachment(welcomeCard);
        builder.Prompts.choice(session, msg, ["Get Started"]);
    //session.send('You reached the Greeting intent. You said \'%s\'.', session.message.text);
},
    function (session, results) {

        switch (results.response.entity) {
            case "Get Started":
                session.beginDialog('chatMenu');
                break;
        }
    }

]).triggerAction({
    matches: 'Greetings'
});




bot.dialog('chatMenu',[
    function(session){
        var welcomeCard = new builder.HeroCard(session)
        .subtitle('Which flow you want me to take you through?')
        .buttons([
            builder.CardAction.postBack(session, "Job abend", "Job abend"),
            builder.CardAction.postBack(session, "Long running","Long running"),
        ]);
        var msg = new builder.Message(session).addAttachment(welcomeCard);
        builder.Prompts.choice(session, msg, ["Job abend","Long running"]);
    },
    function (session, results) {
        switch (results.response.entity) {
            case "Job abend":
                session.beginDialog('JobAbend');
                break;
            case "Long runnings":
                session.beginDialog('ordertrack');
                break;
            default:
                session.endDialog();
                break;
        }
    },
]).triggerAction({
    matches: /^help$/i,
});


bot.dialog('chatMenu123',[
    function(session){
        var welcomeCard = new builder.HeroCard(session)
        .subtitle('Which flow you want me to take you through?')
        .buttons([
            builder.CardAction.postBack(session, "Job abend", "Job abend"),
            builder.CardAction.postBack(session, "Long running","Long running"),
        ]);
        var msg = new builder.Message(session).addAttachment(welcomeCard);
        builder.Prompts.choice(session, msg, ["Job abend","Long running"]);
    },
    function (session, results) {
        switch (results.response.entity) {
            case "Job abend":
                session.beginDialog('JobAbend');
                break;
            case "Long runnings":
                session.beginDialog('ordertrack');
                break;
            default:
                session.endDialog();
                break;
        }
    },
]).triggerAction({
    matches: /^Get Started$/i,
});
bot.dialog('JobAbend',[
    function(session,results){
        builder.Prompts.text(session, "What is the Job name?");
    },
    function (session,results) {
        var jobname = results.response;
        var msg = new builder.ReceiptCard(session)
        .title('John Doe')
        .facts([
            builder.Fact.create(session, 'Process abnormality', 'Job name'),
            builder.Fact.create(session, 'Work in progress', 'Status')
        ])
        .items([
            builder.ReceiptItem.create(session, '1-High', 'Criticality'),
            builder.ReceiptItem.create(session, 'Please Jabber June Corbino regarding job abend GLUS234U', 'Description'),
            builder.ReceiptItem.create(session, 'PS0', 'System')
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/pricing/', 'More Information')
                .image('https://raw.githubusercontent.com/amido/azure-vector-icons/master/renders/microsoft-azure.png')
        ]);
        console.log("_______"+jobname);
        var msg1 = new builder.Message(session).addAttachment(msg);
        session.send(msg1);
        var msg2 = new builder.Message(session)
        .text("do you want me to recommend an action on this job?")
        .suggestedActions(
        builder.SuggestedActions.create(
                session, [
                    builder.CardAction.imBack(session, "Yes", "Yes"),
                    builder.CardAction.imBack(session, "No", "No"),
                ]
            ));
    session.send(msg2);
    },
    
    function (session, results) {
        switch (results.response.entity) {
            case "Yes":
                session.beginDialog('Yes');
                break;
            case "No":
                session.beginDialog('No');
                break;
            default:
                session.endDialog();
                break;
        }
 },
]);

bot.dialog('Yes',[
    function(session){
        session.send("Please be patient while I analyze past data ");
        session.sendTyping();
        setTimeout(function () {
        var welcomeCard = new builder.HeroCard(session)
        .title("Please go ahead and restart the system")
        var msg = new builder.Message(session).addAttachment(welcomeCard);
        builder.Prompts.choice(session, msg, ["Job abend","Long running","Yes,sen`t mail","No1"]);
    },2000)
    session.sendTyping();
    setTimeout(function () {
    var msg2 = new builder.Message(session)
    .text("Do you want me to share the above suggestion via mail?")
    .suggestedActions(
    builder.SuggestedActions.create(
            session, [
                builder.CardAction.imBack(session, "Yes, send the email", "Yes"),
                builder.CardAction.imBack(session, "No, I don't need any mail", "No"),
            ]
        ));
       session.send(msg2);
},4000)
},
function (session, results) {
    switch (results.response.entity) {
        case "Yes,sen`t mail":
            session.beginDialog('Yes,sen`t mail');
            break;
        case "No1":
            session.beginDialog('No1');
            break;
        default:
            session.endDialog();
            break;
    }
},
]).triggerAction({
    matches: /^Yes$/i,
});

bot.dialog('No',[
   function(session){
    var msg2 = new builder.Message(session)
    .text("Do you want me to send an email on the job details?")
    .suggestedActions(
    builder.SuggestedActions.create(
            session, [
                builder.CardAction.imBack(session, "Yes, send the email", "Yes"),
                builder.CardAction.imBack(session, "No, I don`t need any mail", "No"),
            ]
        ));
session.send(msg2);
   }
]).triggerAction({
    matches: /^No$/i,
});



bot.dialog('Yes, send the email', [
    function (session) {
    
        builder.Prompts.text(session, "Please give me your mail id");
        /**/
    //session.send('You reached the Greeting intent. You said \'%s\'.', session.message.text);
},
function(session,results){
    var email = results.response;
    var welcomeCard = new builder.HeroCard(session)
    .images([
        builder.CardImage.create(session, 'https://cdn.dribbble.com/users/766394/screenshots/3351602/walmart-loader.gif')
    ])
    .title('Mail sent to :' +" " + email)
    .text("Looking forward to help again")
    .buttons([
    builder.CardAction.postBack(session, "Get Started", "Get Started")]);
    var msg = new builder.Message(session).addAttachment(welcomeCard);
    builder.Prompts.choice(session, msg, ["Get Started"]);
},
    function (session, results) {

        switch (results.response.entity) {
            case "Get Started":
                session.beginDialog('chatMenu');
                break;
        }
    }

]).triggerAction({
    matches: /^Yes, send the email$/i
});

bot.dialog('No, I don`t need any mail', [
    function (session) {
        var welcomeCard = new builder.HeroCard(session)
        .images([
            builder.CardImage.create(session, 'https://cdn.dribbble.com/users/766394/screenshots/3351602/walmart-loader.gif')
        ])
        .title('Thanks for contacting.')
        .buttons([
        builder.CardAction.postBack(session, "Run another report", "Run another report")]);
        var msg = new builder.Message(session).addAttachment(welcomeCard);
        builder.Prompts.choice(session, msg, ["Run another report"]);
    //session.send('You reached the Greeting intent. You said \'%s\'.', session.message.text);
},
    function (session, results) {

        switch (results.response.entity) {
            case "Run another report":
                session.beginDialog('chatMenu');
                break;
        }
    }

]).triggerAction({
    matches: /^No, I don`t need any mail$/i
});


bot.dialog('GreetingDialog1', [
    function (session) {
        const card = {
            contentType: 'application/vnd.microsoft.card.adaptive',
            content: {
              type: 'AdaptiveCard',
              body: [
                {
                    "type": "FactSet",
                    "facts": [
                        {
                            "title": "Job name:",
                            "value": "GLUS234U"
                        },
                        {
                            "title": "Status:",
                            "value": "Abended"
                        },
                        {
                            "title": "Criticality:",
                            "value": "Non-Critical"
                        },
                        {
                            "title": "Error:",
                            "value": "RFC Error"
                        },
                        {
                            "title": "System:",
                            "value": "PR4"
                        }
              ],
              /*actions: [
                {
                  type: 'Action.Submit',
                  title: 'Submit',
                },
              ]*/

            }
              ]},
    };    
          const msg = new builder.Message(session).addAttachment(card);
          session.send(msg);

          var msg2 = new builder.Message(session)
          .text("do you want me to recommend an action on this job?")
          .suggestedActions(
          builder.SuggestedActions.create(
                  session, [
                      builder.CardAction.imBack(session, "Yes", "Yes"),
                      builder.CardAction.imBack(session, "No", "No"),
                  ]
              ));
      session.send(msg2);
          
        },

    function (session, results) {

        switch (results.response.entity) {
            case "Get Started":
                session.beginDialog('chatMenu');
                break;
        }
    }

]).triggerAction({
    matches: 'Job abend name'
});


bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            //session.send("message.membersAdded"+message.membersAdded);
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/');
            }
        });
    }
});

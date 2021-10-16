const express = require('express');
const ngrok = require('./get_public_url');
const PORT = process.env.PORT || 3000;

const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const bot = new ViberBot({
    authToken: process.env.VIBER_BOT_TOKEN,
    name: process.env.VIBER_BOT_NAME,
    avatar: process.env.VIBER_BOT_AVATAR
});

const TextMessage = require('viber-bot').Message.Text;
const app = express();

app.use("/viber/webhook", bot.middleware());
app.post("/", (req, res) => {
    bot.on(BotEvents.MESSAGE_RECEIVED, async (message, response) => {
        try {
            await response.send(new TextMessage(`Hi there ${response.userProfile.name}. I am ${bot.name}`))
        } catch (err) {
            console.error(err);
        }
    });
    
    async function sendMessage(userProfile) {
        try {
            await setTimeout(() => {
                bot.sendMessage(userProfile, [
                    new TextMessage("Welcome to bot world")
                ]);
            }, 5000);        
        } catch(err) {
            console.error(err);
        }
    }
    res.send("Hello");
})

return ngrok.getPublicURL()
    .then(publicURL => {        
        console.log(`Set the new webhook to ${publicURL}`);        
        app.listen(PORT, async () => {
            try {                
                await bot.setWebhook(publicURL);
            } catch(err) {
                console.error(err);
            }
        });
    })
    .catch(error => {
        console.error("Cannot connect to ngrok server");
        console.error(error);
    })
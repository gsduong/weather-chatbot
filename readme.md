There are two major parts:

1. Setting up a Facebook Messenger App and writing the webhook
2. Using API.ai Small Talk domain and creating a custom Intents

Instructions:
You need a Facebook Page to set up your chat bot. Create one from facebook.com/pages/create. Choose a category, and select a sub category from the dropdown and fill out the required filed. Then click Get Started.
![Create Facebook Page](https://github.com/gsduong/weather-chatbot/blob/master/1.png)

Then create an app at developers.facebook.com/quickstarts.
Give it a name and click the button, then fill out the required info:
![Create Facebook App ](https://github.com/gsduong/weather-chatbot/blob/master/2.png)

Once your app is created, follow the steps to configure or skip it to your Dashboard.
![Dashboard](https://github.com/gsduong/weather-chatbot/blob/master/3.png)

Click Add Product from the left menu, then choose Messenger. Click Get Started.
![Webhook](https://github.com/gsduong/weather-chatbot/blob/master/4.png)

At the Token Generation, (1) choose the page you just created from the dropdown menu, and it will generate a token (2) that you will need to include in your node code.

Deploy heroku (you need to install Heroku first):
Clone https://github.com/gsduong/weather-chatbot.
Change PAGE_ACCESS_TOKEN according to page access token of your page (app.js).
Commit and push to heroku master. You will get an URL after deploying.

Then, at the Webhooks, (3) click the Setup Webhooks button:
![Page Access Token](https://github.com/gsduong/weather-chatbot/blob/master/5.png)

In the dialog, fill out the (1) Callback URL with your heroku URL (/webhook), (2) the random string for validation: type "TOKEN".
![Verify And Save](https://github.com/gsduong/weather-chatbot/blob/master/6.png)
(Verify Token = "TOKEN").
Go to your page and enjoy!

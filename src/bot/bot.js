import builder from 'botbuilder';

let ChatConnector = {};
if (process.env.NODE_ENV === 'development') {
  ChatConnector = require('../../settings.json').ChatConnector;
} else {
  const { appId, appPassword, mongoDeployUrl } = process.env;
  ChatConnector = { appId, appPassword, mongoDeployUrl };
}

export const connector = new builder.ChatConnector({
  appId: ChatConnector.appId,
  appPassword: ChatConnector.appPassword
});

export const bot = new builder.UniversalBot(connector);


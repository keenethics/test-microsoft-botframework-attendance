import builder from 'botbuilder';
import params from '../../settings.js';

export const connector = new builder.ChatConnector({
  appId: params.ChatConnector.appId,
  appPassword: params.ChatConnector.appPassword
});

export const bot = new builder.UniversalBot(connector);

import builder from 'botbuilder';
import { ChatConnector } from '../../settings.json';


export const connector = new builder.ChatConnector({
  appId: ChatConnector.appId,
  appPassword: ChatConnector.appPassword
});

export const bot = new builder.UniversalBot(connector);


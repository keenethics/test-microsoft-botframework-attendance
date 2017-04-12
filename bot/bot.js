import builder from 'botbuilder';

export const connector = new builder.ChatConnector({
	appId: '607b6eb5-3eb4-4f2d-a0e9-38b471a4979a',
	appPassword: '9Yhoxk9oJyqo18Xog1hT4sH'
});

export const bot = new builder.UniversalBot(connector);
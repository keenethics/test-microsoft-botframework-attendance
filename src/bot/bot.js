import builder from 'botbuilder';

export const connector = new builder.ChatConnector({
  appId: '79dc72c7-dc9b-43f6-9833-d12c0771f89b',
  appPassword: 'SmiHtU8Mpjx6QzQcQ9YjbXg'
});

export const bot = new builder.UniversalBot(connector);

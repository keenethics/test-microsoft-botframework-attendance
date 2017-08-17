export const filterQuotes = (str) => (str.replace(/(<.+?>)|(\[.+\].+:)|(\&lt;)|(\s){2,5}/g, ''));
export const addQuotes = (str) => (new RegExp(`<.+?>[[].+].+: </.+?>((${str})([A-Za-z@.\\s])*)+<.+?>.+</.+?>`, 'i'));
export const addQuotesToRegExp = (exp) => (addQuotes(`${exp}`.replace(/([/][^])+/, '').replace(/([$][/])+/,'')));


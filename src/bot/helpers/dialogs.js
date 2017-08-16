export const filterQuotes = (str) => (str.replace(/(<)+(.)+?(>)+/,'').replace(/(<[/])+(.)+?(>)+/,''));

export const addQuotes = (str, skipEnd) => (new RegExp(`^<.+>${str}<[/].+>${skipEnd ? '' : '$' }`, 'i'));

export const addQuotesToRegExp = (exp) => (addQuotes(`${exp}`.replace(/([/][^])+/, '').replace(/([$][/])+/,'')));

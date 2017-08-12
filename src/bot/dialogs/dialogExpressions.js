export const eventsOf = /^events of [A-Za-z.0-9]{2,20}@+[a-z]{2,14}[.]+[a-z]{2,3}$/;
export const ofEmail =  /of \w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
export const addHoliday = /^add holiday on (30|31|[0-2][0-9])[.]([0][0-9]|[1][0-2])[.][0-9]{4} .+$/;
export const holidaysOn = /^((holidays)+|(holidays on ([0][0-9]|[1][0-2])[.][0-9]{4})+)$/; 
export const attendance = /^attendance of [A-Za-z.0-9]{2,20}@+[a-z]{2,14}[.]+[a-z]{2,3}( on ([0][0-9]|[1][0-2])[.][0-9]{4})*$/;

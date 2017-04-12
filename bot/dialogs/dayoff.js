import { bot } from '../bot.js';
import builder from 'botbuilder';
import moment from 'moment';
import { Event } from '../../models';
bot.dialog('/dayoff' , [

	function (session) {
		builder.Prompts.text(session,'how many days ?');
	},

	function (session, results){
		session.userData.dayOff = { dayOffCount: parseInt(results.response,10) };
		builder.Prompts.text(session,'whats up ?');

	},
	function (session,results){
		session.userData.dayOff.reason = results.response; 
		builder.Prompts.text(session, 'What time would you like to set an day off  for? (dd.mm)');   
	},
	function (session, results ,reason){
		const { dayOffCount } = session.userData.dayOff; 
		const dayMonth = results.response.split('.');
		const day = dayMonth[0];
		const month = dayMonth[1];
		const date = moment({month, date: day})._d;
		const startsAt = moment(date)._d;
		const endsAt = moment(startsAt).clone().add(dayOffCount, 'days');
		const type = 'dayoff'; 
		const dayoff = {
			startsAt,
			endsAt,
			type,
			comment: session.userData.dayOff.reason,
			user: session.userData.profile.name,
			responses: [], 
		};
		session.userData.dayoff = dayoff;

		const DayOff = new Event(dayoff);
		DayOff.save((err) => {
			if (err) { console.log(err); }
		});

      // session.userData.time = builder.EntityRecognizer.resolveTime([results.response]);
		session.userData.time = builder.EntityRecognizer.resolveTime([startsAt]);
      
		var card = createHeroCard(session, reason);
		var msg = new builder.Message(session).addAttachment(card);
		session.send(msg);

		session.endDialogWithResult();
		session.beginDialog('/menu');
	}
]);

function createHeroCard(session,reason) {
	const imageUrl = 'http://2.bp.blogspot.com/-AJcBRl3gmJk/VPdRVHoEa5I/AAAAAAAAaTU/'+
  '23keCkkciQQ/s1600/keep-calm-and-have-a-day-off-3.png';
	const { startsAt, endsAt } = session.userData.dayoff;
	const diff = moment(endsAt).diff(moment(startsAt), 'days');
	const dayoffs = diff > 1 ? `${moment(startsAt).format('MMMM Do YYYY')} - ${moment(endsAt).format('MMMM Do YYYY')}`
    : moment(startsAt).format('MMMM Do YYYY');
	return new builder.HeroCard(session)
        .title('Day off for  %s', session.userData.profile.name)
        .text('Reason: " %s "', reason)
        .text('AT: " %s "', dayoffs)
        .images([
	builder.CardImage.create(session, imageUrl)
])
        .buttons([
	builder.CardAction.openUrl(session,'https://www.google.com.ua/', 'Send(to mc)')
]);
}

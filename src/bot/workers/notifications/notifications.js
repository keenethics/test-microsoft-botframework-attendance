import mongoose from 'mongoose';
import { getAdmins, getPendingEvents } from './notificationsHelper.js';
import { getUserById } from '../../helpers/users.js';
import { bot } from '../../bot.js'; 
import { mongoDeployUrl } from '../../../../settings.json';

const mongourl = 
	process.env.NODE_ENV === 'development' ?
	'mongodb://localhost:27017/skypebot'
	: mongoDeployUrl;
   
mongoose.connect(mongourl);

setTimeout(async () => {
  const admins = await getAdmins();
  const adminIds = admins.map(a => (a._id));
  const adminId = adminIds[0];
  const pendingEvents = await getPendingEvents(adminId);
  const admin = await getUserById(adminId); 
  const { address } = admin;
  bot.beginDialog(address, "/userAddedEvent");
}, 1000)


import mongoose from 'mongoose'

const UsersSchema = {
	name: String,
	email: String,
	usedVacations: Number,
	workedActually: [Number],
	workingDays: [Number],
}

const Users = mongoose.model('Users', UsersSchema);

export default Users;

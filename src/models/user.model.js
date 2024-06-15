import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			index: true
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		fullName: {
			type: String,
			required: true,
			index: true,
			trim: true,
		},
		avatar: {
			type: String, // cloudnary url
			required: true
		},
		coverImage: {
			type: String
		},
		watchHistory: [
			{
				type: Schema.Types.ObjectId,
				ref: "Video"
			}
		],
		password: {
			type: String,
			required: [true, 'Password is required']
		},
		refreshToken: {
			type: String
		}
}, {timeseries: true})


userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 10)
	next()
})
 
userSchema.methods.isPasswordCorrect = async function (password) {
	return await bcrypt.compare(password, this.password)
}

userSchema.generateAccessToken = function  () {
	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			username: this.username,
			fullName: this.fullName
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY
		}
	)

 }
userSchema.generateRefreshToken = function () { 
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY
		}
	)
}
export const User = mongoose.model("User", userSchema);
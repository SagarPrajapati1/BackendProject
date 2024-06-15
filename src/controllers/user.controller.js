import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
	
	// get user detail from frontend
	// validation - not empty
	// check if user already exists : username, email
	// check for images, check for avatar
	// upload them to cloudinary, avatar
	// create user object- create entry in db
	// remove password and refresh token field from response
	// check for user creation
	
	// return response
	
	// user details
	const { fullName, email, username, password } = req.body
	// console.log("emial: ", email);

	// validations check for if empty string is not passed
	if (
		[fullName, email, username, password].some((field) =>
			field ?.trim() === "")
	) {
			throw new ApiError(400, "All fields are required")
	}

	// if user already exists : username, email
	const existedUser = await User.findOne({  // findOne() => return the first user founded
		$or: [{ username }, { email }] // check the if username is available or email available
		
		// $or || $and || $nor is the bitwise operators and work as same as the normal any programming operators
	})

	// console.log(existedUser); // log to know what data we are getting in thr existedUser

	if (existedUser) {
		throw new ApiError(409, "User with email or username already exists")
	}

	// multer gives the access of the files as same as req.body gives the access
	const avataLocalPath = req.files?.avatar[0]?.path
	// console.log(avataLocalPath);

	// const coverImageLocalPath = req.files?.coverImage[0]?.path; // it is the js error -> it don't give the path we assuming that their is avatar present or user upload the avatar that's why it is giving the error, so check with the classical if() check
	
	let coverImageLocalPath;
	if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
		coverImageLocalPath = req.files.coverImage[0].path
	}


	if (!avataLocalPath) {
		throw new ApiError(400, "Avatar file is required")
	}
	
	const avatar = await uploadOnCloudinary(avataLocalPath)
	const coverImage = await uploadOnCloudinary(coverImageLocalPath)
	
	// check for avatar
	if (!avatar) {
		throw new ApiError(400, "Avatar file is required")		
	}

	// user object- create entry in db
	const user = await User.create({
		fullName,
		avatar: avatar.url,
		coverImage: coverImage?.url || "",
		email,
		password,
		username: username.toLowerCase()
	})
	// remove password and refresh token field from response
	const createdUser = await User.findById(user._id).select(
		"-password -refreshToken"
	)
	
	// check id user is created or not
	if (!createdUser) {
		throw new ApiError(500, "Something went wrong while registring the user")
	}

	// return the response
	return res.status(201).json(
		new ApiResponse(200, createdUser, "User Registered Successfully")
	)

	// res.status(200).json({messsage: "ok"})
})

export {
	registerUser,
}
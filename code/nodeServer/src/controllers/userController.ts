import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import speakeasy from 'speakeasy';
import db from '../db/index';
import { eq } from "drizzle-orm";
import { doctorTable, patientTable, providerTable, usersTable } from "../db/schema";
import { generateAccessToken } from "../utils/jwtHelper";
import { AuthService } from "../utils/mailHelper";

// Login Validation Schemas  
// const LoginSchema = z.object({
// 	email: z.string().email(),
// 	password: z.string().min(8)
// });

export class AuthController {
	
    // -------------------------------------------------User Registration-----------------------------------------------------------------
    static async register(req: Request, res: Response) : Promise<any> {
      	try {
			const { name, email, type, password } = req.body;
    		// Comprehensive validation
    		if (!name || !email || !type || !password) {
      			return res.status(400).json({
        			message: 'All fields are required'
      			});
    		}
  
        	// Check if user exists=-
			const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email))

        	if (!existingUser) {
          		return res.status(400).json({ message: 'User already exists' });
        	}
  
        	// Hash password
        	const salt = await bcrypt.genSalt(10);
        	const hashedPassword = await bcrypt.hash(req.body.password, salt);
			const userId = uuidv4();
			const id = (type: string) : string => {
				if (type === "Patient") return "pid"+uuidv4();
				else if (type === "Doctor") return "did"+uuidv4();
				else if (type === "Provider") return "prid"+uuidv4(); 
				return "nothing matched"
			} 

        	if (req.body.type === "Patient") {
				const result = await db.transaction(async (tx) => {
					const [insertedUser] = await tx.insert(usersTable).values({
						user_id: userId,
						name: name,
						age: req.body.age,
						email: email,
						type: type,
						password_hashed: hashedPassword,
						phone: req.body.phone,
						gender: req.body.gender,
						dob: req.body.dob ? new Date(req.body.dob) : new Date("1999-01-01"),
						updated_at: new Date()
					}).returning();
					
					const patientId = id(req.body.type);
					const [insertedPatient] = await tx.insert(patientTable).values({
						user_id: insertedUser.user_id,
						patient_id: patientId,
						blood_group: req.body.blood_group,
						allergies: req.body.allergies,
						chronic_conditions: req.body.chronic_conditions,
						emergeny_contact: req.body.emergeny_contact,
						address: req.body.address
					}).returning();
					return { user: insertedUser, patientTable: insertedPatient }
				})
				res.status(201).json(result);

				/*
				const isDobInFuture = new Date() < new Date(user.dob);
				const isUpdatedRecently = new Date(user.updated_at) > new Date("2024-01-01");
				*/

			} else if (req.body.type === "Doctor") {
				const result = await db.transaction(async (tx) => {
					const [insertedUser] = await tx.insert(usersTable).values({
						user_id: userId,
						name: name,
						age: req.body.age,
						email: email,
						type: type,
						password_hashed: hashedPassword,
						phone: req.body.phone,
						gender: req.body.gender,
						dob: req.body.dob ? new Date(req.body.dob) : new Date("1999-01-01"),
						updated_at: new Date()
					}).returning();
					
					const doctorId = id(req.body.type);
					const [insertedDoctor] = await tx.insert(doctorTable).values({
						user_id: insertedUser.user_id,
						doctor_id: doctorId,
						license_number: req.body.license_number,
						specialization: req.body.specialization,
						experience: req.body.experience
					}).returning();
					return { user: insertedUser, doctorTable: insertedDoctor }
				})
				res.status(201).json(result)

			} else if (req.body.type === "Provider") {
				console.log("Pro Exec")
				const result = await db.transaction(async (tx) => {
					const [insertedUser] = await tx.insert(usersTable).values({
						user_id: userId,
						name: name,
						age: req.body.age,
						email: email,
						type: type,
						password_hashed: hashedPassword,
						phone: req.body.phone,
						gender: req.body.gender ? req.body.gender : "m",
						dob: req.body.dob ? new Date(req.body.dob) : new Date("1999-01-01"),
						updated_at: new Date()
					}).returning();

					const providerId = id(req.body.type);
					const [insertedProvider] = await tx.insert(providerTable).values({
						user_id: insertedUser.user_id,
						provider_id: providerId,
						category: req.body.category
					}).returning();
					return { user: insertedUser, providerTable: insertedProvider }
				})
				res.status(201).json(result)
			}

      	} catch (error) {
        	res.status(400).json({ 
          	message: 'Registration failed', 
          	error: error instanceof Error ? error.message : error 
        	});
      	}
    }
  
    //-------------------------------------------------------------Login--------------------------------------------------------------
    static login = async (req: Request, res: Response) : Promise<any> => {
      	try {
        	// Validate input
			if (!req.body.email || !req.body.password){
				return res.status(400).json({
					message: 'All fields are required'
				})
			}
  
        	// Find user
        	const users = await db.select().from(usersTable).where(eq(usersTable.email, req.body.email))
        	if (users.length === 0) {
          		return res.status(401).json({ message: 'Invalid credentials' });
        	}

			const user = users[0];
			let isMatch = true;
        	
			if (!user.password_hashed){
				return res.status(400).json({message: "no password"})
			} else {
				isMatch = await bcrypt.compare(req.body.password, user.password_hashed);
			}

        	if (!isMatch) {
          		return res.status(401).json({ message: 'Invalid credentials' });
        	}
			
			try {
				console.log("trying to send otp")
				await AuthService.sendOTPEmail(req.body.email);
			} catch (otpError) {
				console.error('OTP Email Send Error:', otpError);
				return res.status(500).json({
					message: 'OTP Send Failed',
					error: otpError instanceof Error ? otpError.message : otpError
				});
			}

        	return res.status(200).json({
          		message: 'Login successful with data',
          		user: {
					message: "OTP sent to designated email ID",
            		id: user.user_id,
            		email: user.email,
            		role: user.type
          		}
        	});
      	} catch (error) {
        	return res.status(400).json({ 
          		message: 'Login failed', 
          		error: error instanceof Error ? error.message : error 
        	});
      	}
    }

	//-------------------------------------------------------------OTP Verification---------------------------------------------------
	static verifyOTP = async (req: Request, res: Response) : Promise<any> => {
		try {
			const {otp, type, email} = req.body;
			
			let secrectBase32 = process.env.JWT_SECRET_KEY!
			
			console.log("Received OTP:", otp);
    		console.log("OTP type:", typeof otp);
    		console.log("Secret key used:", secrectBase32);
    		console.log("Current time:", Date.now());
    		console.log("OTP expiry time:", AuthService.otpExpiry);

			//check for expired OTP
			if (Date.now() > AuthService.otpExpiry) {
				console.log("OTP expired");
				return res.status(403).json({
					"message": "OTP expired"
				})
			}

			const tokenToVerify = typeof otp === 'string' ? otp.trim() : String(otp);

			console.log("Token to verify:", tokenToVerify);

			const isValid = speakeasy.totp.verify({
				secret: secrectBase32,
				digits: 4, 
				token: tokenToVerify,
				step: 60,
				window: 5
			})
			
			// if (!isValid) {
			// 	return res.status(400).json({
			// 		status: "FAIL",
			// 		message: "Invalid OTP"
			// 	});
			// }
			console.log("OTP is correct");

			const getUserData = async (type: string) => {
				if (type == "Patient"){
					return await db.select().from(usersTable).leftJoin(patientTable, eq(usersTable.user_id, patientTable.user_id)).where(eq(usersTable.email, email))
				}
				else if (type == "Doctor"){
					return await db.select().from(usersTable).leftJoin(doctorTable, eq(usersTable.user_id, doctorTable.user_id)).where(eq(usersTable.email, email))
				}
				else if (type == "Provider"){
					return await db.select().from(usersTable).leftJoin(providerTable, eq(usersTable.user_id, providerTable.user_id)).where(eq(usersTable.email, email))
				}
				else throw new Error("Invalid user type")
			}

			// let userObj : any;
			// if (isValid) {
			// 	console.log("OTP is correct");
			// 	userObj = (async (type: string) => {
			// 		if (type == "Patient")
			// 			return await db.select().from(usersTable).leftJoin(patientTable, eq(usersTable.user_id, patientTable.user_id))
			// 		else if (type == "Doctor")
			// 			return await db.select().from(usersTable).leftJoin(doctorTable, eq(usersTable.user_id, doctorTable.user_id))
			// 		else if (type == "Provider")
			// 			return await db.select().from(usersTable).leftJoin(providerTable, eq(usersTable.user_id, providerTable.user_id))
			// 	})
			// }

			const userObj = await getUserData(type);
			console.log(userObj);
			
			const accessToken = await generateAccessToken(userObj[0]);
			console.log(accessToken);

			const cookieOptions = {
				maxAge: 3600000 * 24,
				httpOnly: false
			}

			res.cookie("uid", accessToken, cookieOptions);
			res.status(200).json({
				status: "PASS",
				message: "Cookie Sent",
				accessToken: accessToken,
			})

		} catch (error) {
			res.status(400).json({
				message: 'otp failed',
				error: error instanceof Error ? error.message : error
			})
		}
	}

    // -------------------------------------------------------------Password Reset-------------------------------------------------------------
    static async passwordReset(req: Request, res: Response) : Promise<any> {
      	const { email } = req.body;
  
      	// Find user
      	const user = await db.select().from(usersTable).where(eq(usersTable.email, email))
      	if (!user) {
        	return res.status(404).json({ message: 'User not found' });
      	}
  
      	// Send reset email
      	await AuthService.sendPasswordEmail(email);
  
      	res.json({ 
        	message: 'new password reset sent to your email' 
      	});
    }
}

export default AuthController;
import transporter from "../config/mailConfig";
import speakeasy from 'speakeasy'
import crypto from 'crypto';
import db from '../db/index'
import bcrypt from 'bcryptjs';
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";

export class AuthService {
	static otpExpiry = 0;	

    static generateOTP(secretBase32: string): string {
        let token = speakeasy.totp({
            secret: secretBase32, 
            digits: 4,
            step: 60, 
        });
            
        return token;
    }

	static generatePassowrd() : string {
		return crypto
    		.randomBytes(6)  // 6 bytes = 8 characters when converted to base64
    		.toString('base64')
    		.slice(0, 8)
    		.replace(/\0/g, '0')  // replace '+' with '0' to ensure alphanumeric
    		.replace(/\//g, '1'); // replace '/' with '1'
	}

  	// Send OTP Email
  	static async sendOTPEmail(email: string) {
    	try {
            const secretBase32 = process.env.OTP_KEY;
            let otp = AuthService.generateOTP(secretBase32 ? secretBase32 : "secret");
			this.otpExpiry = Date.now() + (6000*5);
      		await transporter.sendMail({
        		from: process.env.EMAIL_ADDRESS,
        		to: email,
        		subject: "Your OTP for Authentication",
        		html: `
            	<h1>Your OTP</h1>
            	<p>Your One-Time Password is: <strong>${otp}</strong></p>
            	<p>This OTP will expire in 10 minutes.</p>
          		`,
      		});
    	} catch (error) {
      		console.error("Email sending failed", error);
      		throw new Error("Failed to send OTP");
    	}
  	}

	static async sendPasswordEmail(email: string){
		let password = this.generatePassowrd()

		try {
			const salt = await bcrypt.genSalt(10);
			password = await bcrypt.hash(password, salt);
			await db.update(usersTable).set({password_hashed: password}).where(eq(usersTable.email, email))

			await transporter.sendMail({
				from: process.env.EMAIL_FROM,
				to: email,
				subject: 'Password Reset Request',
					html: `
					  <h1>Password Reset</h1>
					  <p>reseted password:</p>
					Reset Password - ${password}  
					  </a>
					  <p>Keep a note of this password</p>
				`
			});
		} catch (error) {
			console.error("Email sending failed", error);
      		throw new Error("Failed to send OTP");
		}
	}
}
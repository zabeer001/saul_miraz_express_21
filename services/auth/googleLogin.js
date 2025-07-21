import jwt from 'jsonwebtoken';

import User from '../../models/user.model.js';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../../config/env.js';


export const googleLogin = async (body) => {
    try {
        const { email, name, googleAuthentication } = body;

        if (!email || !googleAuthentication) {
            return { success: false, status: 400, message: "Email and Google Authentication flag are required." };
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                name,
                googleAuth: googleAuthentication,
            });
        }

        if (!googleAuthentication) {
            return { success: false, status: 401, message: "Google authentication failed." };
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        return {
            success: true,
            status: 200,
            message: "Login successful",
            token,
            user,
            method: "Google Auth"
        };

    } catch (error) {
        console.error("Google login error:", error);
        return { success: false, status: 500, message: "Internal server error", error: error.message };
    }
};

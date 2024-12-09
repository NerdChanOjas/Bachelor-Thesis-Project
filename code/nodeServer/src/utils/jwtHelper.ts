import jwt from 'jsonwebtoken';

export const generateAccessToken = async (obj: object) : Promise<string> => {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        throw new Error('JWT secret key is not defined');
    }
    return jwt.sign(obj, secretKey, {
        algorithm: 'HS256'
    })
}

export const verifyUser = async (key: string | null) => {
    if(!key) return null;
    
    let secretKey = process.env.JWT_SECRET_KEY;
    
    if (!secretKey) {
        throw new Error('JWT secret key is not defined');
    }

    try {
        return jwt.verify(key, secretKey);
    } catch (error: any) {
        return error.message;
    }
}
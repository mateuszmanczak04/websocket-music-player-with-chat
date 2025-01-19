import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

export const encryptMessage = (message: string, key: string): string => {
	const cipher = crypto.createCipher(algorithm, key);
	let encrypted = cipher.update(message, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	return encrypted;
};

export const decryptMessage = (encryptedMessage: string, key: string): string => {
	const decipher = crypto.createDecipher(algorithm, key);
	let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	return decrypted;
};

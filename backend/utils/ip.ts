import os from 'os';

export const getLocalNetworkIP = () => {
	const interfaces = os.networkInterfaces();
	for (const name of Object.keys(interfaces)) {
		for (const iface of interfaces[name]!) {
			// Skip over non-IPv4 and internal (i.e., 127.0.0.1) addresses
			if (iface.family === 'IPv4' && !iface.internal) {
				return iface.address;
			}
		}
	}
	return '127.0.0.1'; // Fallback to localhost if no network IP is found
};

export const formatTimestamp = (timestamp) => {
	const options = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	};
    
	return new Date(timestamp).toLocaleString(undefined, options);
	};
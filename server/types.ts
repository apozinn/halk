export type PayloadMessage = {
	message: {
		id: number;
		author: {
			id: number;
			phone: number;
			profile: {
				name: string;
				username: string;
				bio: string;
				avatar: string;
				banner: string;
			};
		};
		content: string;
		read: number;
		type: string;
	};
	to: string;
};

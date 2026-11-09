import Tools from './tools';

export default class HalkController extends Tools {
	halkUser = {};
	constructor() {
		super();
		this.halkUser = {
			id: this.generateRandomId(),
			phone: "+1 01010101010",
			profile: {
				name: "Halk",
				username: "Halk team",
				avatar: "https://i.imgur.com/AaIl958.png",
				bio: "Official account of the team Halk",
			},
		};
	}

	public halkChat() {
		const timeNow = new Date().getTime();

		const chat = {
			id: this.generateRandomId(),
			user: this.halkUser,
			messages: [
				{
					author: this.halkUser,
					content: "Welcome to halk!",
					createdAt: timeNow,
					id: this.generateRandomId(),
					read: false,
				},
			],
		};
		return chat;
	}

	public halkStatus() {
		const timeNow = new Date().getTime();
		return [
			{
				author: this.halkUser,
				stories: [
					{
						id: this.generateRandomId(),
						createdAt: timeNow,
						type: "text",
						content: "Welcome to Halk app!",
						color: this.generateRandomColor(),
					},
					{
						id: this.generateRandomId(),
						createdAt: timeNow,
						type: "text",
						color: this.generateRandomColor(),
					},
				],
			},
		];
	}
}

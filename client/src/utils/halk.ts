export default class HalkController {
	private generateRandomId = () => {
		const timeNow = new Date().getTime();
		return `${timeNow}${Math.floor(
			Math.random() * (100000000 - 1000000 + 1) + 1000000
		)}`;
	};
	halkUser = {};

	constructor() {
		this.halkUser = {
			id: this.generateRandomId(),
			phone: "+1 01010101010",
			profile: {
				name: "Halk",
				username: "Halk team",
				avatar: "https://i.imgur.com/Xc979YU.png",
				bio: "Official account of the team Halk",
			},
		};
	}

	public halkChat() {
		const timeNow = new Date().getTime();

		const chat = {
			id: generateRandomId(),
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
					},
				],
			},
		];
	}
}

export default class Tools {
	constructor() {}

	 public generateRandomColor(filter = null) {
		let color;
		if (filter) {
		} else {
			color = Math.floor(Math.random() * 16777215)
				.toString(16)
				.padStart(6, "0");
		}

		return `#${color}`;
	}

	 public generateRandomId() {
		const timeNow = new Date().getTime();
		return `${timeNow}${Math.floor(
			Math.random() * (100000000 - 1000000 + 1) + 1000000
		)}`;
	}
}

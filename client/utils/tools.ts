export default class Tools {
  constructor() {}

  public generateRandomColor(filter?: (color: string) => boolean): string {
    let color = "";

    do {
      color = `#${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0")}`;
    } while (filter && !filter(color));

    return color;
  }

  public generateRandomId(prefix = ""): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1_000_000_000)
      .toString()
      .padStart(9, "0");
    return `${prefix}${timestamp}${random}`;
  }
}

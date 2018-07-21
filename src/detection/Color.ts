export class Color {

    static BLACK = new Color(0,0,0)
    static WHITE = new Color(255,255,255)

    static Random() {
        return new Color(
            Math.random() * 255,
            Math.random() * 255,
            Math.random() * 255,
        );
    }

    constructor(
        public r: number = 0,
        public g: number = 0,
        public b: number = 0,
    ) {}

    distance(color2: Color) {
        return Math.sqrt(
            Math.pow(this.r - color2.r, 2) +
                Math.pow(this.g - color2.g, 2) +
                Math.pow(this.b - color2.b, 2),
        );
    }

    nearestColor(...colors: Color[]) {
        return colors.sort(
            (a, b) => (this.distance(a) > this.distance(b) ? 1 : -1),
        )[0];
    }

    get css(): string {
        return `rgb(${this.r},${this.g},${this.b})`;
    }

    get lightness(): number {
        return (this.r + this.g + this.b) / 255 / 3;
    }
}

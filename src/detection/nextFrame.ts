const LAGGING = false;

export function nextFrame() {
    if (!LAGGING) {
        return new Promise((resolve, reject) => {
            requestAnimationFrame(() => {
                resolve();
            });
        });
    } else {
        return new Promise((resolve, reject) => {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    resolve();
                }, 100);
            });
        });
    }
}

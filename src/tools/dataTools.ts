export function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const a = new FileReader();
        a.onload = function(e) {
            resolve((e.target as any).result);
        };
        a.readAsDataURL(blob);
    });
}

export function textToDataURL(text: string, mimeType: string): string {
    /*return blobToDataURL(
        new Blob([text], {
            type: mimeType,
        }),
    );*/
    return `data:${mimeType};base64,${btoa(text)}`;
}

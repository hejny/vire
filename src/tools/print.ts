import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import * as superagent from 'superagent';

function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        var a = new FileReader();
        a.onload = function(e) {
            resolve((e.target as any).result);
        };
        a.readAsDataURL(blob);
    });
}

export async function print() {
    //todo
    jsPDF;
    html2canvas;

    const printElement = document.querySelector('#print') as HTMLElement; //todo better
    console.log(printElement);

    //---------

    var images = printElement.getElementsByTagName('img');
    for (let i = 0, l = images.length; i < l; i++) {
        const image = images[i];

        if (image.src.substring(0, 5) !== 'data:') {
            const result = await superagent.get(image.src).responseType('blob');
            const dataUrl = await blobToDataURL(result.body);
            image.src = dataUrl;
        }
    }

    //---------
    /**/

    const printCanvas = await html2canvas(printElement!, { allowTaint: false });

    //console.log(printCanvas);

    //document.body.appendChild(printCanvas);

    //---------
    /**/

    const width = 58;
    const height = printCanvas.height * width / printCanvas.width;

    // only jpeg is supported by jsPDF
    var imgData = printCanvas.toDataURL('image/jpeg', 1.0);

    //todo config 3.5
    var pdf = new jsPDF('p', 'mm', [width, height + 3.5] as any);

    //todo count 1.2
    pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
    pdf.save('download.pdf');

    //console.log(printCanvas.toDataURL());

    /*var doc = new jsPDF();
    doc.setFontSize(40)
    doc.text(35, 25, 'Paranyan loves jsPDF')
    doc.addImage('http://localhost:3000/test.jpg', 'JPEG', 15, 40, 180, 160)
    doc.save('a4.pdf');*/
}

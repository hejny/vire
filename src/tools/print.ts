import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';

export function print() {
    //todo
    jsPDF;
    html2canvas;

    const printElement = document.getElementById('print'); //todo better
    const printCanvas = html2canvas(printElement!);

    console.log(printCanvas);

    /*var doc = new jsPDF();
    doc.setFontSize(40)
    doc.text(35, 25, 'Paranyan loves jsPDF')
    doc.addImage('http://localhost:3000/test.jpg', 'JPEG', 15, 40, 180, 160)
    doc.save('a4.pdf');*/
}

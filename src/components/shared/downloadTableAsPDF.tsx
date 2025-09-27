import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';


export const downloadPDF = async (elementId: string, filename: string) => {
    const input = document.getElementById(elementId);
    if (input) {
        try {
            const canvas = await html2canvas(input);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const width = pdf.internal.pageSize.getWidth();
            const height = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'PNG', 0, 0, width, height);
            pdf.save(filename);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    }
};
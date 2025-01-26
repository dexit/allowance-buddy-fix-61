import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (result: any, timelineElement: HTMLElement | null) => {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text('Foster Care Allowance Summary', 20, 20);
  
  let yPos = 40;
  result.children.forEach((child: any, index: number) => {
    doc.setFontSize(12);
    doc.text(`Child ${index + 1} (Age Group ${child.ageGroup})`, 20, yPos);
    yPos += 10;

    child.weekIntervals?.forEach((interval: any, intervalIndex: number) => {
      doc.setFontSize(10);
      doc.text(`Interval ${intervalIndex + 1}: Weeks ${interval.start}-${interval.end}`, 30, yPos);
      yPos += 8;
      doc.text(`Base Rate × Weeks: £${(child.baseAllowance * (interval.end - interval.start + 1)).toFixed(2)}`, 40, yPos);
      yPos += 8;
      if (child.specialCareAmount > 0) {
        doc.text(`Special Care Amount: £${(child.specialCareAmount * (interval.end - interval.start + 1)).toFixed(2)}`, 40, yPos);
        yPos += 8;
      }
      doc.text(`Interval Total: £${((child.baseAllowance + child.specialCareAmount) * (interval.end - interval.start + 1)).toFixed(2)}`, 40, yPos);
      yPos += 12;
    });

    doc.text(`Child Total: £${child.totalAllowance.toFixed(2)}`, 30, yPos);
    yPos += 15;
  });
  
  doc.setFontSize(14);
  doc.text('Total Allowance Summary', 20, yPos);
  yPos += 10;
  doc.text(`Weekly Total: £${result.weeklyTotal.toFixed(2)}`, 30, yPos);
  yPos += 10;
  doc.text(`Monthly Estimate: £${result.monthlyTotal.toFixed(2)}`, 30, yPos);
  yPos += 10;
  doc.text(`Yearly Estimate: £${result.yearlyTotal.toFixed(2)}`, 30, yPos);

  // Add timeline to PDF if available
  if (timelineElement) {
    try {
      const canvas = await html2canvas(timelineElement);
      const timelineImage = canvas.toDataURL('image/png');
      
      // Add new page for timeline
      doc.addPage();
      doc.setFontSize(16);
      doc.text('Fostering Timeline', 20, 20);
      
      // Calculate dimensions to fit the page while maintaining aspect ratio
      const imgWidth = doc.internal.pageSize.getWidth() - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      doc.addImage(timelineImage, 'PNG', 20, 30, imgWidth, imgHeight);
    } catch (error) {
      console.error('Error adding timeline to PDF:', error);
    }
  }
  
  doc.save('foster-care-allowance.pdf');
};
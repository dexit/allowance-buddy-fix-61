import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (result: any, timelineElement: HTMLElement | null, userInfo: any) => {
  const doc = new jsPDF();
  
  // Add user information
  doc.setFontSize(20);
  doc.setTextColor(15, 160, 206); // Primary color
  doc.text('Foster Care Allowance Summary', 20, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(34, 34, 34);
  let yPos = 40;
  
  if (userInfo) {
    doc.text(`Name: ${userInfo.name}`, 20, yPos);
    yPos += 10;
    doc.text(`Email: ${userInfo.email}`, 20, yPos);
    yPos += 10;
    doc.text(`Phone: ${userInfo.phone}`, 20, yPos);
    yPos += 10;
    doc.text(`Experience: ${userInfo.isExperiencedCarer ? 'Experienced Carer' : 'New Carer'}`, 20, yPos);
    yPos += 20;
  }

  // Add children details
  result.children.forEach((child: any, index: number) => {
    doc.setFontSize(14);
    doc.setTextColor(15, 160, 206);
    doc.text(`Child ${index + 1} (Age Group ${child.ageGroup})`, 20, yPos);
    yPos += 10;

    child.weekIntervals?.forEach((interval: any, intervalIndex: number) => {
      doc.setFontSize(12);
      doc.setTextColor(34, 34, 34);
      doc.text(`Period ${intervalIndex + 1}: Weeks ${interval.start}-${interval.end}`, 30, yPos);
      yPos += 8;
      doc.text(`Weekly Rate: £${child.baseAllowance.toFixed(2)}`, 40, yPos);
      yPos += 8;
      if (child.specialCareAmount > 0) {
        doc.text(`Special Care Amount: £${child.specialCareAmount.toFixed(2)}`, 40, yPos);
        yPos += 8;
      }
      const periodTotal = (child.baseAllowance + child.specialCareAmount) * (interval.end - interval.start + 1);
      doc.text(`Period Total: £${periodTotal.toFixed(2)}`, 40, yPos);
      yPos += 12;
    });

    doc.text(`Child Total: £${child.totalAllowance.toFixed(2)}`, 30, yPos);
    yPos += 15;
  });
  
  // Add timeline if available
  if (timelineElement) {
    try {
      const canvas = await html2canvas(timelineElement);
      const timelineImage = canvas.toDataURL('image/png');
      
      // Add new page for timeline
      doc.addPage();
      doc.setFontSize(16);
      doc.setTextColor(15, 160, 206);
      doc.text('Fostering Timeline', 20, 20);
      
      const imgWidth = doc.internal.pageSize.getWidth() - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      doc.addImage(timelineImage, 'PNG', 20, 30, imgWidth, imgHeight);
    } catch (error) {
      console.error('Error adding timeline to PDF:', error);
    }
  }
  
  // Add total summary
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(15, 160, 206);
  doc.text('Total Allowance Summary', 20, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(34, 34, 34);
  yPos = 40;
  doc.text(`Weekly Total: £${result.weeklyTotal.toFixed(2)}`, 30, yPos);
  yPos += 10;
  doc.text(`Monthly Estimate: £${result.monthlyTotal.toFixed(2)}`, 30, yPos);
  yPos += 10;
  doc.text(`Yearly Estimate: £${result.yearlyTotal.toFixed(2)}`, 30, yPos);
  
  doc.save('foster-care-allowance.pdf');
};
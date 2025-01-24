import jsPDF from 'jspdf';

export const generatePDF = (result: any) => {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text('Foster Care Allowance Summary', 20, 20);
  
  let yPos = 40;
  result.children.forEach((child: any, index: number) => {
    doc.setFontSize(12);
    doc.text(`Child ${index + 1} (Age Group ${child.ageGroup})`, 20, yPos);
    yPos += 10;
    doc.text(`Base Rate: £${child.baseAllowance.toFixed(2)}`, 30, yPos);
    yPos += 10;
    doc.text(`Age-Related Element: £${child.ageRelatedElement.toFixed(2)}`, 30, yPos);
    yPos += 10;
    doc.text(`Special Care Amount: £${child.specialCareAmount.toFixed(2)}`, 30, yPos);
    yPos += 10;
    doc.text(`Weekly Total: £${child.totalAllowance.toFixed(2)}`, 30, yPos);
    yPos += 20;
  });
  
  doc.setFontSize(14);
  doc.text('Total Allowance Summary', 20, yPos);
  yPos += 10;
  doc.text(`Weekly Total: £${result.weeklyTotal.toFixed(2)}`, 30, yPos);
  yPos += 10;
  doc.text(`Monthly Estimate: £${result.monthlyTotal.toFixed(2)}`, 30, yPos);
  yPos += 10;
  doc.text(`Yearly Estimate: £${result.yearlyTotal.toFixed(2)}`, 30, yPos);
  
  doc.save('foster-care-allowance.pdf');
};
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (result: any, timelineElement: HTMLElement | null, userInfo: any) => {
  const doc = new jsPDF({
    unit: 'px',
    format: 'a4',
  });

  try {
    // Capture the results container
    const resultsContainer = document.querySelector('.results-container') as HTMLElement;
    if (!resultsContainer) {
      console.error('Results container not found');
      return;
    }

    // Convert results to canvas
    const resultsCanvas = await html2canvas(resultsContainer, {
      scale: 2,
      useCORS: true,
      logging: true,
      backgroundColor: '#ffffff'
    });

    // Add results to PDF
    const resultsImgData = resultsCanvas.toDataURL('image/png');
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (resultsCanvas.height * imgWidth) / resultsCanvas.width;

    // Add title and user info
    doc.setFontSize(20);
    doc.setTextColor(15, 160, 206); // Primary color
    doc.text('Foster Care Allowance Summary', 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(34, 34, 34);
    let yPos = 50;
    
    if (userInfo) {
      doc.text(`Name: ${userInfo.name}`, 20, yPos);
      yPos += 15;
      doc.text(`Email: ${userInfo.email}`, 20, yPos);
      yPos += 15;
      doc.text(`Phone: ${userInfo.phone}`, 20, yPos);
      yPos += 15;
      doc.text(`Experience: ${userInfo.isExperiencedCarer ? 'Experienced Carer' : 'New Carer'}`, 20, yPos);
      yPos += 30;
    }

    // Add results image
    doc.addImage(resultsImgData, 'PNG', 0, yPos, imgWidth, imgHeight);

    // If content exceeds page, add new page for timeline
    if (timelineElement) {
      const timelineCanvas = await html2canvas(timelineElement, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff'
      });

      const timelineImgData = timelineCanvas.toDataURL('image/png');
      const timelineImgWidth = pdfWidth;
      const timelineImgHeight = (timelineCanvas.height * timelineImgWidth) / timelineCanvas.width;

      // Add new page if needed
      if (yPos + imgHeight + timelineImgHeight > pdfHeight) {
        doc.addPage();
        yPos = 20;
      } else {
        yPos += imgHeight + 20;
      }

      doc.addImage(timelineImgData, 'PNG', 0, yPos, timelineImgWidth, timelineImgHeight);
    }

    doc.save('foster-care-allowance.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { UserInfoFormData } from '@/components/foster/UserInfoForm';

export const generatePDF = async (result: any, element: HTMLElement, userInfo: UserInfoFormData) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Add user information
    pdf.setFontSize(12);
    pdf.text(`Name: ${userInfo.firstName} ${userInfo.lastName}`, 20, 20);
    pdf.text(`Email: ${userInfo.email}`, 20, 30);
    pdf.text(`Phone: ${userInfo.phone}`, 20, 40);
    pdf.text(`Experienced Carer: ${userInfo.isExperiencedCarer ? 'Yes' : 'No'}`, 20, 50);
    
    // Add a separator line
    pdf.line(20, 55, 190, 55);

    // Calculate aspect ratio
    const imgWidth = 170;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add the results content
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      20,
      60,
      imgWidth,
      imgHeight
    );

    // Save the PDF
    pdf.save('foster-care-allowance.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};
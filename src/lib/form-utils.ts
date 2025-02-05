export const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  const number = value.replace(/\D/g, '');
  
  if (number.startsWith('07') || number.startsWith('7')) {
    const cleanNumber = number.startsWith('07') ? number.slice(1) : number;
    return `+44 ${cleanNumber.slice(0, 4)} ${cleanNumber.slice(4, 7)} ${cleanNumber.slice(7)}`;
  }
  return value;
};

export const lookupPostcode = async (postcode: string) => {
  // Remove spaces and any mask characters
  const cleanPostcode = postcode.replace(/\s+/g, '').replace(/\[.*?\]/g, '');
  
  // Only proceed if we have a complete postcode (at least 6 characters)
  if (cleanPostcode.length < 6) {
    return '';
  }

  try {
    const response = await fetch(`https://api.postcodes.io/postcodes/${cleanPostcode}`);
    
    if (!response.ok) {
      console.warn('Postcode lookup failed:', await response.text());
      return '';
    }
    
    const data = await response.json();
    if (data.result) {
      return `${data.result.parish || ''} ${data.result.admin_district}, ${data.result.postcode}`.trim();
    }
    return '';
  } catch (error) {
    console.error('Error looking up postcode:', error);
    return '';
  }
};
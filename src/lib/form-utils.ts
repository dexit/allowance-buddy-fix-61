
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
  const cleanPostcode = postcode.replace(/\s+/g, '').replace(/\[.*?\]/g, '');
  const response = await fetch(`https://api.postcodes.io/postcodes/${cleanPostcode}`);
  
  if (!response.ok) {
    throw new Error('Invalid postcode');
  }
  
  const data = await response.json();
  if (data.result) {
    return `${data.result.parish || ''} ${data.result.admin_district}, ${data.result.postcode}`.trim();
  }
  return '';
};

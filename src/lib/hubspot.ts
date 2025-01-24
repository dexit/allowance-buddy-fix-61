interface FormData {
  userInfo: {
    name: string;
    email: string;
    phone: string;
    isExperiencedCarer: boolean;
  };
  children: any[];
  result: any;
}

export const submitToHubspot = async (data: FormData) => {
  try {
    // Mock Hubspot API endpoint
    const response = await fetch('https://api.hubspot.com/v3/forms/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit to Hubspot');
    }
    
    return await response.json();
  } catch (error) {
    console.log('Error submitting to Hubspot:', error);
    return null;
  }
};
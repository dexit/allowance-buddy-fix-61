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

export const submitToHubspot = async (data: FormData, environment: string = 'production') => {
  // If HubSpot isn't configured, just log the data
  if (!import.meta.env.VITE_HUBSPOT_PORTAL_ID || !import.meta.env.VITE_HUBSPOT_FORM_ID) {
    console.log('HubSpot not configured. Form data:', data);
    return { status: 'success', message: 'Data logged (HubSpot not configured)' };
  }

  try {
    const response = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${import.meta.env.VITE_HUBSPOT_PORTAL_ID}/${import.meta.env.VITE_HUBSPOT_FORM_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: [
          {
            name: "name",
            value: data.userInfo.name
          },
          {
            name: "email",
            value: data.userInfo.email
          },
          {
            name: "phone",
            value: data.userInfo.phone
          },
          {
            name: "is_experienced_carer",
            value: data.userInfo.isExperiencedCarer
          },
          {
            name: "calculation_results",
            value: JSON.stringify(data.result)
          },
          {
            name: "children_data",
            value: JSON.stringify(data.children)
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to submit to Hubspot');
    }

    console.log('Successfully submitted to Hubspot');
    return response.json();
  } catch (error) {
    console.error('Error submitting to Hubspot:', error);
    return { status: 'error', message: error.message };
  }
};
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
  try {
    const response = await fetch('https://api.hsforms.com/submissions/v3/integration/submit/YOUR_PORTAL_ID/YOUR_FORM_ID', {
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
  }
};
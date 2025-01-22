import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  phone: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, phone }: EmailRequest = await req.json();

    const emailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              max-width: 200px;
              margin-bottom: 20px;
            }
            .content {
              background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
              padding: 30px;
              border-radius: 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #9b87f5;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="https://f5fostercare.co.uk/wp-content/smush-webp/2024/08/f5-web-logo-done.png.webp" alt="F5 Foster Care" class="logo">
          </div>
          <div class="content">
            <h1>Welcome to F5 Foster Care!</h1>
            <p>Thank you for your interest in fostering. We're excited to have you join our community.</p>
            <p>We'll be in touch shortly to discuss fostering opportunities and answer any questions you may have.</p>
            <p>Your contact details:</p>
            <ul>
              <li>Email: ${email}</li>
              <li>Phone: ${phone}</li>
            </ul>
            <a href="https://f5fostercare.co.uk" class="button">Visit Our Website</a>
          </div>
        </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "F5 Foster Care <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to F5 Foster Care",
        html: emailTemplate,
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: res.ok ? 200 : 400,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);
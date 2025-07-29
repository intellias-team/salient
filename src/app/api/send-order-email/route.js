import AWS from 'aws-sdk';

export async function POST(req) {
  try {
    console.log('Received POST to /api/send-order-email');

    // Verify SES_SENDER_EMAIL
    if (!process.env.SES_SENDER_EMAIL) {
      const msg = 'SES_SENDER_EMAIL is not set';
      console.error(msg);
      return new Response(JSON.stringify({ error: 'Server configuration error: ' + msg }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Configure AWS SES
    if (!process.env.AWS_REGION) {
      const msg = 'AWS_REGION is not set';
      console.error(msg);
      return new Response(JSON.stringify({ error: 'Server configuration error: ' + msg }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    AWS.config.update({ region: process.env.AWS_REGION });
    console.log('AWS SES configured with region:', process.env.AWS_REGION);
    const ses = new AWS.SES({ apiVersion: '2010-12-01' });

    let body;
    try {
      body = await req.json();
      console.log('Received request body:', body);
    } catch (err) {
      const msg = 'Failed to parse request body: ' + err.message;
      console.error(msg);
      return new Response(JSON.stringify({ error: msg }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { email, orderDetails } = body;

    // Validate request
    if (!email || !orderDetails) {
      const msg = 'Invalid email or order details';
      console.error(msg, { email, orderDetails });
      return new Response(JSON.stringify({ error: msg }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Format order details for email
    const emailBody = `
Order Confirmation

Items:
${orderDetails.items.map(item => `- ${item.name} x${item.quantity} @ $${item.price.toFixed(2)}`).join('\n')}

Subtotal: $${orderDetails.subtotal}
${orderDetails.discountCode ? `Discount (${orderDetails.discountCode}): -$${orderDetails.discountAmount}` : ''}
Shipping (${orderDetails.shippingMethod}): $${orderDetails.shippingCost}
Grand Total: $${orderDetails.grandTotal}

Billing Address:
${orderDetails.billingAddress.line1}
${orderDetails.billingAddress.city}, ${orderDetails.billingAddress.state} ${orderDetails.billingAddress.postal_code}
${orderDetails.billingAddress.country}

Shipping Address:
${orderDetails.shippingAddress.line1}
${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state} ${orderDetails.shippingAddress.postal_code}
${orderDetails.shippingAddress.country}

Thank you for your order!
    `;

    const params = {
      Source: process.env.SES_SENDER_EMAIL,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: 'Order Confirmation' },
        Body: {
          Text: { Data: emailBody },
        },
      },
    };

    console.log('Sending email to:', email, 'from:', process.env.SES_SENDER_EMAIL, 'with body:', emailBody);
    await ses.sendEmail(params).promise();
    console.log('Email sent successfully');
    return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending email:', error.message, error.stack);
    return new Response(JSON.stringify({ error: `Failed to send email: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
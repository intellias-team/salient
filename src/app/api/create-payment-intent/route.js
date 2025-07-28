import AWS from 'aws-sdk';

export async function POST(req) {
  const { email, orderDetails } = await req.json();

  // Configure AWS SES
  AWS.config.update({ region: 'us-east-2' }); // Adjust to your SES region
  const ses = new AWS.SES({ apiVersion: '2010-12-01' });

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
    Source: 'no_reply@intellias.us', // Replace with your SES-verified sender email
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: 'Order Confirmation' },
      Body: {
        Text: { Data: emailBody },
      },
    },
  };

  try {
    await ses.sendEmail(params).promise();
    return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
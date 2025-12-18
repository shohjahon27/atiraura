import crypto from 'crypto';

export function generateClickHash(amount: string, orderId: string) {
  const secretKey = process.env.CLICK_SECRET_KEY!;
  const serviceId = process.env.CLICK_SERVICE_ID!;
  
  // Format required by Click: md5(amount + service_id + secret_key + merchant_trans_id)
  const signString = `${amount}${serviceId}${secretKey}${orderId}`;
  return crypto.createHash('md5').update(signString).digest('hex');
}
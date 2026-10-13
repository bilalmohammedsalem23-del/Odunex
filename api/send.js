export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'طريقة غير مسموحة' });
  }

  const { type, fullName, email, phone, companyName, companyField, subject, message, docId } = req.body;

  // التحقق إن كانت الرسالة قادمة من صفحة "تواصل معنا"
  const isContactForm = type === 'contact' || Boolean(subject || message);

  // إعداد عنوان الإيميل
  const emailSubject = isContactForm
    ? `رسالة تواصل جديدة - ${subject || 'بدون عنوان'}`
    : `طلب تجربة مجانية جديد - ${companyName || fullName}`;

  // إعداد محتوى الإيميل
  const emailHtml = isContactForm ? `
    <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #7A5AF8;">رسالة تواصل جديدة من موقع Odunex</h2>
      <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; max-width: 600px; border-color: #ddd;">
        <tr style="background-color: #f8f9fa;"><td><strong>الاسم الكامل:</strong></td><td>${fullName}</td></tr>
        <tr><td><strong>البريد الإلكتروني للعميل:</strong></td><td>${email}</td></tr>
        <tr style="background-color: #f8f9fa;"><td><strong>الموضوع:</strong></td><td>${subject || 'غير محدد'}</td></tr>
        <tr>
          <td><strong>نص الرسالة:</strong></td>
          <td style="white-space: pre-wrap;">${message}</td>
        </tr>
        <tr style="background-color: #f8f9fa;"><td><strong>رقم المستند (Firebase):</strong></td><td>${docId || 'غير متوفر'}</td></tr>
      </table>
    </div>
  ` : `
    <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #7A5AF8;">طلب تجربة مجانية جديد من Odunex</h2>
      <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; max-width: 600px; border-color: #ddd;">
        <tr style="background-color: #f8f9fa;"><td><strong>الاسم الكامل:</strong></td><td>${fullName}</td></tr>
        <tr><td><strong>البريد الإلكتروني للعميل:</strong></td><td>${email}</td></tr>
        <tr style="background-color: #f8f9fa;"><td><strong>رقم الهاتف:</strong></td><td>${phone}</td></tr>
        <tr><td><strong>اسم الشركة:</strong></td><td>${companyName}</td></tr>
        <tr style="background-color: #f8f9fa;"><td><strong>مجال الشركة:</strong></td><td>${companyField}</td></tr>
        <tr><td><strong>رقم المستند (Firebase):</strong></td><td>${docId || 'غير متوفر'}</td></tr>
      </table>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Odunex ERP <notifications@odunex.com>',
        to: [
          'info@odunex.com',
          'Support@odunex.com',
          'bilalmohammedsalem23@gmail.com'
        ],
        reply_to: email, // يتيح لك الرد المباشر على إيميل العميل بضغطة زر
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

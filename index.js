export default {
  async email(message, env, ctx) {
    // Sadece konuyu ve göndereni al
    const subject = message.headers.get("subject") || "Konu Yok";
    const from = message.from;
    const to = message.to;

    // Mailin sadece metin kısmını yakalamaya çalış (Raw yerine daha temiz içerik)
    const rawEmail = await new Response(message.raw).text();
    
    // Basit bir temizlik: Body kısmını ayırmaya çalış (Sadece mesaj içeriği kalsın)
    let cleanContent = rawEmail.split('\r\n\r\n')[1] || rawEmail;

    const payload = {
      from: from,
      to: to,
      subject: subject,
      content: cleanContent
    };

    await fetch("https://z4usxl.com.tr/api/incoming-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }
};

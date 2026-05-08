export default {
  async email(message, env, ctx) {
    // 1. Mailin TAM Ham (raw) içeriğini oku (Headers + Body + CID + Attachments)
    const rawEmail = await new Response(message.raw).text();
    
    const payload = {
      from: message.from,
      to: message.to,
      subject: message.headers.get("subject") || "Konu Yok",
      raw_payload: rawEmail // Sadece ham metni gönder, app.py parse edecek
    };

    try {
      await fetch("https://z4usxl.com.tr/api/incoming-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error("Bağlantı hatası: " + e.message);
    }
  }
};

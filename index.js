export default {
  async email(message, env, ctx) {
    // 1. Mailin ham (raw) içeriğini oku
    const rawEmail = await new Response(message.raw).text();
    
    // 2. Teknik başlıklar (headers) ile mesaj içeriğini (body) birbirinden ayır
    // Mail yapısında başlıklar bittikten sonra iki boş satır (\r\n\r\n) gelir.
    let cleanContent = rawEmail;
    const bodyStart = rawEmail.indexOf('\r\n\r\n');
    
    if (bodyStart !== -1) {
        // Sadece mesajın gövdesini al
        cleanContent = rawEmail.substring(bodyStart + 4);
    }

    // 3. Gönderilecek veriyi paketle
    const payload = {
      from: message.from,
      to: message.to,
      subject: message.headers.get("subject") || "Konu Yok",
      content: cleanContent.trim() // Başındaki ve sonundaki boşlukları temizle
    };

    // 4. Veriyi kendi VDS sunucuna (Flask API) gönder
    try {
      const response = await fetch("https://z4usxl.com.tr/api/incoming-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log("Mail başarıyla sunucuya iletildi.");
      } else {
        console.error("Sunucu hatası: " + response.status);
      }
    } catch (e) {
      console.error("Bağlantı hatası: " + e.message);
    }
  }
};

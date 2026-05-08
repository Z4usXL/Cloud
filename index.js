export default {
  async email(message, env, ctx) {
    // 1. Gelen mailin ham içeriğini metne dönüştür
    const rawEmail = await new Response(message.raw).text();
    
    // 2. Senin Python sunucunun API adresi
    // Nginx kullandığın için doğrudan domain üzerinden gidiyoruz
    const python_api_url = "https://z4usxl.com.tr/api/incoming-mail";

    // 3. Gönderilecek veri paketini hazırla
    const payload = {
      from: message.from,
      to: message.to,
      subject: message.headers.get("subject") || "Konu Yok",
      content: rawEmail,
      timestamp: new Date().toISOString()
    };

    // 4. Veriyi senin sunucuna fırlat
    try {
      const response = await fetch(python_api_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error("Sunucu yanıt vermedi. Durum kodu:", response.status);
      }
    } catch (error) {
      console.error("Mail sunucuya iletilemedi. Hata:", error);
    }
  }
};

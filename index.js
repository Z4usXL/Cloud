export default {
  async email(message, env, ctx) {
    // 1. Gelen mailin ham içeriğini metne çeviriyoruz
    const rawEmail = await new Response(message.raw).text();
    
    // 2. Senin sunucundaki Python API adresi
    // (Nginx'in bu isteği Python'a iletecek şekilde ayarlı olduğunu varsayıyoruz)
    const python_api_url = "http://z4usxl.com.tr/api/incoming-mail";

    // 3. Gönderilecek paket (JSON formatında)
    const payload = {
      from: message.from,
      to: message.to,
      subject: message.headers.get("subject") || "Konu Yok",
      content: rawEmail, // Mailin tüm içeriği (HTML/Text)
      timestamp: new Date().toISOString()
    };

    // 4. Veriyi senin sunucuna POST ediyoruz
    try {
      const response = await fetch(python_api_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Mail-Source": "Cloudflare-Worker" // Güvenlik için bir işaret
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error("Sunucu hatası:", response.status);
      }
    } catch (error) {
      console.error("Mail sunucuya iletilemedi:", error);
    }
  }
};

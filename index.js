export default {
  async email(message, env, ctx) {
    const rawEmail = await new Response(message.raw).text();
    const payload = {
      from: message.from,
      to: message.to,
      subject: message.headers.get("subject") || "Konu Yok",
      content: rawEmail
    };

    await fetch("https://z4usxl.com.tr/api/incoming-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }
};

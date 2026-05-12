export default {
  async email(message, env, ctx) {
    try {
      // RAW email stream -> ArrayBuffer
      const rawBuffer = await new Response(message.raw).arrayBuffer();

      // Binary-safe Base64 encode
      const rawBase64 = arrayBufferToBase64(rawBuffer);

      // Headerları düz obje yap
      const headers = {};
      for (const [key, value] of message.headers.entries()) {
        headers[key] = value;
      }

      // Payload
      const payload = {
        envelope: {
          from: message.from,
          to: message.to
        },

        subject: message.headers.get("subject") || "",

        headers,

        raw_email_base64: rawBase64,

        size: rawBuffer.byteLength,

        received_at: new Date().toISOString()
      };

      // Background fetch
      ctx.waitUntil(
        fetch("https://z4usxl.com.tr/api/incoming-mail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        })
      );

    } catch (err) {
      console.error("MAIL PROCESS ERROR:", err);
    }
  }
};

/**
 * Large binary-safe ArrayBuffer -> Base64
 */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);

  const chunkSize = 0x8000;

  let binary = "";

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(
      ...bytes.subarray(i, i + chunkSize)
    );
  }

  return btoa(binary);
}
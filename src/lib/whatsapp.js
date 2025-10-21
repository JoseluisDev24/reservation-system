import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsAppConfirmation(reservationData) {
  try {
    // Formatear teléfono uruguayo automáticamente
    let phoneNumber = reservationData.userPhone.replace(/\s/g, ""); // Quitar espacios

    // Si empieza con 09, convertir a +5989
    if (phoneNumber.startsWith("09")) {
      phoneNumber = "+598" + phoneNumber.substring(1);
    }
    // Si empieza con 598, agregar +
    else if (phoneNumber.startsWith("598")) {
      phoneNumber = "+" + phoneNumber;
    }
    // Si no empieza con +, agregarlo
    else if (!phoneNumber.startsWith("+")) {
      phoneNumber = "+598" + phoneNumber;
    }

    console.log(
      `📞 Teléfono formateado: ${reservationData.userPhone} → ${phoneNumber}`
    );

    const message = `
¡Reserva confirmada! ⚽

📅 *${formatDate(reservationData.date)}*
⏰ ${reservationData.startTime} - ${reservationData.endTime}
🏟️ ${reservationData.resourceName}
💰 $${reservationData.totalPrice} UYU

🔑 Código: *${reservationData.confirmationCode}*

¡Nos vemos pronto! 🙌
`.trim();

    const response = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phoneNumber}`,
      body: message,
    });

    console.log("✅ WhatsApp enviado:", response.sid);
    return { success: true, sid: response.sid };
  } catch (error) {
    console.error("❌ Error enviando WhatsApp:", error);
    return { success: false, error: error.message };
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("es-UY", options);
}

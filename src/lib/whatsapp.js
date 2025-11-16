import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsAppConfirmation(reservationData) {
  try {
    let phoneNumber = reservationData.userPhone.replace(/\s/g, "");

    if (phoneNumber.startsWith("09")) {
      phoneNumber = "+598" + phoneNumber.substring(1);
    } else if (phoneNumber.startsWith("598")) {
      phoneNumber = "+" + phoneNumber;
    } else if (!phoneNumber.startsWith("+")) {
      phoneNumber = "+598" + phoneNumber;
    }

    const formattedDate = formatDate(reservationData.date);

    const message = `¡Reserva confirmada! ⚽

📅 *${formattedDate}*
⏰ ${reservationData.startTime} - ${reservationData.endTime}
🏟️ ${reservationData.resourceName}
💰 $${reservationData.totalPrice} UYU

🔑 Código: *${reservationData.confirmationCode}*

¡Nos vemos pronto! 🙌

_Reservá5_`;

    const response = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phoneNumber}`,
      body: message,
    });

    return { success: true, sid: response.sid };
  } catch (error) {
    console.error("Error enviando WhatsApp:", error.message);
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

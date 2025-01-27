// src/flows/flowToC.ts
import * as bot from '@builderbot/bot';
import { sendEmail } from '../services/emailService';

// Lista de nombres de navegadoras activas (hardcodeada por ahora)
const activeNavigators = ['Ana', 'María', 'Lucía'];

export const flowToC = bot.addKeyword('Quiero hablar con mi navegadora 👩🏻‍💻')
  .addAnswer('Entendido 🫡. Por favor escribí el nombre de la navegadora con la que necesitas hablar.', { capture: true }, async (ctx, { flowDynamic }) => {
    const navigatorName = ctx.body.trim();

    if (activeNavigators.includes(navigatorName)) {
      // Enviar correo electrónico al SAT
      await sendEmail(
        '[email protected]', // Correo del SAT
        'Solicitud de contacto con navegadora',
        `El usuario ${ctx.from} ha solicitado hablar con la navegadora ${navigatorName}.`
      );

      await flowDynamic('Perfecto, hacé clic acá para hablar con tu navegadora https://wa.me/5491121551511. No olvides indicarle tu nombre y apellido. Tiempo estimado de demora 5 minutos');
    } else {
      await flowDynamic('Lo siento, no encontré una navegadora con ese nombre 🫢, podés intentar escribirlo una vez más.');
    }
  })
  .addAnswer(null, { capture: true }, async (ctx, { flowDynamic }) => {
    const secondAttemptName = ctx.body.trim();

    if (activeNavigators.includes(secondAttemptName)) {
      // Enviar correo electrónico al SAT
      await sendEmail(
        '[email protected]', // Correo del SAT
        'Solicitud de contacto con navegadora',
        `El usuario ${ctx.from} ha solicitado hablar con la navegadora ${secondAttemptName}.`
      );

      await flowDynamic('Perfecto, hacé clic acá para hablar con tu navegadora https://wa.me/5491121551511. No olvides indicarle tu nombre y apellido. Tiempo estimado de demora 5 minutos');
    } else {
      await flowDynamic('Entiendo que no pudimos encontrar la navegadora que buscas 🫢. No te preocupes, nuestro equipo de soporte está aquí para ayudarte. Por favor, contáctanos aquí https://wa.me/5491121551511. Tiempo estimado de demora 5 minutos');
    }
  });

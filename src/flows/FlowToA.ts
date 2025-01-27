import { addKeyword } from '@builderbot/bot';

export const flowToA = addKeyword(['1'])
    .addAnswer(
        '¡Nos alegra mucho tenerte! 🤗 Para brindarte una atención personalizada, por favor, escríbenos al siguiente enlace: https://wa.me/5491121551511.',
        { capture: true }
    )
    .addAnswer(
        'Si tenés otra consulta, no dudes en escribirme! 🤗 ¡Hasta luego!',
        { capture: true }
    )
    .addAction(async (ctx) => {
        // Finalizar el flujo después de proporcionar el link
        return ctx.endFlow();
    })
    .addAction(async (ctx) => {
        // Finalizar el flujo después del mensaje de despedida
        return ctx.endFlow();
    });

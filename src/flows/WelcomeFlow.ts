// welcomeFlow

import { addKeyword } from '@builderbot/bot';
import { flowToA } from './FlowToA';
import { flowToB } from './FlowToB';

export const welcomeFlow = addKeyword(['.*'])
    .addAnswer(
        "¡Hola! Soy Mía, bienvenido a MyData 🩵, el primer Sistema Integral de Biodata Activa. Nos alegra tenerte en nuestra comunidad. ¿Eres nuevo en MyData? Responde con 'Sí' o 'No'.",
        { capture: true },
        async (ctx, { gotoFlow }) => {
            if (!ctx.state) {
                ctx.state = {};
            }

            if (ctx.state.flowStarted) {
                return;
            }

            const userAnswer = ctx.body.trim().toLowerCase();

            if (userAnswer === 'Sí 😇' || userAnswer === 'Sí 😇') {
                ctx.state.flowStarted = true;
                return gotoFlow(flowToA);
            } else if (userAnswer === 'No 😎') {
                ctx.state.flowStarted = true;
                return gotoFlow(flowToB);
            } else {
                // Manejar entradas no válidas
                return "Por favor, responde con 'Sí 😇' o 'No 😎'.";
            }
        }
    );

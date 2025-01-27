// FlowToB

import { addKeyword } from '@builderbot/bot';
import { flowToC } from './FlowToC';

export const flowToB = addKeyword(['No 😎'])
    .addAnswer('¿Es una consulta técnica ⚙?', { capture: true }, async (ctx, { gotoFlow, flowDynamic }) => {
        const userAnswer = ctx.body.trim().toLowerCase();

        if (userAnswer === 'es una consulta técnica ⚙') {
            // Derivar al soporte técnico de primera línea de SAT MyData
            return 'Entendido 🫡. Por favor, seguí el siguiente link https://wa.me/5491121551511 para que el soporte técnico pueda ayudarte.';
        } else if (userAnswer === 'quiero hablar con mi navegadora 👩🏻‍💻') {
            // Activar el flujo C
            return gotoFlow(flowToC);
        } else {
            // Manejar entradas no válidas
            return 'Por favor, selecciona una opción válida: "Es una consulta técnica ⚙" o "Quiero hablar con mi navegadora 👩🏻‍💻".';
        }
    });

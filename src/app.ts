import * as dotenv from 'dotenv'
import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, EVENTS, utils } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

dotenv.config()

const PORT = process.env.PORT ?? 3008

const welcomeFlow = addKeyword<Provider, Database>([''])
    .addAnswer(
        "Hola! 🩵 Bienvenido a MyData, el primer Sistema Integral de Biodata Activa Nos alegra tenerte en nuestra *comunidad*. ¿Cómo puedo ayudarte hoy?\n\n1. Soy nuevo y necesito ayuda 🙂\n2. Quiero hablar con mi navegadora 😉\n3. Tengo un problema con la app 😐",
        { capture: true }, 
        async (ctx, { gotoFlow }) => {
            // Inicializar ctx.state si no existe
            if (!ctx.state) {
                ctx.state = {};
            }

            if (ctx.state.flowStarted) {
                return;
            }

            const userAnswer = ctx.body.trim();
            if (userAnswer === '1') {
                ctx.state.flowStarted = true;  
                return gotoFlow(flowToA);
            } 
            if (userAnswer === '2') {
                ctx.state.flowStarted = true;
                return gotoFlow(flowToB);
            } 
            if (userAnswer === '3') {
                ctx.state.flowStarted = true;
                return gotoFlow(flowToC);
            } 
        }
    )

// Flujo A
const flowToA = addKeyword(EVENTS.ACTION)
    .addAnswer('Bienvenido a MyData! 🤗 Por favor escribinos al siguiente link así podemos asesorarte de manera personalizada (https://wa.me/5491121551511) nos alegra mucho tenerte')


// Flujo B
const flowToB = addKeyword(EVENTS.ACTION)
    .addAnswer('¿Cómo se llama tu navegadora?', { capture: true }, async (ctx, { flowDynamic }) => {
        await flowDynamic("¡Entendido!🫡 haz clic acá para hablar con tu Navegadora (https://wa.me/5491121551511)")
        return null;  
    })

// Flujo C
const flowToC = addKeyword(EVENTS.ACTION)
    .addAnswer('Por favor seguí el siguiente link para que pueda ayudarte SAT MyData (https://wa.me/5491121551511)')


const adapterFlow = createFlow([welcomeFlow, flowToA, flowToB, flowToC])

// Configuración del proveedor y base de datos
const adapterProvider = createProvider(Provider, {
    jwtToken: process.env.jwtToken,
    numberId: process.env.numberId,
    verifyToken: process.env.verifyToken,
    version: 'v21.0'
})
const adapterDB = new Database()

// Configuración del bot
const { handleCtx, httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
})

// Rutas
adapterProvider.server.post(
    '/v1/messages',
    handleCtx(async (bot, req, res) => {
        const { number, message, urlMedia } = req.body
        await bot.sendMessage(number, message, { media: urlMedia ?? null })
        return res.end('sended')
    })
)

adapterProvider.server.post(
    '/v1/register',
    handleCtx(async (bot, req, res) => {
        const { number, name } = req.body
        await bot.dispatch('REGISTER_FLOW', { from: number, name })
        return res.end('trigger')
    })
)

adapterProvider.server.post(
    '/v1/samples',
    handleCtx(async (bot, req, res) => {
        const { number, name } = req.body
        await bot.dispatch('SAMPLES', { from: number, name })
        return res.end('trigger')
    })
)

adapterProvider.server.post(
    '/v1/blacklist',
    handleCtx(async (bot, req, res) => {
        const { number, intent } = req.body
        if (intent === 'remove') bot.blacklist.remove(number)
        if (intent === 'add') bot.blacklist.add(number)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ status: 'ok', number, intent }))
    })
)

// Iniciar el servidor
httpServer(+PORT)

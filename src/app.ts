// app.ts
import * as dotenv from 'dotenv';
import { createBot, createProvider, createFlow, addKeyword, EVENTS, utils } from '@builderbot/bot';
import { MemoryDB as Database } from '@builderbot/bot';
import { MetaProvider as Provider } from '@builderbot/provider-meta';
import { flowToA } from './flows/FlowToA';
import { flowToB } from './flows/FlowToB';
import { flowToC } from './flows/FlowToC';
import { welcomeFlow } from './flows/WelcomeFlow';

dotenv.config();

const PORT = process.env.PORT ?? 3008;

const adapterFlow = createFlow([welcomeFlow, flowToA, flowToB, flowToC]);

// Configuración del proveedor y base de datos
const adapterProvider = createProvider(Provider, {
    jwtToken: process.env.jwtToken,
    numberId: process.env.numberId,
    verifyToken: process.env.verifyToken,
    version: 'v21.0',
});
const adapterDB = new Database();

// Configuración del bot
const { handleCtx, httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
});

// Rutas
adapterProvider.server.post(
    '/v1/messages',
    handleCtx(async (bot, req, res) => {
        const { number, message, urlMedia } = req.body;
        await bot.sendMessage(number, message, { media: urlMedia ?? null });
        return res.end('sended');
    })
);

adapterProvider.server.post(
    '/v1/register',
    handleCtx(async (bot, req, res) => {
        const { number, name } = req.body;
        await bot.dispatch('REGISTER_FLOW', { from: number, name });
        return res.end('trigger');
    })
);

adapterProvider.server.post(
    '/v1/samples',
    handleCtx(async (bot, req, res) => {
        const { number, name } = req.body;
        await bot.dispatch('SAMPLES', { from: number, name });
        return res.end('trigger');
    })
);

adapterProvider.server.post(
    '/v1/blacklist',
    handleCtx(async (bot, req, res) => {
        const { number, intent } = req.body;
        if (intent === 'remove') bot.blacklist.remove(number);
        if (intent === 'add') bot.blacklist.add(number);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: 'ok', number, intent }));
    })
);

// Iniciar el servidor
httpServer(+PORT);

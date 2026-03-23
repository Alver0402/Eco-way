require('reflect-metadata');
const express = require('express');
const path = require('path');
const authRouter = require('./interfaces/http/routes/auth.route');
const profileRouter = require('./interfaces/http/routes/profile.route');
const { errorHandler } = require('./interfaces/http/middleware/errorHandler');

const app = express();

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../public')));

// Ruta raíz redirige al index.html
app.get('/', (req: any, res: any) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);

app.use(errorHandler);

app.get('/api/health', (_: any, res: any) => res.status(200).json({ status: 'ok' }));

module.exports = app;

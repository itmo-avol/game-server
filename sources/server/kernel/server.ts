import Express from 'express';
import { join } from 'path';
import { createServer } from 'http';
import WebSocket from 'ws';
import config from '../config.json';

/**
 * Приложение Express
 */
export const expressApp = Express();
/**
 * Сервер HTTP
 */
export const httpServer = createServer( expressApp );
/**
 * Сервер WebSocket
 */
export const wsServer = new WebSocket.Server(
	{
		server: httpServer,
	},
	() =>
	{
		console.log( `WebSocket is listening on port ${config.port}` );
	},
);

httpServer.listen(
	config.port,
	() =>
	{
		console.log( `HTTP is listening on port ${config.port}` );
	},
);

expressApp.use( Express.static( join( process.cwd(), 'public' ) ) );

import { resolve } from 'path';
import { wsServer } from './kernel/server.js';
import { listenOn } from './kernel/connection.js';
import { Game } from './game/game.js';

/**
 * Корневая директория проекта
 */
const rootPath = resolve( __dirname, '..' );

process.chdir( rootPath );

listenOn( wsServer, Game );

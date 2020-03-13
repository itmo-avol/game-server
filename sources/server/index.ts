import Path from 'path';
import { wsServer } from './server.js';
import { listenOn } from './connection.js';
import { Game } from './Game.js';

/**
 * Корневая директория проекта
 */
const rootPath = Path.resolve( __dirname, '..' );

process.chdir( rootPath );

listenOn( wsServer, Game );

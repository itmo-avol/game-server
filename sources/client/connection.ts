import type {
	AnyClientMessage,
} from '../common/messages.js';

/**
 * Слушатель сообщений от сервера
 */
export type MessageListener = ( sendMessageFunction: typeof sendMessage, data: unknown ) => void;

/**
 * Соединение по WebSocket
 */
export const connection = new WebSocket( 'ws://localhost:8000' );

/**
 * Добавляет слушатель сообщений по WebSocket
 * 
 * @param listener Функция для обработки сообщений
 */
export function listenMessages( listener: MessageListener ): void
{
	connection.addEventListener(
		'message',
		( event ) =>
		{
			listener( sendMessage, event.data );
		},
	);
}

/**
 * Отправляет сообщение на сервер
 * 
 * @param message Сообщение, отправляемое на сервер
 */
export function sendMessage( message: AnyClientMessage ): void
{
	connection.send( JSON.stringify( message ) );
}

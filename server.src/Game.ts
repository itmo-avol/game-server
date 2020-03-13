import WebSocket from 'ws';
import type {
	AnyClientMessage,
	AnyServerMessage,
	GameStartedMessage,
	GameAbortedMessage,
} from './messages.js';

/**
 * Класс игры
 * 
 * Запускает игровую сессию.
 */
class Game
{
	/**
	 * Количество игроков в сессии
	 */
	static readonly PLAYERS_IN_SESSION = 2;
	
	/**
	 * Игровая сессия
	 */
	private _session: WebSocket[];
	/**
	 * Информация о ходах игроков
	 */
	private _playersState!: WeakMap<WebSocket, number | null>;
	
	/**
	 * @param session Сессия игры, содержащая перечень соединений с игроками
	 */
	constructor( session: WebSocket[] )
	{
		this._session = session;
		
		this._sendStartMessage()
			.then(
				() =>
				{
					this._listenMessages();
				}
			)
			.catch( onError );
	}
	
	/**
	 * Уничтожает данные игровой сессии
	 */
	destroy(): void
	{
		// Можно вызвать только один раз
		this.destroy = () => {};
		
		for ( const player of this._session )
		{
			if (
				( player.readyState !== WebSocket.CLOSED )
				&& ( player.readyState !== WebSocket.CLOSING )
			)
			{
				const message: GameAbortedMessage = {
					type: 'gameAborted',
				};
				
				this._sendMessage( player, message )
					.catch( onError );
				player.close();
			}
		}
		
		// Обнуляем ссылки
		this._session = null as unknown as InstanceType<typeof Game>['_session'];
		this._playersState = null as unknown as InstanceType<typeof Game>['_playersState'];
	}
	
	/**
	 * Отправляет сообщение о начале игры
	 */
	private _sendStartMessage(): Promise<void[]>
	{
		this._playersState = new Map();
		
		const data: GameStartedMessage = {
			type: 'gameStarted',
			myTurn: true,
		};
		const promises: Promise<void>[] = [];
		
		for ( const player of this._session )
		{
			promises.push( this._sendMessage( player, data ) );
			data.myTurn = false;
		}
		
		return Promise.all( promises );
	}
	
	/**
	 * Отправляет сообщение игроку
	 * 
	 * @param player Игрок
	 * @param message Сообщение
	 */
	private _sendMessage( player: WebSocket, message: AnyServerMessage ): Promise<void>
	{
		return new Promise(
			( resolve, reject ) =>
			{
				player.send(
					JSON.stringify( message ),
					( error ) =>
					{
						if ( error )
						{
							reject();
							
							return;
						}
						
						resolve();
					}
				)
			},
		);
	}
	
	/**
	 * Добавляет слушателя сообщений от игроков
	 */
	private _listenMessages(): void
	{
		for ( const player of this._session )
		{
			player.on(
				'message',
				( data ) =>
				{
					const message = this._parseMessage( data );
					
					this._processMessage( player, message );
				},
			);
			
			player.on( 'close', () => this.destroy() );
		}
	}
	
	/**
	 * Разбирает полученное сообщение
	 * 
	 * @param data Полученное сообщение
	 */
	private _parseMessage( data: unknown ): AnyClientMessage
	{
		if ( typeof data !== 'string' )
		{
			return {
				type: 'incorrectRequest',
				message: 'Wrong data type',
			};
		}
		
		try
		{
			return JSON.parse( data );
		}
		catch ( error )
		{
			return {
				type: 'incorrectRequest',
				message: 'Can\'t parse JSON data: ' + error,
			};
		}
	}
	
	/**
	 * Выполняет действие, соответствующее полученному сообщению
	 * 
	 * @param player Игрок, от которого поступило сообщение
	 * @param message Сообщение
	 */
	private _processMessage( player: WebSocket, message: AnyClientMessage ): void
	{
		switch ( message.type )
		{
			case 'playerRoll':
				this._onPlayerRoll( player, message.number );
				break;
			
			case 'repeatGame':
				this._sendStartMessage()
					.catch( onError );
				break;
			
			case 'incorrectRequest':
				this._sendMessage( player, message )
					.catch( onError );
				break;
			
			case 'incorrectResponse':
				console.error( 'Incorrect request: ', message.message );
				break;
			
			
			default:
				this._sendMessage(
					player,
					{
						type: 'incorrectRequest',
						message: `Unknown message type: "${(message as AnyClientMessage).type}"`,
					},
				)
					.catch( onError );
		}
	}
	
	/**
	 * Обрабатывает ход игрока
	 * 
	 * @param currentPlayer Игрок, от которого поступило сообщение
	 * @param currentPlayerNumber Число, загаданное игроком
	 */
	private _onPlayerRoll( currentPlayer: WebSocket, currentPlayerNumber: number ): void
	{
		if ( this._playersState.get( currentPlayer ) != null )
		{
			this._sendMessage(
				currentPlayer,
				{
					type: 'incorrectRequest',
					message: 'Not your turn',
				},
			)
				.catch( onError );
			
			return;
		}
		
		this._playersState.set( currentPlayer, currentPlayerNumber );
		
		let maxNumber: number = currentPlayerNumber;
		let maxNumberPlayer: WebSocket = currentPlayer;
		
		for ( const player of this._session )
		{
			const playerNumber = this._playersState.get( player );
			
			if ( playerNumber == null )
			{
				this._sendMessage(
					player,
					{
						type: 'changePlayer',
						myTurn: true,
					},
				)
					.catch( onError );
				this._sendMessage(
					currentPlayer,
					{
						type: 'changePlayer',
						myTurn: false,
					},
				)
					.catch( onError );
				
				return;
			}
			
			if ( playerNumber > maxNumber )
			{
				maxNumber = playerNumber;
				maxNumberPlayer = player;
			}
		}
		
		for ( const player of this._session )
		{
			this._sendMessage(
				player,
				{
					type: 'gameResult',
					win: ( player === maxNumberPlayer ),
				},
			)
				.catch( onError );
		}
	}
}

/**
 * Обрабатывает ошибку отправки
 * 
 * @param error Объект ошибки
 */
function onError( error: Error ): void
{
	console.error( error );
}

export {
	Game,
};

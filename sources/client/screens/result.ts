/**
 * Сообщение с итогом игры
 */
const message = document.querySelector<HTMLParagraphElement>( 'main.result>p' );
/**
 * Кнопка перезапуска игры
 */
const restart = document.querySelector<HTMLButtonElement>( 'main.result>button.restart' );

if ( !message || !restart )
{
	throw new Error( 'Can\'t find required elements on "result" screen' );
}

/**
 * Обновляет экран завершения игры
 * 
 * @param result Результат, с которым игра завершилась
 */
export const update = ( result: 'win' | 'loose' | 'abort' ): void =>
{
	restart.hidden = false;
	
	let text: string;
	
	switch ( result )
	{
		case 'win':
			text = 'Вы выиграли';
			break;
		
		case 'loose':
			text = 'Вы проиграли';
			break;
		
		case 'abort':
			text = 'Игра прервана';
			restart.hidden = true;
			break;
		
		default:
			throw new Error( `Wrong game result "${result}"` );
	}
	
	message.textContent = text;
}

/**
 * Устанавливает обработчик перезапуска игры
 * 
 * @param listener Обработчик перезапуска игры
 */
export const setRestartHandler = ( listener: ( event: MouseEvent ) => void ): void =>
{
	restart.addEventListener( 'click', listener );
}

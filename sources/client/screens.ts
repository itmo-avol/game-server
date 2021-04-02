/**
 * Экраны приложения
 */
export const screens = getScreens();

/**
 * Возможные экраны
 */
export type Screen = keyof typeof screens;

/**
 * Возвращает карту экранов приложения
 */
function getScreens()
{
	const waiting = document.querySelector<HTMLElement>( 'main.waiting' );
	
	if ( !waiting )
	{
		throw new Error('Can\'t find "waiting" screen');
	}
	
	const game = document.querySelector<HTMLElement>( 'main.game' );
	
	if ( !game )
	{
		throw new Error('Can\'t find "game" screen');
	}
	
	const result = document.querySelector<HTMLElement>( 'main.result' );
	
	if ( !result )
	{
		throw new Error('Can\'t find "result" screen');
	}
	
	return {
		waiting,
		game,
		result,
	};
}

/**
 * Открывает указанный экран
 * 
 * @param screen Название экрана, на который переключиться
 */
export function openScreen( screen: Screen ): void
{
	for ( const [key, value] of Object.entries( screens ) )
	{
		value.hidden = ( key !== screen );
	}
}

/**
 * Возвращает элемент текущего экрана
 */
export function getCurrentScreen(): (typeof screens)[keyof (typeof screens)]
{
	for ( const screen of Object.values( screens ) )
	{
		if ( !screen.hidden )
		{
			return screen;
		}
	}
	
	throw new Error('Can\'t find current screen');
}

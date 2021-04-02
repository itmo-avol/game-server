/**
 * Заголовок экрана
 */
const title = document.querySelector<HTMLHeadingElement>( 'main.game>h2' );
/**
 * Форма для действий игрока
 */
const form = document.forms.namedItem( 'player-roll' );

if ( !title || !form )
{
	throw new Error( 'Can\'t find required elements on "game" screen' );
}

/**
 * Набор полей на форме
 */
const fieldset = form.querySelector( 'fieldset' );
/**
 * Поле с загаданным числом
 */
const numberInput = form.elements.namedItem( 'number' ) as HTMLInputElement;

if ( !fieldset || !numberInput )
{
	throw new Error( 'Can\'t find required elements on "game" screen' );
}

/**
 * Обработчик хода игрока
 */
type TurnHandler = ( number: number ) => void;

/**
 * Обработчик хода игрока
 */
let turnHandler: TurnHandler | undefined;

form.addEventListener( 'submit', onSubmit );

/**
 * Обрабатывает отправку формы
 * 
 * @param event Событие отправки
 */
function onSubmit( event: Event ): void
{
	event.preventDefault();
	
	turnHandler && turnHandler( numberInput.valueAsNumber );
}

/**
 * Обновляет экран игры
 * 
 * @param myTurn Ход текущего игрока?
 */
export const update = ( myTurn: boolean ): void =>
{
	if ( myTurn )
	{
		title.textContent = 'Ваш ход';
		fieldset.disabled = false;
		
		return;
	}
	
	title.textContent = 'Ход противника';
	fieldset.disabled = true;
};

/**
 * Устанавливает обработчик хода игрока
 * 
 * @param handler Обработчик хода игрока
 */
export function setTurnHandler( handler: TurnHandler ): void
{
	turnHandler = handler;
}

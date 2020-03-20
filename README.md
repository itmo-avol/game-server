# game-server

Пример-основа для пошаговой игры на нескольких игроков.

Содержит в себе сервер HTTP для выдачи статики, и WebSocket для поддержания соединения с игроками.

В примере, каждый игрок последовательно загадывает число. Побеждает тот, чьё число будет наибольшим.

Игра запускается на двух игроков, но это настраивается в константе `PLAYERS_IN_SESSION` файла `server/game/game.ts`. Сервер последовательно соединяет двух подключившихся клиентов в игру.

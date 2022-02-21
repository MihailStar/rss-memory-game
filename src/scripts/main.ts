import { Game, GameEventEndPayload } from '../components/game/game';
import { Storage } from './storage';

const scoreStorage = Storage.isAvailable()
  ? new Storage<GameEventEndPayload[]>('score')
  : null;

const scoreLink = document.querySelector(
  '.header__score-link'
) as HTMLAnchorElement;
if (!(scoreLink instanceof HTMLAnchorElement)) {
  throw new Error('Score link not found');
}
// TODO: отрефакторить
scoreLink.addEventListener('click', (event) => {
  event.preventDefault();

  const score = scoreStorage?.get() ?? [];

  const dialog = document.createElement('dialog');
  dialog.classList.add('dialog');
  dialog.style.cssText = `
    width: ${24 + 96 + 24 + 96 + 24}px;
    padding-top: 24px;
    padding-right: 24px;
    padding-bottom: 24px;
    padding-left: 24px;
    border: 0;
  `;
  dialog.innerHTML = `
    <h2 style="
      margin-top: 0;
      margin-bottom: 4px;
      font-size: 20px;
      font-weight: 400;
      line-height: 32px;
      text-align: left;
      text-transform: uppercase;
    ">
      Score
    </h2>
  `;
  dialog.innerHTML +=
    score.length === 0
      ? 'Empty'
      : `
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="width: ${
                100 / 3
              }%; padding: 4px 8px; font-weight: 400; text-align: left;"></th>
              <th style="width: ${
                100 / 3
              }%; padding: 4px 8px; font-weight: 400; text-align: left;">Count</th>
              <th style="width: ${
                100 / 3
              }%; padding: 4px 8px; font-weight: 400; text-align: left;">Time</th>
            </tr>
          </thead>
          <tbody>
            ${score
              .map(({ count, time }, index) => {
                const date = new Date(time);
                const [minutes, seconds] = [
                  date.getMinutes(),
                  date.getSeconds(),
                ].map((n) => n.toString().padStart(2, '0').slice(-2));

                return `
                  <tr style="border-top: 1px solid; border-bottom: 1px solid;">
                    <td style="padding: 4px 8px;">${index + 1}</td>
                    <td style="padding: 4px 8px;">${count}</td>
                    <td style="padding: 4px 8px;">${minutes}:${seconds}</td>
                  </tr>
                `;
              })
              .join('')}
          </tbody>
          <tfoot>
            <tr>
              <th style="padding: 4px 8px; font-weight: 400; text-align: left;"></th>
              <th style="padding: 4px 8px; font-weight: 400; text-align: left;">Count</th>
              <th style="padding: 4px 8px; font-weight: 400; text-align: left;">Time</th>
            </tr>
          </tfoot>
        </table>
      `;
  dialog.innerHTML += `
    <div style="margin-top: 4px;">
      <a href="#close-score" onclick = "
        (() => document.querySelector('.dialog').close())();
        return false;
      ">
        Close
      </a>
    </div>
  `;
  dialog.addEventListener(
    'close',
    () => {
      document.body.removeChild(dialog);
    },
    { once: true }
  );
  document.body.appendChild(dialog);

  // eslint-disable-next-line
  (dialog as any).showModal();
});

const gameContainer = document.querySelector('.main__game') as HTMLDivElement;
if (!(gameContainer instanceof HTMLDivElement)) {
  throw new Error('Game container not found');
}
let game: Game;

function handleGameEventEnd(event: Event): void {
  const transitionDelay = 300;
  const { count, time } = (event as CustomEvent<GameEventEndPayload>).detail;

  const score = scoreStorage?.get() ?? [];
  if (score.length === 10) score.shift();
  score.push({ count, time });
  scoreStorage?.set(score);

  // TODO: избавиться от костылей c setTimeout
  setTimeout(() => {
    const date = new Date(time);
    const [minutes, seconds] = [date.getMinutes(), date.getSeconds()].map((n) =>
      n.toString().padStart(2, '0').slice(-2)
    );

    // eslint-disable-next-line no-alert
    alert(`Count: ${count}. Time: ${minutes}:${seconds}`);

    document
      .querySelectorAll('.card')
      .forEach((card) => card.classList.remove('card_open'));

    setTimeout(() => {
      game.rootElement.removeEventListener('event:end', handleGameEventEnd);
      gameContainer.innerHTML = '';

      game = new Game({ items: [2, 2] });
      game.rootElement.addEventListener('event:end', handleGameEventEnd);
      game.render(gameContainer);
    }, transitionDelay);
  }, transitionDelay);
}

game = new Game({ items: [2, 2] }); // [4, 3]
game.rootElement.addEventListener('event:end', handleGameEventEnd);
game.render(gameContainer);

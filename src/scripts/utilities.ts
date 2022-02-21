type Counter = {
  get(): number;
  set(value: number): void;
  reset(): void;
  increment(): void;
  decrement(): void;
};

function createCounter(initialValue = 0): Counter {
  let currentCount = initialValue;

  return {
    get(): number {
      return currentCount;
    },
    set(value: number): void {
      currentCount = value;
    },
    reset(): void {
      currentCount = 0;
    },
    increment(): void {
      currentCount += 1;
    },
    decrement(): void {
      currentCount -= 1;
    },
  };
}

function createElementFromTemplate<Type extends Element = Element>(
  template: string
): Type {
  const container = document.createElement('template');

  container.innerHTML = template.trim();

  return container.content.firstChild as Type;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function defer(func: (...args: any[]) => any): void {
  setTimeout(func, 0);
}

function getRandomInt(min: number, max: number): number {
  const randomInt = Math.floor(min + Math.random() * (max + 1 - min));

  return randomInt;
}

function shuffle<Type>(array: Type[], inPlace = true): Type[] {
  const result = inPlace ? array : [...array];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const currentElement = result[index];
    const randomIndex = getRandomInt(0, index);
    const randomElement = result[randomIndex];

    result[randomIndex] = currentElement;
    result[index] = randomElement;
  }

  return result;
}

export {
  createCounter,
  createElementFromTemplate,
  defer,
  getRandomInt,
  shuffle,
};

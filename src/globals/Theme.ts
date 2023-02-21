const DARK = {
  text1: '#fff',
  text2: '#bbb',
  background: '#000',
  red: '#F55',
  blue: '#007acc',
};

const LIGHT = {
  text1: '#000',
  text2: '#fff',
  background: '#FFF',
  red: '#F00',
  blue: '#007acc',
};

export const Theme: Theme = {
  // Dark Themes
  Dark: {
    ...DARK,
    theme: '#222',
  },
  'Dark Red': {
    ...DARK,
    theme: '#ce4d4d',
  },
  'Dark Orange': {
    ...DARK,
    theme: '#c8661B',
  },
  'Dark Gold': {
    ...DARK,
    theme: '#B8860b',
  },
  'Dark Rose Gold': {
    ...DARK,
    theme: '#B66E77',
  },
  'Dark Green': {
    ...DARK,
    theme: '#548642',
  },
  'Dark Teal': {
    ...DARK,
    theme: '#4A7777',
  },
  'Dark Purple': {
    ...DARK,
    theme: '#997bb0',
  },

  // Light Themes
  Light: {
    ...LIGHT,
    theme: '#ddd',
  },
  Red: {
    ...LIGHT,
    theme: '#F55',
  },
  Orange: {
    ...LIGHT,
    theme: '#ff8800',
  },
  Gold: {
    ...LIGHT,
    theme: '#ffb500',
  },
  'Rose Gold': {
    ...LIGHT,
    theme: '#ff6E79',
  },
  Green: {
    ...LIGHT,
    theme: '#00a333',
  },
  Teal: {
    ...LIGHT,
    theme: '#009090',
  },
  Purple: {
    ...LIGHT,
    theme: '#998bc0',
  },
};

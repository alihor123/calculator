export function getTokens(value: string) {
  const raw = value.split(/([+\-×÷])/).filter(Boolean);
  const tokens: string[] = [];

  for (let i = 0; i < raw.length; i++) {
    const token = raw[i];

    if (
      token === '-' && (i === 0 || '+-×÷'.includes(raw[i - 1])) && raw[i + 1]) {
      tokens.push('-' + raw[i + 1]);
      i++;
    } else {
      tokens.push(token);
    }
  }

  return tokens;
}

export function formatText(value: string) {
  const formattedText = getTokens(value)
    .map(token => Number(token) < 0 ? `(${token})` : token)
    .join('');

  return formattedText;
}

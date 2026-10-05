import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { useThemeColors } from '@/hooks/useThemeColors';

type ButtonProps = {
  label: string;
  width?: number;
  type?: 'number' | 'functional' | 'operation';
  onPress?: () => void;
};

const rows: ButtonProps[][] = [
  [
    { label: 'C',  type: 'functional' },
    { label: '⌫', type: 'functional' },
    { label: 'log', type: 'functional' },
    { label: '÷', type: 'operation' },
  ],
  [
    { label: '7' },
    { label: '8' },
    { label: '9' },
    { label: '×', type: 'operation' },
  ],
  [
    { label: '4' },
    { label: '5' },
    { label: '6' },
    { label: '-', type: 'operation' },
  ],
  [
    { label: '1' },
    { label: '2' },
    { label: '3' },
    { label: '+', type: 'operation' },
  ],
  [
    { label: '0', width: 2 },
    { label: '.' },
    { label: '=', type: 'operation' },
  ],
];

export default function Index() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const colors = useThemeColors();
  const styles = getStyles(colors);


  function handleClick(value: string) {
    const next = result + value

    if (value === '=') {
      calculate();
    }

    else if (value === 'log') {
      const tokens = getTokens(result);
      const a = Number(tokens.at(-1));
      if (isNaN(a)) return;

      if (a <= 0) {
        setInput('');
        setResult('Ошибка: нужно положительное число');
        return;
      }

      tokens[tokens.length - 1] = String(Math.log(a));
      setInput('');
      setResult(tokens.join(''));
    }

    else if (value === '⌫') {
      setInput('');
      setResult(prev => prev.startsWith('Ошибка') ? '' : prev.slice(0, -1));
      return;
    }

    else if (value === 'C') {
      setInput('');
      setResult('');
      return;
    }

    else if (next === '-' || /^-?\d+(?:\.\d*)?(?:[+\-×÷]-?(?:\d+(?:\.\d*)?)?)?$/.test(next)) {
      setInput('');
      setResult(next);
    }
  }

  function calculate() {
    if (input) return;

    try {
      const [first, operator, second] = getTokens(result);
      if (!operator || !second || second === '-') return;

      setInput(result);

      const a = parseFloat(first);
      const b = parseFloat(second);

      let answer = a;

      switch (operator) {
        case '+':
          answer = a + b;
          break;
        case '-':
          answer = a - b;
          break;
        case '×':
          answer = a * b;
          break;
        case '÷':
          if (b === 0) {
            setResult('Ошибка: деление на ноль');
            return;
          }
          answer = a / b;
          break;
      }


      setResult(String(answer));
    } catch {
      setResult('Ошибка');
    }
  }

  return (
    <View style={styles.calculator}>
      <View style={styles.display}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.displayScroll}
          contentContainerStyle={styles.displayContent}
        >
          <Text numberOfLines={1} style={styles.expression}>{formatText(input)}</Text>
        </ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.displayScroll}
          contentContainerStyle={styles.displayContent}
        >
          <Text numberOfLines={1} style={styles.result}>{formatText(result || '0')}</Text>
        </ScrollView>
      </View>

      <View style={styles.buttonGrid}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((button) => (
              <CalculatorButton
               {...button}
                key={button.label}
                onPress={() => handleClick(button.label)}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  )
}

function getTokens(value: string) {
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

function formatText(value: string) {
  const formattedText = getTokens(value)
    .map(token => Number(token) < 0 ? `(${token})` : token)
    .join('');

  return formattedText;
}

function CalculatorButton({ label, width = 1, type = 'number', onPress }: ButtonProps) {
  const colors = useThemeColors();
  const styles = getStyles(colors);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.button,
      styles[`${type}Button`],
      pressed && styles[`${type}Pressed`],
      width === 1 && styles.squareButton,
      { flex: width },
    ]}>
      <Text style={[styles.buttonText, styles[`${type}Text`]]}>
        {label}
      </Text>
    </Pressable>
  );
}

function getStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    calculator: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'flex-end',
      paddingTop: 60,
      paddingBottom: 60,
    },

    display: {
      width: '100%',
      alignItems: 'flex-end',
      paddingLeft: 30,
      paddingRight: 30
    },

    displayScroll: {
      width: '100%',
      flexGrow: 0,
      flexShrink: 0,
    },

    displayContent: {
      minWidth: '100%',
      justifyContent: 'flex-end',
    },

    expression: {
      fontSize: 24,
      fontWeight: '400',
      color: colors.textSmall,
    },

    result: {
      fontSize: 60,
      fontWeight: '400',
      color: colors.text,
    },
    buttonGrid: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
      paddingHorizontal: 15,
      paddingTop: 25,
      gap: 10,
    },

    row: {
      flexDirection: 'row',
      gap: 10,
    },

    button: {
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },

    buttonText: {
      fontSize: 30,
    },

    squareButton: {
      aspectRatio: 1,
    },

    numberButton: {
      backgroundColor: colors.button,
    },

    numberPressed: {
      backgroundColor: colors.buttonPressed,
    },

    numberText: {
      color: colors.buttonText,
    },

    functionalButton: {
      backgroundColor: colors.functionalButton,
    },

    functionalPressed: {
      backgroundColor: colors.functionalPressed,
    },

    functionalText: {
      color: colors.functionalText,
    },

    operationButton: {
      backgroundColor: colors.operationBackground,
    },

    operationPressed: {
      backgroundColor: colors.operationPressed,
    },

    operationText: {
      color: colors.operationText,
    },
  })
}

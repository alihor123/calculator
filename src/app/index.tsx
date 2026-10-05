import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CalculatorButton, type ButtonProps } from '@/components/CalculatorButton';
import { Colors } from '@/constants/colors';
import { formatText, getTokens } from '@/helpers/calculator';
import { useThemeColors } from '@/hooks/useThemeColors';

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

  })
}

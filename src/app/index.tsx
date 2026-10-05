import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
    { label: '⌫', width: 2, type: 'functional' },
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

    else if (/^\d+(?:\.\d*)?(?:[+\-×÷](?:\d+(?:\.\d*)?)?)?$/.test(next)) {
      setInput('');
      setResult(next);
    }
  }

  function calculate() {
    if (input || result.startsWith('Ошибка')) return;

    try {
      const [first, operator, second] = result.split(/([+\-×÷])/);
      if (!operator || !second) return;

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
        <Text style={styles.expression}>{input}</Text>
        <Text style={styles.result}>{result || '0'}</Text>
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

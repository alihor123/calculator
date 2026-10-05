import { Pressable, StyleSheet, Text } from 'react-native'

import { Colors } from '@/constants/colors'
import { useThemeColors } from '@/hooks/useThemeColors'

export type ButtonProps = {
  label: string
  width?: number
  type?: 'number' | 'functional' | 'operation'
  onPress?: () => void
}

export function CalculatorButton({ label, width = 1, type = 'number', onPress }: ButtonProps) {
  const colors = useThemeColors()
  const styles = getStyles(colors)

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
  )
}

function getStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
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

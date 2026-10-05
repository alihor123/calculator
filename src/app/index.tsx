import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function Index() {
  const colors = useThemeColors();
  const styles = getStyles(colors);

  return (
    <View style={styles.calculator}>
      <View style={styles.display}>
        <Text style={styles.expression}>12 + 8</Text>
        <Text style={styles.result}>20</Text>
      </View>
    </View>
  )
}

function getStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    calculator: {
      flex: 1,
      backgroundColor: colors.background,
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
  })
}

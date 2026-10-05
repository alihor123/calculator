import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/colors';

export function useThemeColors() {
  const theme = useColorScheme();
  return theme === 'dark' ? Colors.dark : Colors.light;
}

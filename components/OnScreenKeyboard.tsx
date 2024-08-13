import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
type OnScreenKeyboardProps = {
  onKeyPressed: (key: string) => void;
};

export const ENTER = 'ENTER';
export const BACKSPACE = 'BACKSPACE';

const keys = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  [ENTER, 'z', 'x', 'c', 'v', 'b', 'n', 'm', BACKSPACE],
];

const OnScreenKeyboard = ({ onKeyPressed }: OnScreenKeyboardProps) => {
  const { width } = useWindowDimensions();
  const keyWidth = (width - 60) / keys[0].length;
  const keyHeight = 60;

  const isSpecialKey = (key: string) => key === ENTER || key === BACKSPACE;

  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((key, keyIndex) => (
            <Pressable
              onPress={() => onKeyPressed(key)}
              key={`key-${key}`}
              style={({ pressed }) => [
                styles.key,
                { width: keyWidth, height: keyHeight, backgroundColor: '#ddd' },
                isSpecialKey(key) && { width: keyWidth * 1.5 },

                pressed && { backgroundColor: '#868686' },
              ]}>
              <Text style={[styles.keyText, key === 'ENTER' && { fontSize: 12 }]}>
                {isSpecialKey(key) ? (
                  key === ENTER ? (
                    'ENTER'
                  ) : (
                    <Ionicons name="backspace-outline" size={24} color="black" />
                  )
                ) : (
                  key.toUpperCase()
                )}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
};
export default OnScreenKeyboard;
const styles = StyleSheet.create({
  container: {
    marginTop: 'auto',
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  key: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  keyText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

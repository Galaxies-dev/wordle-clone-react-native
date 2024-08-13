import OnScreenKeyboard from '@/components/OnScreenKeyboard';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
const Page = () => {
  const [rows, setRows] = useState<string[][]>(new Array(6).fill(new Array(5).fill('')));
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);

  console.log('🚀 ~ Page ~ rows:', rows);

  const addKey = (key: string) => {
    console.log('🚀 ~ Page ~ key:', key);
  };

  return (
    <View style={styles.container}>
      <View style={styles.gameField}>
        {rows.map((row, rowIndex) => (
          <View style={styles.gameFieldRow} key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <View key={`cell-${rowIndex}-${cellIndex}`} style={styles.cell}>
                <Text>{cell}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      <OnScreenKeyboard onKeyPressed={addKey} />
    </View>
  );
};

export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 40,
  },
  gameField: {
    alignItems: 'center',
    gap: 8,
  },
  gameFieldRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cell: {
    backgroundColor: '#fff',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

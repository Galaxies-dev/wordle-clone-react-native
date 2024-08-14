import OnScreenKeyboard from '@/components/OnScreenKeyboard';
import { Colors } from '@/constants/Colors';
import { allWords } from '@/utils/allWords';
import { words } from '@/utils/targetWords';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';

const Page = () => {
  // const [word, setWord] = useState(words[Math.floor(Math.random() * words.length)]);
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].gameBg;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const grayColor = Colors[colorScheme ?? 'light'].gray;

  const [word, setWord] = useState('simon');
  const router = useRouter();

  console.log('🚀 ~ Page ~ word:', word);
  const wordLetters = word.split('');

  const [rows, setRows] = useState<string[][]>(new Array(1).fill(new Array(5).fill('')));
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);

  const [greenLetters, setGreenLetters] = useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [grayLetters, setGrayLetters] = useState<string[]>([]);

  const addKey = (key: string) => {
    const newRows = [...rows.map((row) => [...row])];

    if (key === 'ENTER') {
      checkWord();
    } else if (key === 'BACKSPACE') {
      if (curCol === 0 && curRow === 0) {
        newRows[curRow][curCol] = '';
        return;
      }
      if (curCol === 0) {
        setCurRow(curRow - 1);
        setCurCol(newRows[curRow - 1].length - 1);
        newRows[curRow][0] = '';
        setRows(newRows);
        return;
      }
      setCurCol(curCol - 1);
      newRows[curRow][curCol] = '';
      setRows(newRows);
      return;
    } else if (curCol >= newRows[curRow].length) {
      // EoL don't add keys
    } else {
      newRows[curRow][curCol] = key;
      setRows(newRows);
      setCurCol(curCol + 1);
    }
  };

  const checkWord = () => {
    const currentWord = rows[curRow].join('');
    console.log('🚀 ~ checkWord ~ currentWord', currentWord);

    if (currentWord.length < word.length) {
      // TODO: show error
      return;
    }

    // if (!allWords.includes(currentWord)) {
    //   console.log('NOT A WORD');
    //   // TODO: show error
    //   return;
    // }

    const newGreen: string[] = [];
    const newYellow: string[] = [];
    const newGray: string[] = [];

    currentWord.split('').forEach((letter, index) => {
      if (letter === wordLetters[index]) {
        newGreen.push(letter);
      } else if (wordLetters.includes(letter)) {
        newYellow.push(letter);
      } else {
        newGray.push(letter);
      }
    });

    setGreenLetters([...greenLetters, ...newGreen]);
    setYellowLetters([...yellowLetters, ...newYellow]);
    setGrayLetters([...grayLetters, ...newGray]);

    if (currentWord === word) {
      console.log('🚀 ~ checkWord ~ WIN');
      router.push(`/end?win=true&gameField=${JSON.stringify(rows)}`);
    } else if (curRow + 1 >= rows.length) {
      console.log('GAME OVER');
      router.push(`/end?win=false&gameField=${JSON.stringify(rows)}`);
    }

    setCurRow(curRow + 1);
    setCurCol(0);
  };

  const getCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (curRow > rowIndex) {
      if (wordLetters[cellIndex] === cell) {
        return Colors.light.green;
      } else if (wordLetters.includes(cell)) {
        return Colors.light.yellow;
      } else {
        return grayColor;
      }
    }
    return 'transparent';
  };

  const getBorderColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (curRow > rowIndex && cell !== '') {
      return getCellColor(cell, rowIndex, cellIndex);
    }
    return Colors.light.gray;
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.gameField}>
        {rows.map((row, rowIndex) => (
          <View style={styles.gameFieldRow} key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <View
                key={`cell-${rowIndex}-${cellIndex}`}
                style={[
                  styles.cell,
                  {
                    borderColor: getBorderColor(cell, rowIndex, cellIndex),
                    backgroundColor: getCellColor(cell, rowIndex, cellIndex),
                  },
                ]}>
                <Text
                  style={[
                    styles.cellText,
                    {
                      color: curRow > rowIndex ? '#fff' : textColor,
                    },
                  ]}>
                  {cell}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      <OnScreenKeyboard
        onKeyPressed={addKey}
        greenLetters={greenLetters}
        yellowLetters={yellowLetters}
        grayLetters={grayLetters}
      />
    </View>
  );
};

export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderWidth: 2,
  },
  cellText: {
    fontSize: 30,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});

import OnScreenKeyboard, { BACKSPACE, ENTER } from '@/components/OnScreenKeyboard';
import SettingsModal from '@/components/SettingsModal';
import { Colors } from '@/constants/Colors';
import { allWords } from '@/utils/allWords';
import { words } from '@/utils/targetWords';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';

const ROWS = 6;

const Page = () => {
  const [word, setWord] = useState(words[Math.floor(Math.random() * words.length)]);
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].gameBg;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const grayColor = Colors[colorScheme ?? 'light'].gray;

  // const [word, setWord] = useState('simon');
  const router = useRouter();

  console.log('🚀 ~ Page ~ word:', word);
  const wordLetters = word.split('');

  const [rows, setRows] = useState<string[][]>(new Array(ROWS).fill(new Array(5).fill('')));
  const [curRow, setCurRow] = useState(0);
  const [curCol, _setCurCol] = useState(0);

  const [greenLetters, setGreenLetters] = useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [grayLetters, setGrayLetters] = useState<string[]>([]);

  const settingsModalRef = useRef<BottomSheetModal>(null);

  const handlePresentSubscribeModalPress = () => settingsModalRef.current?.present();

  const colStateRef = useRef(curCol);
  const setCurCol = (data: number) => {
    colStateRef.current = data;
    _setCurCol(data);
  };

  const addKey = (key: string) => {
    console.log('CURRENT: ', colStateRef.current);

    const newRows = [...rows.map((row) => [...row])];

    if (key === 'ENTER') {
      checkWord();
    } else if (key === 'BACKSPACE') {
      if (colStateRef.current === 0) {
        newRows[curRow][0] = '';
        setRows(newRows);
        return;
      }

      newRows[curRow][colStateRef.current - 1] = '';

      setCurCol(colStateRef.current - 1);
      setRows(newRows);
      return;
    } else if (colStateRef.current >= newRows[curRow].length) {
      // EoL don't add keys
    } else {
      console.log('🚀 ~ addKey ~ curCol', colStateRef.current);

      newRows[curRow][colStateRef.current] = key;
      setRows(newRows);
      setCurCol(colStateRef.current + 1);
    }
  };

  const checkWord = () => {
    const currentWord = rows[curRow].join('');

    if (currentWord.length < word.length) {
      shakeRow();
      return;
    }

    if (!allWords.includes(currentWord)) {
      console.log('NOT A WORD');
      shakeRow();
      return;
    }
    flipRow();

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

    setTimeout(() => {
      if (currentWord === word) {
        console.log('🚀 ~ checkWord ~ WIN');
        router.push(`/end?win=true&word=${word}&gameField=${JSON.stringify(rows)}`);
      } else if (curRow + 1 >= rows.length) {
        console.log('GAME OVER');
        router.push(`/end?win=false&word=${word}&gameField=${JSON.stringify(rows)}`);
      }
    }, 1500);
    setCurRow(curRow + 1);
    setCurCol(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === 'Enter') {
        addKey(ENTER);
      } else if (e.key === 'Backspace') {
        addKey(BACKSPACE);
      } else if (e.key.length === 1) {
        addKey(e.key);
      }
    };

    if (Platform.OS === 'web') {
      document.addEventListener('keydown', handleKeyDown);
    }

    // Don't forget to clean up
    return () => {
      if (Platform.OS === 'web') {
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [curCol]);

  // const getCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
  //   'worklet';
  //   if (curRow > rowIndex) {
  //     if (wordLetters[cellIndex] === cell) {
  //       return Colors.light.green;
  //     } else if (wordLetters.includes(cell)) {
  //       return Colors.light.yellow;
  //     } else {
  //       return grayColor;
  //     }
  //   }
  //   return 'transparent';
  // };

  // const getBorderColor = (cell: string, rowIndex: number, cellIndex: number) => {
  //   if (curRow > rowIndex && cell !== '') {
  //     return getCellColor(cell, rowIndex, cellIndex);
  //   }
  //   return Colors.light.gray;
  // };

  // Animations
  const setCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (curRow >= rowIndex) {
      if (wordLetters[cellIndex] === cell) {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.green)
        );
      } else if (wordLetters.includes(cell)) {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.yellow)
        );
      } else {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(grayColor)
        );
      }
    } else {
      cellBackgrounds[rowIndex][cellIndex].value = withTiming('transparent', { duration: 100 });
    }
  };

  const setBorderColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (curRow > rowIndex && cell !== '') {
      if (wordLetters[cellIndex] === cell) {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.green)
        );
      } else if (wordLetters.includes(cell)) {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.yellow)
        );
      } else {
        cellBorders[rowIndex][cellIndex].value = withDelay(cellIndex * 200, withTiming(grayColor));
      }
    }
    return Colors.light.gray;
  };

  const offsetShakes = Array.from({ length: ROWS }, () => useSharedValue(0));

  const rowStyles = Array.from({ length: ROWS }, (_, index) =>
    useAnimatedStyle(() => {
      return {
        transform: [{ translateX: offsetShakes[index].value }],
      };
    })
  );

  const tileRotates = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue(0))
  );

  const cellBackgrounds = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue('transparent'))
  );

  const cellBorders = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue(Colors.light.gray))
  );

  const tileStyles = Array.from({ length: ROWS }, (_, index) => {
    return Array.from({ length: 5 }, (_, tileIndex) =>
      useAnimatedStyle(() => {
        return {
          transform: [{ rotateX: `${tileRotates[index][tileIndex].value}deg` }],
          borderColor: cellBorders[index][tileIndex].value,
          backgroundColor: cellBackgrounds[index][tileIndex].value,
        };
      })
    );
  });

  const shakeRow = () => {
    const TIME = 80;
    const OFFSET = 10;

    offsetShakes[curRow].value = withSequence(
      withTiming(-OFFSET, { duration: TIME / 2 }),
      withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
      withTiming(0, { duration: TIME / 2 })
    );
  };

  const flipRow = () => {
    const TIME = 300;
    const OFFSET = 90;

    tileRotates[curRow].forEach((value, index) => {
      value.value = withDelay(
        index * 100,
        withSequence(
          withTiming(OFFSET, { duration: TIME }, () => {}),
          withTiming(0, { duration: TIME })
        )
      );
    });
  };

  useEffect(() => {
    if (curRow === 0) return;

    rows[curRow - 1].map((cell, cellIndex) => {
      setCellColor(cell, curRow - 1, cellIndex);
      setBorderColor(cell, curRow - 1, cellIndex);
    });
  }, [curRow]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <SettingsModal ref={settingsModalRef} />
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerIcons}>
              <Ionicons name="help-circle-outline" size={28} color={textColor} />
              <Ionicons name="podium-outline" size={24} color={textColor} />
              <TouchableOpacity onPress={handlePresentSubscribeModalPress}>
                <Ionicons name="settings-sharp" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <View style={styles.gameField}>
        {rows.map((row, rowIndex) => (
          <Animated.View style={[styles.gameFieldRow, rowStyles[rowIndex]]} key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <Animated.View
                entering={ZoomIn.delay(50 * cellIndex)}
                key={`cell-${rowIndex}-${cellIndex}`}>
                <Animated.View
                  style={[
                    styles.cell,
                    // {
                    //   borderColor: getBorderColor(cell, rowIndex, cellIndex),
                    //   backgroundColor: getCellColor(cell, rowIndex, cellIndex),
                    // },
                    tileStyles[rowIndex][cellIndex],
                  ]}>
                  <Animated.Text
                    style={[
                      styles.cellText,
                      {
                        color: curRow > rowIndex ? '#fff' : textColor,
                      },
                    ]}>
                    {cell}
                  </Animated.Text>
                </Animated.View>
              </Animated.View>
            ))}
          </Animated.View>
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
    width: 62,
    height: 62,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  cellText: {
    fontSize: 30,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },
});

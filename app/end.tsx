import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from '@/assets/images/wordle-icon.svg';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import * as MailComposer from 'expo-mail-composer';

const Page = () => {
  const { win, word, gameField } = useLocalSearchParams<{
    win: string;
    word: string;
    gameField?: string;
  }>();
  const router = useRouter();

  const shareGame = () => {
    const game = JSON.parse(gameField!);
    console.log('🚀 ~ shareGame ~ game:', game);
    const imageText: string[][] = [];

    const wordLetters = word.split('');

    game.forEach((row: [], rowIndex: number) => {
      imageText.push([]);
      row.forEach((letter, index) => {
        if (letter === wordLetters[index]) {
          imageText[rowIndex].push('🟩');
        } else if (wordLetters.includes(letter)) {
          imageText[rowIndex].push('🟨');
        } else {
          imageText[rowIndex].push('⬜');
        }
      });
    });

    const html = `
      <html>
        <head>
          <style>

            .game {
              display: flex;
              flex-direction: column;
            }
              .row {
              display: flex;
              flex-direction: row;

              }
            .cell {
              display: flex;
              justify-content: center;
              align-items: center;
            }

          </style>
        </head>
        <body>
          <h1>Wordle</h1>
          <div class="game">
           ${imageText
             .map(
               (row) =>
                 `<div class="row">${row
                   .map((cell) => `<div class="cell">${cell}</div>`)
                   .join('')}</div>`
             )
             .join('')}
          </div>
        </body>
      </html>
    `;

    MailComposer.composeAsync({
      subject: `I just played Wordle!`,
      body: html,
      isHtml: true,
    });
  };

  const navigateRoot = () => {
    router.dismissAll();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={navigateRoot}
        style={{
          alignSelf: 'flex-end',
        }}>
        <Ionicons name="close" size={30} color={Colors.light.gray} />
      </TouchableOpacity>

      <View style={styles.header}>
        {win === 'true' ? (
          <Image source={require('@/assets/images/win.png')} />
        ) : (
          <Icon width={100} height={70} />
        )}

        <Text style={styles.title}>
          {win === 'true' ? 'Congratulations!' : 'Thanks for playing today!'}
        </Text>
        <Text style={styles.text}>Want to see your stats and streaks?</Text>

        <Link href={'/login'} style={styles.btn} asChild>
          <TouchableOpacity>
            <Text style={styles.btnText}>Create a free account</Text>
          </TouchableOpacity>
        </Link>

        <Link href={'/login'} asChild>
          <TouchableOpacity>
            <Text style={styles.textLink}>Already Registered? Log In</Text>
          </TouchableOpacity>
        </Link>

        <View
          style={{
            height: StyleSheet.hairlineWidth,
            width: '100%',
            backgroundColor: '#4e4e4e',
          }}
        />

        <TouchableOpacity style={styles.iconBtn} onPress={shareGame}>
          <Text style={styles.btnText}>Share</Text>
          <Ionicons name="share-social" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  header: {
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 40,
    fontFamily: 'FrankRuhlLibre_800ExtraBold',
    textAlign: 'center',
  },
  text: {
    fontSize: 26,
    textAlign: 'center',
    fontFamily: 'FrankRuhlLibre_500Medium',
  },
  btn: {
    justifyContent: 'center',
    borderRadius: 30,
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 1,
    width: '100%',
    backgroundColor: '#000',
  },
  btnText: {
    padding: 14,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  textLink: {
    textDecorationLine: 'underline',
    fontSize: 16,
    paddingVertical: 15,
  },
  iconBtn: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.green,
    borderRadius: 30,
    width: '70%',
  },
});

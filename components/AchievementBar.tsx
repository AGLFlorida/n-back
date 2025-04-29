import { View, Image, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  imgLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    paddingTop: 10,
  },
  imgContainer: {
    width: '32%',
    overflow: 'hidden',
    aspectRatio: 1,
    borderRadius: 20,
    position: 'relative',
  },
  img: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  floatingText: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    borderRadius: 50,
    padding: 2,
    backgroundColor: '#fff',
    width: '30%'
  },
  gold: {
    backgroundColor: 'gold'
  },
  silver: {
    backgroundColor: 'silver'
  },
  bronze: {
    backgroundColor: 'bonze'
  }
});

const AchievementBar = () => {
  return (
    <View style={styles.imgLayout}>
      <View style={styles.imgContainer}>
        <Image
          source={require('@/assets/images/achievements/medalEmpty.png')}
          style={styles.img}
          resizeMode="contain"
        />
        <Text style={styles.floatingText}>9</Text>
      </View>
      <View style={styles.imgContainer}>
        <Image
          source={require('@/assets/images/achievements/brainEmpty.png')}
          style={styles.img}
          resizeMode="contain"
        />
        <Text style={styles.floatingText}>8</Text>
      </View>
      <View style={styles.imgContainer}>
        <Image
          source={require('@/assets/images/achievements/streakEmpty.png')}
          style={styles.img}
          resizeMode="contain"
        />
        <Text style={styles.floatingText}>3</Text>
      </View>
    </View>
  );
};

export default AchievementBar;
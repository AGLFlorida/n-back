import { StyleSheet } from "react-native";

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
    backgroundColor: '#ffffff',
    width: '30%',
    borderColor: '#dddddd',
    borderWidth: 4,
  },
  gold: {
    backgroundColor: '#FFD700',
    borderWidth: 4,
    color: '#B8860B',
    borderColor: '#B8860B'
  },
  silver: {
    backgroundColor: '#C0C0C0',
    borderWidth: 4,
    color: '#A9A9A9',
    borderColor: '#A9A9A9'
  },
  bronze: {
    backgroundColor: '#CD7F32',
    borderWidth: 4,
    color: '#8B4513',
    borderColor: '#8B4513'
  }
});


export default styles;
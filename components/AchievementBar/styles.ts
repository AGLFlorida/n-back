import { StyleSheet } from "react-native";

import { ThemeType } from "@/contexts/types";

const styles = StyleSheet.create({
  bronze: {
    backgroundColor: '#CD7F32',
    borderColor: '#8B4513',
    borderWidth: 4,
    color: '#8B4513'
  },
  silver: {
    backgroundColor: '#C0C0C0',
    borderColor: '#676767',
    borderWidth: 4,
    color: '#676767'
  },
  gold: {
    backgroundColor: '#FFD700',
    borderColor: '#B8860B',
    borderWidth: 4,
    color: '#B8860B'
  },
  img: {
    borderRadius: 15,
    height: '100%',
    width: '100%',
  },
  imgContainer: {
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    width: '32%',
  },
  imgLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    paddingTop: 10,
  },
  floatingText: {
    backgroundColor: '#ffffff',
    borderColor: '#dddddd',
    borderRadius: 50,
    borderWidth: 4,
    bottom: 5,
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    left: 0,
    padding: 2,
    position: 'absolute',
    right: 0,
    textAlign: 'center',
    width: '30%',
  },
});

export default styles;

export const createStyles = (theme: ThemeType) => StyleSheet.create({
  text: {
    color: theme.textColor, 
    fontSize: 18,
  },
  textContainer: {
    width: '32%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  textLayout: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

type ProgressBarProps = {
  progress: number;  // Value between 0 and 1
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { backgroundColor: theme.accentColor }]}>
        <View 
          style={[
            styles.fill, 
            { 
              backgroundColor: theme.screenOptions.tabBarActiveTintColor,
              width: `${Math.min(100, Math.max(0, progress * 100))}%`
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  container: {
    height: 16,
    width: '80%',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden'
  },
  fill: {
    height: '100%',
    borderRadius: 8,
  }
});

export default ProgressBar; 
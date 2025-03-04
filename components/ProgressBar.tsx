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
  container: {
    borderRadius: 8,
    elevation: 5,
    height: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '80%'
  },
  fill: {
    borderRadius: 8,
    height: '100%',
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    width: '100%',
  }
});

export default ProgressBar; 
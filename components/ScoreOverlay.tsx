import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from "@/contexts/ThemeContext";

type ScoreOverlayProps = {
  isVisible: boolean;
  onClose: () => void;
  scores: {
    sounds?: number;
    positions: number;
    buzz?: number;
  };
};

const ScoreOverlay: React.FC<ScoreOverlayProps> = ({ isVisible, onClose, scores }) => {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <View style={[styles.container, { pointerEvents: 'box-none' }]}>
      <Animated.View 
        style={[
          styles.backdrop,
          { 
            opacity, 
            backgroundColor: theme.backgroundColor,
            pointerEvents: 'auto'
          }
        ]}
        onTouchEnd={onClose}
      />
      <Animated.View
        style={[
          styles.modal,
          {
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [600, 0]
              })
            }],
            backgroundColor: theme.backgroundColor,
            pointerEvents: 'auto'
          }
        ]}
      >
        <Text style={[styles.title, { color: theme.textColor }]}>Game Score</Text>
        <View style={styles.scoresContainer}>
          <Text style={[styles.score, { color: theme.textColor }]}>
            Position Score: {scores.positions}%
          </Text>
          {scores.sounds !== undefined && (
            <Text style={[styles.score, { color: theme.textColor }]}>
              Sound Score: {scores.sounds}%
            </Text>
          )}
          {scores.buzz !== undefined && (
            <Text style={[styles.score, { color: theme.textColor }]}>
              Haptic Score: {scores.buzz}%
            </Text>
          )}
        </View>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.accentColor }]} 
          onPress={onClose}
        >
          <Text style={[styles.buttonText, { color: theme.textColor }]}>Close</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    borderRadius: 10,
    elevation: 5,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '80%',
  },
  score: {
    fontSize: 18,
    marginVertical: 5,
  },
  scoresContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ScoreOverlay; 
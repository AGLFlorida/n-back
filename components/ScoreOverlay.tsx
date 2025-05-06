import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from 'react-i18next';

type ScoreOverlayProps = {
  isVisible: boolean;
  onClose: () => void;
  scores: {
    sounds?: number;
    positions: number;
    buzz?: number;
    pError?: number;
    sError?: number;
    bError?: number;
  };
  didLevelUp?: boolean;
};

const ScoreOverlay: React.FC<ScoreOverlayProps> = ({ isVisible, onClose, scores, didLevelUp }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
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
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity,
              backgroundColor: theme.backgroundColor,
              pointerEvents: 'auto'
            }
          ]}
        />
      </TouchableWithoutFeedback>
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
        <Text style={[styles.title, { color: theme.textColor }]}>
          {t('scoreOverlay.results')}
        </Text>
        {didLevelUp && (
          <Text style={[styles.levelUp, { color: theme.screenOptions.tabBarActiveTintColor }]}>
            {t('scoreOverlay.levelup')}
          </Text>
        )}
        <View style={styles.scoresContainer}>
          <Text style={[styles.score, { color: theme.textColor }]}>
          {t('scoreOverlay.posScore')}: {scores.positions}%
          </Text>
          {scores.pError !== undefined && scores.pError > 0 && (
            <Text style={[styles.score, { color: theme.textColor }]}>
              {t('scoreOverlay.posError')}: {scores.pError}%
            </Text>
          )}
          {scores.sounds !== undefined && scores.sounds > 0 && (
            <Text style={[styles.score, { color: theme.textColor }]}>
               {t('scoreOverlay.soundScore')}: {scores.sounds}% 
            </Text>
          )}
          {scores.sError !== undefined && scores.sError > 0 && (
            <Text style={[styles.score, { color: theme.textColor }]}>
               {t('scoreOverlay.soundError')}: {scores.sError}%
            </Text>
          )}
          {scores.buzz !== undefined && scores.buzz > 0 && (
            <Text style={[styles.score, { color: theme.textColor }]}>
               {t('scoreOverlay.hapScore')}: {scores.buzz}% 
            </Text>
          )}
          {scores.bError !== undefined && scores.bError > 0 && (
            <Text style={[styles.score, { color: theme.textColor }]}>
               {t('scoreOverlay.hapError')}: {scores.bError}%
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.accentColor }]}
          onPress={onClose}
        >
          <Text style={[styles.buttonText, { color: theme.textColor }]}> {t('close')}</Text>
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
  levelUp: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modal: {
    borderRadius: 10,
    elevation: 5,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '90%',
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
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, PanResponder, PanResponderGestureState, Pressable, ViewStyle } from 'react-native';
import { useTheme } from "@/contexts/ThemeContext";

import Ionicons from '@expo/vector-icons/Ionicons';

import log from "@/util/logger";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

type TutorialOverlayProps = {
  isVisible: boolean;
  onClose: () => void;
};

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ isVisible, onClose }) => {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const currentPageRef = useRef<number>(currentPage);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const position = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        position.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState: PanResponderGestureState) => {
        if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
          if (gestureState.dx > 0 && currentPageRef.current > 0) {
            animateToPage(currentPageRef.current - 1);
          } else if (gestureState.dx < 0 && currentPageRef.current < 2) {
            animateToPage(currentPageRef.current + 1);
          } else {
            log.warn('Invalid swipe, resetting');
            resetPosition();
          }
        } else {
          log.info('Threshold not met, resetting');
          resetPosition();
        }
      },
    })
  ).current;

  const animateToPage = (newPage: number) => {
    const direction = newPage > currentPageRef.current ? 1 : -1;
    Animated.spring(position, {
      toValue: -direction * SCREEN_WIDTH,
      useNativeDriver: true,
    }).start(() => {
      setCurrentPage(_ => newPage);
      position.setValue(0);
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.7,
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

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {[0, 1, 2].map(index => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: currentPage === index ? theme.accentColor : theme.textColor,
              opacity: currentPage === index ? 1 : 0.5,
            },
          ]}
        />
      ))}
    </View>
  );

  const renderContent = () => {
    switch (currentPage) {
      case 0:
        return (
          <View style={styles.contentContainer}>
            <Text style={[styles.text, { color: theme.textColor }]}>
              Glad you're here! Let's do a brief overview of the game board.
            </Text>
          </View>
        );
      case 1:
        return (
          <>
            <View style={[styles.gridHighlight, { alignSelf: 'center', alignItems: 'center' }]}>
              <Ionicons name="arrow-up-outline" color="yellow" size={90} />
            </View>
            <View style={styles.contentContainer}>
              <Text style={[styles.text, { color: theme.textColor }]}>
                This is the "grid". You will intermittently see blocks appear in random order on this part.
              </Text>
            </View>
          </>
        );
      case 2:
        return (
          <>
            <View style={styles.contentContainer}>
              <Text style={[styles.text, { color: theme.textColor }]}>
                These are your controls. They give you a game status and a one or more buttons for play. If you see something you want to react to, these are the buttons you press. When you're ready to begin, just tap "Play".
              </Text>
            </View>
            <View style={[styles.buttonHighlight, { alignSelf: 'center', alignItems: 'center' }]}>
              <Ionicons name="arrow-down-outline" color="yellow" size={90} />
            </View>
          </>
        );
    }
  };

  const renderNavigationButtons = () => (
    <View style={styles.navigationContainer}>
      {currentPage > 0 && (
        <Pressable
          onPress={() => animateToPage(currentPage - 1)}
          style={[styles.navButton, { backgroundColor: theme.accentColor }]}
        >
          <Text style={[styles.navButtonText, { color: theme.textColor }]}>Previous</Text>
        </Pressable>
      )}
      {currentPage < 2 && (
        <Pressable
          onPress={() => animateToPage(currentPage + 1)}
          style={[styles.navButton, { backgroundColor: theme.accentColor }]}
        >
          <Text style={[styles.navButtonText, { color: theme.textColor }]}>Next</Text>
        </Pressable>
      )}
      {currentPage === 2 && (
        <Pressable
          onPress={onClose}
          style={[styles.navButton, { backgroundColor: theme.accentColor }]}
        >
          <Text style={[styles.navButtonText, { color: theme.textColor }]}>Got it!</Text>
        </Pressable>
      )}
    </View>
  );

  const computedStyles = (): ViewStyle => {
    if (currentPage === 2) return styles.highContainer
    else if (currentPage === 1) return styles.lowContainer;
    else return styles.container
  }

  return (
    <View style={computedStyles()}>
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity,
            backgroundColor: theme.backgroundColor,
          }
        ]}
      />
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          {
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [600, 0],
                }),
              },
              {
                translateX: position,
              },
            ],
            // backgroundColor: theme.backgroundColor,
          },
        ]}
      >
        {/* {renderContent()}
        {renderNavigationButtons()}
        {renderDots()} */}
        <View style={[styles.modal, {backgroundColor: theme.backgroundColor}]}>
          <Text>Box 1</Text>
        </View>
        <View>
          <Text>Box 2</Text>
      </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lowContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    marginBottom: 20,
    alignItems: 'center',
  },
  highContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  gridHighlight: {
    position: 'absolute',
    top: -200,
    width: 200,
    borderWidth: 4,
    borderColor: 'yellow',
    borderRadius: 100,
    paddingTop: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonHighlight: {
    position: 'absolute',
    bottom: -200,
    width: 200,
    borderWidth: 4,
    borderColor: 'yellow',
    borderRadius: 100,
    paddingBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  navButton: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TutorialOverlay; 
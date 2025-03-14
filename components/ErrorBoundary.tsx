import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Updates from 'expo-updates';

import { useTheme } from '@/contexts/ThemeContext';
import lightMode from '@/contexts/light';
import darkMode from '@/contexts/dark';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isDark: boolean;
}

// Since ErrorBoundary is a class component, we need a wrapper to use hooks
function ErrorBoundaryWithTheme(props: Props) {
  const { theme } = useTheme();
  return <ErrorBoundary {...props} isDark={theme === darkMode} />;
}

class ErrorBoundary extends Component<Props & { isDark: boolean }, State> {
  constructor(props: Props & { isDark: boolean }) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isDark: props.isDark
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to your error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRestart = async () => {
    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.error('Failed to reload app:', error);
    }
  };

  render() {
    if (this.state.hasError) {
      const theme = this.props.isDark ? darkMode : lightMode;
      
      return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
          <Text style={[styles.title, { color: theme.textColor }]}>
            Oops! Something went wrong.
          </Text>
          <Text style={[styles.error, { color: this.props.isDark ? '#ff6b6b' : '#d63031' }]}>
            {this.state.error?.toString()}
          </Text>
          <TouchableOpacity 
            style={[styles.button, { 
              backgroundColor: theme.screenOptions.tabBarActiveTintColor 
            }]}
            onPress={this.handleRestart}
          >
            <Text style={[styles.buttonText, {
              color: this.props.isDark ? theme.textColor : '#ffffff'
            }]}>
              Restart App
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    padding: 15,
  },
  buttonText: {
    fontSize: 16,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  error: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ErrorBoundaryWithTheme; 
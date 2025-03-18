// src/components/common/Button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

const Button = ({ 
  title, 
  onPress, 
  containerStyle, 
  textStyle, 
  outlined = false,
  disabled = false 
}) => {
  if (outlined) {
    return (
      <TouchableOpacity
        style={[styles.outlinedButton, containerStyle]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={[styles.outlinedButtonText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={containerStyle}
    >
      <LinearGradient
        colors={disabled ? ['#666', '#444'] : [COLORS.primary, '#1E40AF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.text,
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
  outlinedButton: {
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  outlinedButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
});

export default Button;
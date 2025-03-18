// src/components/common/Card.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { COLORS } from '../../constants/theme';

const Card = ({ children, style, onPress }) => {
  const content = (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Shadow distance={15} startColor="rgba(0, 0, 0, 0.1)" style={styles.shadow}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          {content}
        </TouchableOpacity>
      </Shadow>
    );
  }

  return (
    <Shadow distance={15} startColor="rgba(0, 0, 0, 0.1)" style={styles.shadow}>
      {content}
    </Shadow>
  );
};

const styles = StyleSheet.create({
  shadow: {
    width: '100%',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    width: '100%',
  },
});

export default Card;
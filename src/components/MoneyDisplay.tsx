import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  money: number;
};

export const MoneyDisplay: React.FC<Props> = ({ money }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.coinIcon}>🪙</Text>
      <Text style={styles.amount}>{money}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  coinIcon: {
    fontSize: 20,
    marginRight: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFB300',
  },
});

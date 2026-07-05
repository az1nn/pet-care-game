import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pet } from '../types';
import { EnhancedStatusBar } from './EnhancedStatusBar';
import { useResponsive } from '../hooks/useResponsive';
import { useTheme } from '../context/ThemeContext';

type StatusCardProps = {
  pet: Pet;
  compact?: boolean;
  petName: string;
  petAge: string;
};

export const StatusCard: React.FC<StatusCardProps> = React.memo(({
  pet,
  compact = false,
  petName,
  petAge,
}) => {
  const { fs, spacing } = useResponsive();
  const { colors, themeType } = useTheme();

  const dynamicStyles = {
    card: {
      marginHorizontal: spacing(compact ? 8 : 10),
      marginVertical: spacing(compact ? 4 : 6),
      padding: spacing(compact ? 8 : 10),
      borderRadius: spacing(10),
    },
    petName: {
      fontSize: fs(compact ? 14 : 15),
      marginBottom: spacing(3),
    },
    petAge: {
      fontSize: fs(compact ? 11 : 12),
      marginBottom: spacing(5),
    },
    moneyContainer: {
      paddingVertical: spacing(2),
      paddingHorizontal: spacing(6),
      borderRadius: spacing(5),
    },
    coinIcon: {
      fontSize: fs(12),
      marginRight: spacing(2),
    },
    moneyValue: {
      fontSize: fs(12),
    },
  };

  if (themeType === 'new') {
    return (
      <View style={[styles.card, dynamicStyles.card, { backgroundColor: colors.cardBackground, borderRadius: spacing(20) }]}>
        <View style={[styles.splitLayout, { alignItems: 'center' }]}>
          {/* Header Row in New Theme */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing(8) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                 <View style={{ backgroundColor: '#E0F2F1', padding: spacing(4), borderRadius: spacing(20), marginRight: spacing(8) }}>
                   <Text style={{ fontSize: fs(18) }}>{pet.type === 'cat' ? '🐱' : '🐶'}</Text>
                 </View>
                 <Text style={[styles.petName, dynamicStyles.petName, { color: colors.primary, marginBottom: 0 }]}>{pet.name}'s Box</Text>
              </View>

              <View style={[styles.moneyContainer, dynamicStyles.moneyContainer, { backgroundColor: colors.moneyBackground, borderRadius: spacing(15) }]}>
                <Text style={[styles.coinIcon, dynamicStyles.coinIcon]}>💰</Text>
                <Text style={[styles.moneyValue, dynamicStyles.moneyValue, { color: colors.moneyText }]}>
                  {pet.money?.toLocaleString() ?? 0}
                </Text>
              </View>
            </View>

            <View style={{ marginBottom: spacing(8) }}>
              <EnhancedStatusBar pet={pet} compact={compact} showPercentage={true} twoColumnLayout={false} />
            </View>

            <View style={{ backgroundColor: '#ffffff', padding: spacing(8), borderRadius: spacing(15), alignSelf: 'center' }}>
              <Text style={[styles.petName, dynamicStyles.petName, { color: colors.primary, textAlign: 'center', marginBottom: 0 }]}>{pet.name}</Text>
              <Text style={[styles.petAge, dynamicStyles.petAge, { textAlign: 'center', marginBottom: 0 }]}>{petAge}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, dynamicStyles.card]}>
      <View style={styles.splitLayout}>
        {/* Left Column (30%): Pet Info */}
        <View style={styles.leftColumn}>
          <Text style={[styles.petName, dynamicStyles.petName]}>{petName}</Text>
          <Text style={[styles.petAge, dynamicStyles.petAge]}>{petAge}</Text>
          <View style={[styles.moneyContainer, dynamicStyles.moneyContainer]}>
            <Text style={[styles.coinIcon, dynamicStyles.coinIcon]}>💰</Text>
            <Text style={[styles.moneyValue, dynamicStyles.moneyValue]}>{pet.money ?? 0}</Text>
          </View>
        </View>

        {/* Middle (40%): Empty */}
        <View style={styles.middleColumn} />

        {/* Right Column (30%): Status Bars */}
        <View style={styles.rightColumn}>
          <EnhancedStatusBar pet={pet} compact={compact} showPercentage={false} twoColumnLayout />
        </View>
      </View>
    </View>
  );
});
StatusCard.displayName = 'StatusCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
  },
  splitLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftColumn: {
    width: '30%',
    paddingRight: 6,
  },
  middleColumn: {
    width: '40%',
  },
  rightColumn: {
    width: '30%',
    paddingLeft: 6,
  },
  petName: {
    fontWeight: 'bold',
    color: '#333',
  },
  petAge: {
    color: '#666',
  },
  moneyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    alignSelf: 'flex-start',
  },
  coinIcon: {},
  moneyValue: {
    fontWeight: 'bold',
    color: '#333',
  },
});

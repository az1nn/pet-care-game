import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StatusBar } from './StatusBar';
import { Pet } from '../types';
import { getStatLevel } from '../utils/petStats';

type EnhancedStatusBarProps = {
  pet: Pet;
  compact?: boolean;
  showPercentage?: boolean;
  twoColumnLayout?: boolean;
};

export const EnhancedStatusBar: React.FC<EnhancedStatusBarProps> = ({
  pet,
  compact = false,
  showPercentage = false,
  twoColumnLayout = false,
}) => {
  const { t } = useTranslation();
  const hungerLevel = getStatLevel(pet.hunger);
  const hygieneLevel = getStatLevel(pet.hygiene);
  const energyLevel = getStatLevel(pet.energy);
  const happinessLevel = getStatLevel(pet.happiness);
  const healthLevel = getStatLevel(pet.health);

  // Determine happiness emoji based on level
  const happinessEmoji = pet.happiness > 70 ? '😊' : pet.happiness > 40 ? '😐' : '😢';

  if (twoColumnLayout) {
    return (
      <View style={styles.twoColumnContainer}>
        <View style={styles.column}>
          <StatusBar
            label={t('status.hunger')}
            value={pet.hunger}
            color={hungerLevel.color}
            emoji="🍖"
            showPercentage={showPercentage}
            type="hunger"
          />
          <StatusBar
            label={t('status.hygiene')}
            value={pet.hygiene}
            color={hygieneLevel.color}
            emoji="🛁"
            showPercentage={showPercentage}
            type="hygiene"
          />
          <StatusBar
            label={t('status.energy')}
            value={pet.energy}
            color={energyLevel.color}
            emoji="⚡"
            showPercentage={showPercentage}
            type="energy"
          />
        </View>
        <View style={styles.column}>
          <StatusBar
            label={t('status.happiness')}
            value={pet.happiness}
            color={happinessLevel.color}
            emoji={happinessEmoji}
            showPercentage={showPercentage}
            type="happiness"
          />
          <StatusBar
            label={t('status.health')}
            value={pet.health}
            color={healthLevel.color}
            emoji="❤️"
            showPercentage={showPercentage}
            type="health"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, compact && styles.compact]}>
      <StatusBar
        label={t('status.hunger')}
        value={pet.hunger}
        color={hungerLevel.color}
        emoji="🍖"
        showPercentage={showPercentage}
        type="hunger"
      />
      <StatusBar
        label={t('status.hygiene')}
        value={pet.hygiene}
        color={hygieneLevel.color}
        emoji="🛁"
        showPercentage={showPercentage}
        type="hygiene"
      />
      <StatusBar
        label={t('status.energy')}
        value={pet.energy}
        color={energyLevel.color}
        emoji="⚡"
        showPercentage={showPercentage}
        type="energy"
      />
      <StatusBar
        label={t('status.happiness')}
        value={pet.happiness}
        color={happinessLevel.color}
        emoji={happinessEmoji}
        showPercentage={showPercentage}
        type="happiness"
      />
      <StatusBar
        label={t('status.health')}
        value={pet.health}
        color={healthLevel.color}
        emoji="❤️"
        showPercentage={showPercentage}
        type="health"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    backgroundColor: 'transparent',
  },
  compact: {
    paddingVertical: 2,
  },
  twoColumnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
});

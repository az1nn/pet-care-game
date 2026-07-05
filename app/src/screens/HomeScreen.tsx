import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePet } from '../context/PetContext';
import { useTheme } from '../context/ThemeContext';
import { useBuddy } from '../context/BuddyContext';
import { useToast } from '../context/ToastContext';
import { PetRenderer } from '../components/PetRenderer';
import { StatusCard } from '../components/StatusCard';
import { IconButton } from '../components/IconButton';
import { ConfirmModal } from '../components/ConfirmModal';
import { BannerAd } from '../components/BannerAd';
import { RewardedAdButton } from '../components/RewardedAdButton';
import { BuddyWidget } from '../components/BuddyWidget';
import { BuddyProfile } from '../components/BuddyProfile';
import { calculatePetAge } from '../utils/age';
import { AdsConfig } from '../config/ads.config';
import { needsVet, hasWarningStats } from '../utils/petStats';
import { GAME_BALANCE } from '../config/gameBalance';
import { ScreenNavigationProp } from '../types/navigation';
import { useResponsive } from '../hooks/useResponsive';
import { useGameBack } from '../hooks/useGameBack';
import { PET_SIZE } from '../config/responsive';

type Props = {
  navigation: ScreenNavigationProp<'Home'>;
};

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { pet, earnMoney } = usePet();
  const { colors, themeType } = useTheme();
  const { sendEvent } = useBuddy();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [showMenuConfirm, setShowMenuConfirm] = useState(false);
  const [showBuddyProfile, setShowBuddyProfile] = useState(false);
  const { deviceType, spacing, fs } = useResponsive();
  const goBack = useGameBack(navigation);

  if (!pet) {
    return null;
  }

  const petAge = calculatePetAge(pet.createdAt);
  const vetStatus = needsVet(pet.health);
  const hasWarnings = hasWarningStats(pet);
  const canSleep = pet.energy < GAME_BALANCE.thresholds.energyForSleep;

  const petNameDisplay = `${pet.type === 'cat' ? '🐱' : '🐶'} ${pet.name}`;
  const petAgeDisplay = `${petAge} ${petAge === 1 ? t('common.year') : t('common.years')}`;

  // Responsive pet size
  const petSize = PET_SIZE[deviceType];

  const handleMenuPress = () => {
    setShowMenuConfirm(true);
  };

  const handleConfirmMenu = () => {
    setShowMenuConfirm(false);
    goBack();
  };

  const handleRewardedAdCompleted = () => {
    const bonusCoins = AdsConfig.rewards.videoWatchBonus;
    earnMoney(bonusCoins);
    showToast(t('home.bonusEarned', { amount: bonusCoins }), 'success');
  };

  // Dynamic styles based on device
  const dynamicStyles = {
    warningText: {
      fontSize: fs(13),
      marginTop: spacing(6),
      paddingHorizontal: spacing(16),
    },
    rewardedAdContainer: {
      paddingHorizontal: spacing(12),
      paddingVertical: spacing(6),
    },
    actionsContainer: {
      gap: spacing(10),
      padding: spacing(12),
      paddingBottom: spacing(8),
      borderTopLeftRadius: spacing(20),
      borderTopRightRadius: spacing(20),
    },
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Unified Status Card with Pet Name, Age, Money and Status Bars */}
      <StatusCard pet={pet} petName={petNameDisplay} petAge={petAgeDisplay} />
      {hasWarnings && (
        <Text style={[styles.warningText, dynamicStyles.warningText]}>
          {t('home.warningAttention')}
        </Text>
      )}

      {/* Rewarded Ad Button for Bonus Coins */}
      <View style={[styles.rewardedAdContainer, dynamicStyles.rewardedAdContainer]}>
        <RewardedAdButton
          rewardText={t('home.watchAndEarn', { amount: AdsConfig.rewards.videoWatchBonus })}
          onRewardEarned={handleRewardedAdCompleted}
        />
      </View>

      <View style={styles.petContainer}>
        <PetRenderer pet={pet} size={petSize} />
        <BuddyWidget onProfilePress={() => setShowBuddyProfile(true)} />
      </View>

      <View style={[
        styles.actionsContainer,
        dynamicStyles.actionsContainer,
        {
          backgroundColor: themeType === 'new' ? 'transparent' : '#fff',
          shadowOpacity: themeType === 'new' ? 0 : 0.1,
          elevation: themeType === 'new' ? 0 : 5,
        }
      ]}>
        <IconButton
          emoji="🍖"
          label={t('home.actions.feed')}
          onPress={() => {
            sendEvent('pet_fed');
            navigation.navigate('Feed');
          }}
          style={themeType === 'new' ? { backgroundColor: colors.actionButtons.feed } : undefined}
        />
        <IconButton
          emoji="🛁"
          label={t('home.actions.bath')}
          onPress={() => {
            sendEvent('pet_bathed');
            navigation.navigate('Bath');
          }}
          style={themeType === 'new' ? { backgroundColor: colors.actionButtons.bath } : undefined}
        />
        <IconButton
          emoji="💤"
          label={t('home.actions.sleep')}
          onPress={() => {
            sendEvent('pet_sleeping');
            navigation.navigate('Sleep');
          }}
          disabled={!canSleep}
          disabledReason={t('sleep.notTired', { name: pet.name })}
          style={themeType === 'new' ? { backgroundColor: colors.actionButtons.sleep } : undefined}
        />
        <IconButton
          emoji={vetStatus === 'urgent' ? '🚨' : '🏥'}
          label={vetStatus === 'urgent' ? t('home.actions.vet') : t('home.actions.veterinarian')}
          onPress={() => navigation.navigate('Vet')}
          style={themeType === 'new' ? { backgroundColor: colors.actionButtons.vet } : undefined}
        />
        <IconButton
          emoji="👕"
          label={t('home.actions.clothes')}
          onPress={() => navigation.navigate('Wardrobe')}
          style={themeType === 'new' ? { backgroundColor: colors.actionButtons.clothes } : undefined}
        />
        <IconButton
          emoji="🎮"
          label={t('home.actions.play')}
          onPress={() => {
            sendEvent('pet_played');
            navigation.navigate('Play');
          }}
          style={themeType === 'new' ? { backgroundColor: colors.actionButtons.play } : undefined}
        />
        <IconButton
          emoji="🏠"
          label={t('home.actions.menu')}
          onPress={handleMenuPress}
          style={themeType === 'new' ? { backgroundColor: colors.actionButtons.menu } : undefined}
        />
      </View>

      <ConfirmModal
        visible={showMenuConfirm}
        title={t('home.menuModal.title')}
        message={t('home.menuModal.message')}
        confirmText={t('home.menuModal.confirmText')}
        cancelText={t('home.menuModal.cancelText')}
        onConfirm={handleConfirmMenu}
        onCancel={() => setShowMenuConfirm(false)}
      />

      {/* Banner Ad at the Bottom */}
      <BannerAd />

      {/* Buddy Profile Overlay */}
      {showBuddyProfile && (
        <BuddyProfile onClose={() => setShowBuddyProfile(false)} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
  },
  warningText: {
    textAlign: 'center',
    color: '#F44336',
    fontWeight: '600',
  },
  rewardedAdContainer: {},
  petContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'flex-start',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});

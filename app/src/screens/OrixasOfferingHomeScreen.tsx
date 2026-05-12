import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useOrixasOffering } from '../context/OrixasOfferingContext';
import { ScreenNavigationProp } from '../types/navigation';
import { EmojiIcon } from '../components/EmojiIcon';
import { useGameBack } from '../hooks/useGameBack';

type Props = { navigation: ScreenNavigationProp<'OrixasOfferingHome'> };

export const OrixasOfferingHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { bestScore } = useOrixasOffering();
  const handleBack = useGameBack(navigation);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack} accessibilityRole="button">
        <Text style={styles.backText}>← {t('common.back')}</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <EmojiIcon emoji="⚔️" size={72} style={styles.emoji} />
        <Text style={styles.title}>{t('orixasOffering.home.title')}</Text>
        <Text style={styles.subtitle}>{t('orixasOffering.home.subtitle')}</Text>
        {bestScore > 0 && (
          <View style={styles.bestScoreCard}>
            <Text style={styles.bestScoreLabel}>{t('orixasOffering.home.bestScore')}</Text>
            <Text style={styles.bestScoreValue}>{bestScore}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate('OrixasOfferingGame')}
          activeOpacity={0.85}
        >
          <Text style={styles.playButtonText}>{t('orixasOffering.home.play')}</Text>
        </TouchableOpacity>
        <Text style={styles.instructions}>{t('orixasOffering.home.instructions')}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0533' },
  backButton: { paddingHorizontal: 20, paddingTop: 16 },
  backText: { fontSize: 16, color: '#f5c842', fontWeight: '600' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emoji: { fontSize: 72, marginBottom: 12 },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#f5c842',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: { fontSize: 17, color: '#d4a8f0', textAlign: 'center', marginBottom: 28 },
  bestScoreCard: {
    backgroundColor: 'rgba(245,200,66,0.12)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginBottom: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,200,66,0.3)',
  },
  bestScoreLabel: {
    fontSize: 13,
    color: '#d4a8f0',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bestScoreValue: { fontSize: 32, fontWeight: '800', color: '#f5c842' },
  playButton: {
    backgroundColor: '#f5c842',
    paddingVertical: 18,
    paddingHorizontal: 52,
    borderRadius: 32,
    shadowColor: '#f5c842',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  playButtonText: { fontSize: 22, fontWeight: '700', color: '#1a0533' },
  instructions: {
    fontSize: 14,
    color: '#9b6fc4',
    textAlign: 'center',
    marginTop: 28,
    maxWidth: 300,
    lineHeight: 20,
  },
});

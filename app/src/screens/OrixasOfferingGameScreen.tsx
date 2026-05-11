import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useOrixasOffering } from '../context/OrixasOfferingContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';

type Props = { navigation: ScreenNavigationProp<'OrixasOfferingGame'> };

const { width: SW, height: SH } = Dimensions.get('window');

const GAME_DURATION = 60;
const MAX_LIVES = 3;
const BASE_FALL_SPEED = 3200;

interface Orixa {
  id: string;
  name: string;
  emoji: string;
  color: string;
  offerings: string[];
}

const ALL_ORIXAS: Orixa[] = [
  { id: 'iemanja', name: 'Iemanjá', emoji: '🌊', color: '#1565C0', offerings: ['🌊', '🐚', '🐠'] },
  { id: 'xango', name: 'Xangô', emoji: '⚡', color: '#B71C1C', offerings: ['⚡', '🔥', '🥁'] },
  { id: 'ogum', name: 'Ogum', emoji: '⚔️', color: '#1B5E20', offerings: ['⚔️', '🌿', '🛡️'] },
  { id: 'oxum', name: 'Oxum', emoji: '💛', color: '#E65100', offerings: ['💛', '🌺', '🪙'] },
  { id: 'iansa', name: 'Iansã', emoji: '🌪️', color: '#4A148C', offerings: ['🌪️', '🍃', '💨'] },
  { id: 'oxala', name: 'Oxalá', emoji: '🕊️', color: '#37474F', offerings: ['🕊️', '🌸', '☁️'] },
];

function pickRandom<T>(arr: T[], count: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < count && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function getOfferingsForLevel(orixa: Orixa, level: number): string[] {
  if (level <= 1) return [orixa.offerings[0]];
  if (level <= 3) return orixa.offerings.slice(0, 2);
  return orixa.offerings;
}

function safeStop(anim: Animated.CompositeAnimation | null) {
  if (anim && typeof (anim as unknown as { stop?: () => void }).stop === 'function') {
    (anim as unknown as { stop: () => void }).stop();
  }
}

export const OrixasOfferingGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useOrixasOffering();

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [activeOrixas, setActiveOrixas] = useState<Orixa[]>([]);
  const [currentOffering, setCurrentOffering] = useState<{ emoji: string; orixaId: string } | null>(
    null
  );
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // eslint-disable-next-line react-hooks/refs
  const offeringY = useRef(new Animated.Value(-60)).current;
  const scoreRef = useRef(0);
  const streakRef = useRef(0);
  const livesRef = useRef(MAX_LIVES);
  const levelRef = useRef(1);
  const gameActiveRef = useRef(true);
  const fallingAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const activeOrixasRef = useRef<Orixa[]>([]);
  // Stable ref for spawnOffering to avoid circular deps in useCallback
  const spawnOfferingRef = useRef<(orixas: Orixa[]) => void>(() => {});

  const endGame = useCallback(() => {
    gameActiveRef.current = false;
    setGameOver(true);
    updateBestScore(scoreRef.current);
  }, [updateBestScore]);

  const spawnOffering = useCallback(
    (orixas: Orixa[]) => {
      if (!gameActiveRef.current || orixas.length === 0) return;

      const orixa = orixas[Math.floor(Math.random() * orixas.length)];
      const pool = getOfferingsForLevel(orixa, levelRef.current);
      const emoji = pool[Math.floor(Math.random() * pool.length)];

      offeringY.setValue(-60);
      setCurrentOffering({ emoji, orixaId: orixa.id });

      const speed = Math.max(BASE_FALL_SPEED - levelRef.current * 300, 1200);
      const anim = Animated.timing(offeringY, {
        toValue: SH,
        duration: speed,
        useNativeDriver: true,
      });
      fallingAnimRef.current = anim;

      anim.start(({ finished }) => {
        if (!finished || !gameActiveRef.current) return;
        livesRef.current -= 1;
        const remaining = livesRef.current;
        setLives(remaining);
        streakRef.current = 0;
        setStreak(0);
        setFeedback('wrong');
        setCurrentOffering(null);
        if (remaining <= 0) {
          endGame();
        }
      });
    },
    [offeringY, endGame]
  );

  // Keep spawnOfferingRef current so respawn effect can use it without being in deps
  useEffect(() => {
    spawnOfferingRef.current = spawnOffering;
  }, [spawnOffering]);

  // Respawn offering whenever the slot is empty (after tap or miss)
  useEffect(() => {
    if (currentOffering === null && gameActiveRef.current && !gameOver) {
      const t = setTimeout(() => {
        if (gameActiveRef.current && activeOrixasRef.current.length > 0) {
          setFeedback(null);
          spawnOfferingRef.current(activeOrixasRef.current);
        }
      }, 350);
      return () => clearTimeout(t);
    }
  }, [currentOffering, gameOver]);

  const setupRound = useCallback(() => {
    const orixas = pickRandom(ALL_ORIXAS, 3);
    activeOrixasRef.current = orixas;
    setActiveOrixas(orixas);
    return orixas;
  }, []);

  const resetGame = useCallback(() => {
    safeStop(fallingAnimRef.current);
    scoreRef.current = 0;
    streakRef.current = 0;
    livesRef.current = MAX_LIVES;
    levelRef.current = 1;
    gameActiveRef.current = true;
    setScore(0);
    setStreak(0);
    setLives(MAX_LIVES);
    setTimeLeft(GAME_DURATION);
    setGameOver(false);
    setFeedback(null);
    setCurrentOffering(null);
    setupRound();
  }, [setupRound]);

  useEffect(() => {
    setupRound();
    // Initial offering spawn is handled by the respawn effect (currentOffering starts null)

    const timer = setInterval(() => {
      if (!gameActiveRef.current) {
        clearInterval(timer);
        return;
      }
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next > 0 && next % 15 === 0) {
          levelRef.current = Math.min(5, levelRef.current + 1);
        }
        if (next <= 0) {
          clearInterval(timer);
          gameActiveRef.current = false;
        }
        return next <= 0 ? 0 : next;
      });
    }, 1000);

    return () => {
      gameActiveRef.current = false;
      clearInterval(timer);
      safeStop(fallingAnimRef.current);
    };
  }, [setupRound]);

  useEffect(() => {
    if (timeLeft <= 0 && !gameOver) {
      endGame();
    }
  }, [timeLeft, gameOver, endGame]);

  const handleTap = useCallback(
    (tappedOrixaId: string) => {
      if (!gameActiveRef.current || !currentOffering) return;
      safeStop(fallingAnimRef.current);

      if (tappedOrixaId === currentOffering.orixaId) {
        streakRef.current += 1;
        const multiplier = Math.min(streakRef.current, 5);
        const points = 10 * multiplier;
        scoreRef.current += points;
        setScore(scoreRef.current);
        setStreak(streakRef.current);
        setFeedback('correct');
      } else {
        streakRef.current = 0;
        setStreak(0);
        livesRef.current -= 1;
        setLives(livesRef.current);
        setFeedback('wrong');
        if (livesRef.current <= 0) {
          setCurrentOffering(null);
          endGame();
          return;
        }
      }
      setCurrentOffering(null);
    },
    [currentOffering, endGame]
  );

  const handleBack = useGameBack(navigation, {
    cleanup: () => {
      gameActiveRef.current = false;
      safeStop(fallingAnimRef.current);
    },
  });

  const livesDisplay = Array.from({ length: MAX_LIVES }, (_, i) => (i < lives ? '❤️' : '🖤')).join(
    ' '
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        feedback === 'correct' && styles.containerCorrect,
        feedback === 'wrong' && styles.containerWrong,
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backText}>← {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.scoreText}>{score}</Text>
        <Text style={styles.timerText}>{timeLeft}s</Text>
      </View>

      <View style={styles.livesRow}>
        <Text style={styles.livesText}>{livesDisplay}</Text>
        {streak > 1 && (
          <Text style={styles.streakText}>
            x{Math.min(streak, 5)} {t('orixasOffering.game.streak')}!
          </Text>
        )}
      </View>

      <View style={styles.gameArea}>
        {currentOffering && (
          <Animated.View
            style={[styles.offeringContainer, { transform: [{ translateY: offeringY }] }]}
          >
            <Text style={styles.offeringEmoji}>{currentOffering.emoji}</Text>
          </Animated.View>
        )}
      </View>

      <View style={styles.shrinesRow}>
        {activeOrixas.map((orixa) => (
          <TouchableOpacity
            key={orixa.id}
            style={[styles.shrine, { backgroundColor: orixa.color }]}
            onPress={() => handleTap(orixa.id)}
            activeOpacity={0.75}
          >
            <Text style={styles.shrineEmoji}>{orixa.emoji}</Text>
            <Text style={styles.shrineName}>{orixa.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>✨</Text>
            <Text style={styles.modalTitle}>{t('orixasOffering.game.gameOver')}</Text>
            <Text style={styles.modalScore}>
              {t('orixasOffering.game.finalScore')}: {score}
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={resetGame}>
              <Text style={styles.modalButtonText}>{t('orixasOffering.game.playAgain')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalSecondaryButton} onPress={handleBack}>
              <Text style={styles.modalSecondaryText}>{t('common.menu')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0533' },
  containerCorrect: { backgroundColor: '#1a3320' },
  containerWrong: { backgroundColor: '#3a0a0a' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backText: { fontSize: 16, color: '#f5c842', fontWeight: '600' },
  scoreText: { fontSize: 22, fontWeight: '800', color: '#f5c842' },
  timerText: { fontSize: 18, fontWeight: '700', color: '#d4a8f0' },
  livesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 4,
  },
  livesText: { fontSize: 22 },
  streakText: { fontSize: 18, fontWeight: '800', color: '#f5c842' },
  gameArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  offeringContainer: {
    position: 'absolute',
    left: SW / 2 - 36,
    top: 0,
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offeringEmoji: { fontSize: 56, textAlign: 'center' },
  shrinesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    paddingBottom: 20,
    paddingTop: 8,
    gap: 8,
  },
  shrine: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  shrineEmoji: { fontSize: 30, marginBottom: 4 },
  shrineName: { fontSize: 12, fontWeight: '700', color: '#fff', textAlign: 'center' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2a0a44',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '80%',
    borderWidth: 1,
    borderColor: 'rgba(245,200,66,0.3)',
  },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 28, fontWeight: '800', color: '#f5c842', marginBottom: 8 },
  modalScore: { fontSize: 20, color: '#fff', fontWeight: '700', marginBottom: 24 },
  modalButton: {
    backgroundColor: '#f5c842',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 24,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#1a0533' },
  modalSecondaryButton: { paddingVertical: 10 },
  modalSecondaryText: { fontSize: 16, color: '#9b6fc4' },
});

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
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useOrixasOffering } from '../context/OrixasOfferingContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';

type Props = { navigation: ScreenNavigationProp<'OrixasOfferingGame'> };

const { width: SW } = Dimensions.get('window');

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Move {
  id: string;
  name: string;
  emoji: string;
  damage: number;
  heal?: number;
}

interface OrixaCharacter {
  id: string;
  name: string;
  color: string;
  maxHp: number;
  spriteTop: string;
  spriteBody: string;
  spriteBottom: string;
  moves: Move[];
}

const ORIXAS: OrixaCharacter[] = [
  {
    id: 'ogum',
    name: 'Ogum',
    color: '#2E7D32',
    maxHp: 120,
    spriteTop: '⚔️🌿⚔️',
    spriteBody: '🦸‍♂️',
    spriteBottom: '🛡️⚔️🛡️',
    moves: [
      { id: 'sword', name: 'Golpe da Espada', emoji: '⚔️', damage: 35 },
      { id: 'shield', name: 'Escudo de Ferro', emoji: '🛡️', damage: 15, heal: 15 },
      { id: 'fury', name: 'Fúria da Batalha', emoji: '💢', damage: 45 },
      { id: 'path', name: 'Caminho Aberto', emoji: '🌿', damage: 25 },
    ],
  },
  {
    id: 'oxala',
    name: 'Oxalá',
    color: '#546E7A',
    maxHp: 110,
    spriteTop: '✨☁️✨',
    spriteBody: '🧙‍♂️',
    spriteBottom: '🕊️🌸🕊️',
    moves: [
      { id: 'light', name: 'Luz Divina', emoji: '✨', damage: 30 },
      { id: 'peace', name: 'Paz Sagrada', emoji: '🕊️', damage: 20, heal: 20 },
      { id: 'creation', name: 'Criação', emoji: '🌸', damage: 25 },
      { id: 'pure', name: 'Branco da Pureza', emoji: '☁️', damage: 40 },
    ],
  },
  {
    id: 'iemanja',
    name: 'Iemanjá',
    color: '#1565C0',
    maxHp: 105,
    spriteTop: '🌊👑🌊',
    spriteBody: '🧜‍♀️',
    spriteBottom: '🐚🐠🐚',
    moves: [
      { id: 'wave', name: 'Grande Onda', emoji: '🌊', damage: 30 },
      { id: 'siren', name: 'Canto da Sereia', emoji: '🐚', damage: 35 },
      { id: 'storm', name: 'Tempestade do Mar', emoji: '⛈️', damage: 45 },
      { id: 'embrace', name: 'Abraço das Águas', emoji: '💧', damage: 20, heal: 15 },
    ],
  },
  {
    id: 'xango',
    name: 'Xangô',
    color: '#C62828',
    maxHp: 115,
    spriteTop: '⚡🔥⚡',
    spriteBody: '🦸‍♂️',
    spriteBottom: '🥁⚡🥁',
    moves: [
      { id: 'lightning', name: 'Raio', emoji: '⚡', damage: 40 },
      { id: 'justice', name: 'Chama da Justiça', emoji: '🔥', damage: 30 },
      { id: 'drum', name: 'Tambor Sagrado', emoji: '🥁', damage: 25 },
      { id: 'thunder', name: 'Trovão', emoji: '🌩️', damage: 45 },
    ],
  },
  {
    id: 'oxum',
    name: 'Oxum',
    color: '#E65100',
    maxHp: 100,
    spriteTop: '🌺💛🌺',
    spriteBody: '👸',
    spriteBottom: '🪙💧🌺',
    moves: [
      { id: 'gold', name: 'Ouro Encantado', emoji: '🪙', damage: 25 },
      { id: 'love', name: 'Poder do Amor', emoji: '💛', damage: 20, heal: 20 },
      { id: 'flower', name: 'Flor do Encanto', emoji: '🌺', damage: 30 },
      { id: 'waterfall', name: 'Cachoeira', emoji: '💦', damage: 35 },
    ],
  },
  {
    id: 'iansa',
    name: 'Iansã',
    color: '#6A1B9A',
    maxHp: 110,
    spriteTop: '🌩️🌪️🌩️',
    spriteBody: '🦸‍♀️',
    spriteBottom: '🍃⚡🍃',
    moves: [
      { id: 'gale', name: 'Vendaval', emoji: '🌪️', damage: 35 },
      { id: 'dance', name: 'Dança dos Ventos', emoji: '🍃', damage: 25 },
      { id: 'bolt', name: 'Raio de Iansã', emoji: '⚡', damage: 40 },
      { id: 'tempest', name: 'Tempestade', emoji: '🌩️', damage: 45 },
    ],
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

interface SpriteProps {
  orixa: OrixaCharacter;
  isEnemy?: boolean;
  shakeX: Animated.Value;
}

const OrixaSprite: React.FC<SpriteProps> = ({ orixa, isEnemy = false, shakeX }) => (
  <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
    <View
      style={[
        isEnemy ? styles.enemySpriteBox : styles.playerSpriteBox,
        { backgroundColor: orixa.color + '28', borderColor: orixa.color + '88' },
      ]}
    >
      <Text style={isEnemy ? styles.enemySpriteTop : styles.playerSpriteTop}>
        {orixa.spriteTop}
      </Text>
      <Text style={isEnemy ? styles.enemySpriteBody : styles.playerSpriteBody}>
        {orixa.spriteBody}
      </Text>
      <Text style={isEnemy ? styles.enemySpriteBottom : styles.playerSpriteBottom}>
        {orixa.spriteBottom}
      </Text>
    </View>
  </Animated.View>
);

interface HpBarProps {
  current: number;
  max: number;
  anim: Animated.Value;
  name: string;
}

const HpBar: React.FC<HpBarProps> = ({ current, max, anim, name }) => {
  const pct = current / max;
  const barColor = pct > 0.5 ? '#4CAF50' : pct > 0.25 ? '#FFC107' : '#F44336';
  return (
    <View style={styles.hpBarWrapper}>
      <Text style={styles.hpCharName} numberOfLines={1}>
        {name}
      </Text>
      <View style={styles.hpBarRow}>
        <Text style={styles.hpLabel}>HP</Text>
        <View style={styles.hpBarBg}>
          <Animated.View
            style={[
              styles.hpBarFill,
              {
                width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                backgroundColor: barColor,
              },
            ]}
          />
        </View>
      </View>
      <Text style={styles.hpNumbers}>
        {current}/{max}
      </Text>
    </View>
  );
};

interface SelectProps {
  onSelect: (id: string) => void;
  onBack: () => void;
}

const CharacterSelect: React.FC<SelectProps> = ({ onSelect, onBack }) => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.selectBackBtn} onPress={onBack}>
        <Text style={styles.backText}>← {t('common.back')}</Text>
      </TouchableOpacity>
      <Text style={styles.selectTitle}>{t('orixasOffering.select.title')}</Text>
      <Text style={styles.selectSubtitle}>{t('orixasOffering.select.subtitle')}</Text>
      <ScrollView contentContainerStyle={styles.selectGrid} showsVerticalScrollIndicator={false}>
        {ORIXAS.map((orixa) => (
          <TouchableOpacity
            key={orixa.id}
            style={[
              styles.selectCard,
              { borderColor: orixa.color, backgroundColor: orixa.color + '28' },
            ]}
            onPress={() => onSelect(orixa.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.selectSpriteTop}>{orixa.spriteTop}</Text>
            <Text style={styles.selectSpriteBody}>{orixa.spriteBody}</Text>
            <Text style={styles.selectName} numberOfLines={1}>
              {orixa.name}
            </Text>
            <Text style={styles.selectHp}>
              {t('orixasOffering.select.hp')}: {orixa.maxHp}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Main Screen ───────────────────────────────────────────────────────────────

export const OrixasOfferingGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useOrixasOffering();

  const [phase, setPhase] = useState<'select' | 'battle' | 'end'>('select');
  const [playerOrixa, setPlayerOrixa] = useState<OrixaCharacter | null>(null);
  const [opponentOrixa, setOpponentOrixa] = useState<OrixaCharacter | null>(null);
  const [playerHp, setPlayerHp] = useState(0);
  const [opponentHp, setOpponentHp] = useState(0);
  const [turn, setTurn] = useState<'player' | 'opponent'>('player');
  const [isAnimating, setIsAnimating] = useState(false);
  const [battleLog, setBattleLog] = useState('');
  const [winner, setWinner] = useState<'player' | 'opponent' | null>(null);
  const [totalDamage, setTotalDamage] = useState(0);

  // eslint-disable-next-line react-hooks/refs -- Animated.Value must be accessed during render for transforms
  const playerShakeX = useRef(new Animated.Value(0)).current;
  // eslint-disable-next-line react-hooks/refs -- Animated.Value must be accessed during render for transforms
  const opponentShakeX = useRef(new Animated.Value(0)).current;
  // eslint-disable-next-line react-hooks/refs -- Animated.Value must be accessed during render for transforms
  const playerHpAnim = useRef(new Animated.Value(1)).current;
  // eslint-disable-next-line react-hooks/refs -- Animated.Value must be accessed during render for transforms
  const opponentHpAnim = useRef(new Animated.Value(1)).current;
  // eslint-disable-next-line react-hooks/refs -- Animated.Value must be accessed during render for transforms
  const flashAnim = useRef(new Animated.Value(0)).current;
  const totalDamageRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    []
  );

  const shake = useCallback(
    (target: Animated.Value) =>
      Animated.sequence([
        Animated.timing(target, { toValue: 14, duration: 60, useNativeDriver: true }),
        Animated.timing(target, { toValue: -12, duration: 60, useNativeDriver: true }),
        Animated.timing(target, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(target, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]),
    []
  );

  const doFlash = useCallback(
    () =>
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 0.55, duration: 80, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]),
    [flashAnim]
  );

  const selectOrixa = useCallback(
    (orixaId: string) => {
      const player = ORIXAS.find((o) => o.id === orixaId)!;
      const others = ORIXAS.filter((o) => o.id !== orixaId);
      const opponent = others[Math.floor(Math.random() * others.length)];

      setPlayerOrixa(player);
      setOpponentOrixa(opponent);
      setPlayerHp(player.maxHp);
      setOpponentHp(opponent.maxHp);
      playerHpAnim.setValue(1);
      opponentHpAnim.setValue(1);
      playerShakeX.setValue(0);
      opponentShakeX.setValue(0);
      setTurn('player');
      setIsAnimating(false);
      setBattleLog(t('orixasOffering.battle.start', { name: opponent.name }));
      setWinner(null);
      totalDamageRef.current = 0;
      setTotalDamage(0);
      setPhase('battle');
    },
    [t, playerHpAnim, opponentHpAnim, playerShakeX, opponentShakeX]
  );

  const handleMove = useCallback(
    (move: Move) => {
      if (isAnimating || turn !== 'player' || !playerOrixa || !opponentOrixa) return;
      setIsAnimating(true);

      // Player attacks
      const dmg = Math.max(move.damage + Math.floor(Math.random() * 10) - 4, 1);
      const healAmt = move.heal ?? 0;
      const newOppHp = Math.max(opponentHp - dmg, 0);
      const newPlayerHpHealed =
        healAmt > 0 ? Math.min(playerHp + healAmt, playerOrixa.maxHp) : playerHp;

      setOpponentHp(newOppHp);
      if (healAmt > 0) setPlayerHp(newPlayerHpHealed);

      Animated.timing(opponentHpAnim, {
        toValue: newOppHp / opponentOrixa.maxHp,
        duration: 400,
        useNativeDriver: false,
      }).start();

      totalDamageRef.current += dmg;
      setTotalDamage(totalDamageRef.current);

      const playerLog =
        healAmt > 0
          ? t('orixasOffering.battle.attackHeal', {
              name: playerOrixa.name,
              move: move.name,
              damage: dmg,
              heal: healAmt,
            })
          : t('orixasOffering.battle.attack', {
              name: playerOrixa.name,
              move: move.name,
              damage: dmg,
            });
      setBattleLog(playerLog);

      Animated.parallel([doFlash(), shake(opponentShakeX)]).start(() => {
        if (!mountedRef.current) return;

        if (newOppHp <= 0) {
          setWinner('player');
          updateBestScore(totalDamageRef.current);
          setPhase('end');
          setIsAnimating(false);
          return;
        }

        // Opponent's turn
        setTurn('opponent');
        const oppMove = opponentOrixa.moves[Math.floor(Math.random() * opponentOrixa.moves.length)];
        const oppDmg = Math.max(oppMove.damage + Math.floor(Math.random() * 10) - 4, 1);
        const oppHealAmt = oppMove.heal ?? 0;
        const currPlayerHp = newPlayerHpHealed;

        setTimeout(() => {
          if (!mountedRef.current) return;

          const newPHp = Math.max(currPlayerHp - oppDmg, 0);
          setPlayerHp(newPHp);

          Animated.timing(playerHpAnim, {
            toValue: newPHp / playerOrixa.maxHp,
            duration: 400,
            useNativeDriver: false,
          }).start();

          if (oppHealAmt > 0) {
            const healedOppHp = Math.min(newOppHp + oppHealAmt, opponentOrixa.maxHp);
            setOpponentHp(healedOppHp);
            Animated.timing(opponentHpAnim, {
              toValue: healedOppHp / opponentOrixa.maxHp,
              duration: 300,
              useNativeDriver: false,
            }).start();
          }

          const oppLog =
            oppHealAmt > 0
              ? t('orixasOffering.battle.attackHeal', {
                  name: opponentOrixa.name,
                  move: oppMove.name,
                  damage: oppDmg,
                  heal: oppHealAmt,
                })
              : t('orixasOffering.battle.attack', {
                  name: opponentOrixa.name,
                  move: oppMove.name,
                  damage: oppDmg,
                });
          setBattleLog(oppLog);

          shake(playerShakeX).start(() => {
            if (!mountedRef.current) return;
            if (newPHp <= 0) {
              setWinner('opponent');
              updateBestScore(totalDamageRef.current);
              setPhase('end');
            } else {
              setTurn('player');
            }
            setIsAnimating(false);
          });
        }, 700);
      });
    },
    [
      isAnimating,
      turn,
      playerOrixa,
      opponentOrixa,
      playerHp,
      opponentHp,
      t,
      doFlash,
      shake,
      opponentShakeX,
      playerShakeX,
      opponentHpAnim,
      playerHpAnim,
      updateBestScore,
    ]
  );

  const resetGame = useCallback(() => {
    setPhase('select');
    setPlayerOrixa(null);
    setOpponentOrixa(null);
    setWinner(null);
    setBattleLog('');
    setIsAnimating(false);
    totalDamageRef.current = 0;
    setTotalDamage(0);
  }, []);

  const handleBack = useGameBack(navigation);

  if (phase === 'select') {
    return <CharacterSelect onSelect={selectOrixa} onBack={handleBack} />;
  }

  if (!playerOrixa || !opponentOrixa) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Attack flash overlay */}
      <Animated.View style={[styles.flashOverlay, { opacity: flashAnim }]} pointerEvents="none" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backText}>← {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⚔️ {t('orixasOffering.battle.title')} ⚔️</Text>
        <Text style={styles.headerDmg}>💥 {totalDamage}</Text>
      </View>

      {/* Battle arena */}
      <View style={styles.battleArena}>
        {/* Enemy: info top-left, sprite top-right */}
        <View style={styles.enemyRow}>
          <HpBar
            current={opponentHp}
            max={opponentOrixa.maxHp}
            anim={opponentHpAnim}
            name={opponentOrixa.name}
          />
          <OrixaSprite orixa={opponentOrixa} isEnemy shakeX={opponentShakeX} />
        </View>

        {/* Player: sprite bottom-left, info bottom-right */}
        <View style={styles.playerRow}>
          <OrixaSprite orixa={playerOrixa} shakeX={playerShakeX} />
          <HpBar
            current={playerHp}
            max={playerOrixa.maxHp}
            anim={playerHpAnim}
            name={playerOrixa.name}
          />
        </View>
      </View>

      {/* Battle log */}
      <View style={styles.battleLogBox}>
        <Text style={styles.battleLogText}>{battleLog}</Text>
      </View>

      {/* Move buttons (player turn) or waiting indicator */}
      <View style={styles.movesArea}>
        {turn === 'player' && !isAnimating ? (
          <View style={styles.movesGrid}>
            {playerOrixa.moves.map((move) => (
              <TouchableOpacity
                key={move.id}
                style={[styles.moveBtn, { borderColor: playerOrixa.color }]}
                onPress={() => handleMove(move)}
                activeOpacity={0.8}
              >
                <Text style={styles.moveEmoji}>{move.emoji}</Text>
                <Text style={styles.moveName} numberOfLines={2}>
                  {move.name}
                </Text>
                <Text style={styles.moveDmg}>{move.damage}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.waitingBox}>
            <Text style={styles.waitingText}>
              {turn === 'opponent'
                ? t('orixasOffering.battle.enemyTurn', { name: opponentOrixa.name })
                : '…'}
            </Text>
          </View>
        )}
      </View>

      {/* End-game modal */}
      <Modal visible={phase === 'end'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>{winner === 'player' ? '🏆' : '💔'}</Text>
            <Text
              style={[styles.modalTitle, { color: winner === 'player' ? '#f5c842' : '#ef5350' }]}
            >
              {winner === 'player'
                ? t('orixasOffering.battle.victory')
                : t('orixasOffering.battle.defeat')}
            </Text>
            <Text style={styles.modalSubtitle}>
              {winner === 'player'
                ? t('orixasOffering.battle.victoryMsg', {
                    winner: playerOrixa.name,
                    loser: opponentOrixa.name,
                  })
                : t('orixasOffering.battle.defeatMsg', {
                    winner: opponentOrixa.name,
                    loser: playerOrixa.name,
                  })}
            </Text>
            <Text style={styles.modalScore}>
              {t('orixasOffering.battle.totalDamage')}: {totalDamage}
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

  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    zIndex: 10,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245,200,66,0.15)',
  },
  backText: { fontSize: 15, color: '#f5c842', fontWeight: '600' },
  headerTitle: { fontSize: 13, fontWeight: '700', color: '#d4a8f0' },
  headerDmg: { fontSize: 14, fontWeight: '700', color: '#f5c842' },

  // Battle arena
  battleArena: { flex: 1, paddingHorizontal: 12, paddingVertical: 4 },

  enemyRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Sprites — enemy (top-right, smaller)
  enemySpriteBox: {
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 86,
  },
  enemySpriteTop: { fontSize: 13, textAlign: 'center' },
  enemySpriteBody: { fontSize: 34, textAlign: 'center' },
  enemySpriteBottom: { fontSize: 13, textAlign: 'center' },

  // Sprites — player (bottom-left, larger)
  playerSpriteBox: {
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    minWidth: 110,
  },
  playerSpriteTop: { fontSize: 16, textAlign: 'center' },
  playerSpriteBody: { fontSize: 50, textAlign: 'center' },
  playerSpriteBottom: { fontSize: 16, textAlign: 'center' },

  // HP bars
  hpBarWrapper: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 10,
  },
  hpCharName: { fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 6 },
  hpBarRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  hpLabel: { fontSize: 10, fontWeight: '700', color: '#d4a8f0', width: 18 },
  hpBarBg: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  hpBarFill: { height: '100%', borderRadius: 5 },
  hpNumbers: { fontSize: 11, color: '#d4a8f0', marginTop: 4 },

  // Battle log
  battleLogBox: {
    marginHorizontal: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245,200,66,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 54,
    justifyContent: 'center',
  },
  battleLogText: { fontSize: 13, color: '#fff', lineHeight: 18, textAlign: 'center' },

  // Moves
  movesArea: { paddingHorizontal: 12, paddingBottom: 12 },
  movesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moveBtn: {
    width: (SW - 32) / 2,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 2,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moveEmoji: { fontSize: 22 },
  moveName: { flex: 1, fontSize: 11, fontWeight: '600', color: '#fff', lineHeight: 14 },
  moveDmg: { fontSize: 12, fontWeight: '800', color: '#f5c842', minWidth: 24, textAlign: 'right' },

  waitingBox: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  waitingText: { fontSize: 15, color: '#d4a8f0', fontWeight: '600' },

  // Character select
  selectBackBtn: { paddingHorizontal: 16, paddingTop: 12 },
  selectTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#f5c842',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  selectSubtitle: {
    fontSize: 14,
    color: '#d4a8f0',
    textAlign: 'center',
    marginBottom: 12,
  },
  selectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  selectCard: {
    width: (SW - 48) / 2,
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  selectSpriteTop: { fontSize: 15, textAlign: 'center', marginBottom: 2 },
  selectSpriteBody: { fontSize: 44, textAlign: 'center', marginBottom: 4 },
  selectName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 2,
  },
  selectHp: { fontSize: 12, color: '#d4a8f0' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.82)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2a0a44',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    width: '82%',
    borderWidth: 1,
    borderColor: 'rgba(245,200,66,0.3)',
  },
  modalEmoji: { fontSize: 56, marginBottom: 8 },
  modalTitle: { fontSize: 30, fontWeight: '800', marginBottom: 6 },
  modalSubtitle: { fontSize: 13, color: '#d4a8f0', textAlign: 'center', marginBottom: 8 },
  modalScore: { fontSize: 18, color: '#fff', fontWeight: '700', marginBottom: 20 },
  modalButton: {
    backgroundColor: '#f5c842',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 24,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: { fontSize: 17, fontWeight: '700', color: '#1a0533' },
  modalSecondaryButton: { paddingVertical: 8 },
  modalSecondaryText: { fontSize: 15, color: '#9b6fc4' },
});

# 🐾 Pet Care Game

Um jogo 2D infantil para Android usando React Native, onde crianças podem cuidar de animais domésticos (gatos ou cachorros).

## ✨ Funcionalidades
- 🐱🐶 Criar pets (gato ou cachorro)
- 📝 Escolher nome e gênero do pet
- 🎂 Sistema de idade (1 ano inicial, +1 por semana, máximo 19 anos)
- 🍖 Alimentar o pet
- 🛁 Dar banho no pet
- 👕 Trocar roupas e acessórios (cabeça, olhos, torso, patas)
- 💾 Persistência local dos dados
- ⚠️ Confirmação ao sair para o menu (funciona em web, iOS e Android)
- 🗑️ Botão para apagar pet no menu com confirmação

## 🛠️ Stack Tecnológica
- React Native (Expo)
- React Navigation
- AsyncStorage
- react-native-reanimated
- react-native-gesture-handler
- react-native-svg

## 🚀 Como executar
1) Instale dependências:
```bash
npm install
```
2) Rode:
```bash
npx expo start
```

## 🎨 Assets necessários
Coloque os PNGs em `assets/sprites/`:
- `cats/cat_base.png`
- `dogs/dog_base.png`
- `clothes/hat_red.png`
- `clothes/eyes_big.png`
- `clothes/shirt_blue.png`
- `clothes/paws_boots.png`
- (e demais roupas opcionais)

## Checklist
- [x] Criar pet
- [x] Renderizar pet com camadas
- [x] Alimentar (animação + lógica)
- [x] Dar banho (gesto ou botão)
- [x] Armário de roupas
- [x] Persistência local
- [ ] Sons e efeitos visuais
- [ ] Otimizações de performance
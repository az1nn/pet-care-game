import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePet } from '../context/PetContext';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

export const MenuScreen: React.FC<Props> = ({ navigation }) => {
    const { pet, removePet } = usePet();

    const handleContinue = () => {
        if (pet) {
            navigation.navigate('Home');
        }
    };

    const handleNewPet = () => {
        if (pet) {
            Alert.alert(
                'Criar Novo Pet',
                `Você tem certeza? Seu pet "${pet.name}" será removido permanentemente.`,
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Confirmar',
                        style: 'destructive',
                        onPress: async () => {
                            await removePet();
                            navigation.navigate('CreatePet');
                        },
                    },
                ]
            );
        } else {
            navigation.navigate('CreatePet');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>🐾 Pet Care</Text>
                <Text style={styles.subtitle}>Cuide do seu amiguinho virtual!</Text>

                <View style={styles.buttonContainer}>
                    {pet && (
                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={handleContinue}
                        >
                            <Text style={styles.continueButtonText}>
                                Continuar com {pet.name} {pet.type === 'cat' ? '🐱' : '🐶'}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.newPetButton, pet && styles.newPetButtonSecondary]}
                        onPress={handleNewPet}
                    >
                        <Text style={[styles.newPetButtonText, pet && styles.newPetButtonTextSecondary]}>
                            {pet ? 'Novo Pet' : 'Criar Novo Pet'} ✨
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f0ff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#9b59b6',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 48,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    continueButton: {
        backgroundColor: '#9b59b6',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#9b59b6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    newPetButton: {
        backgroundColor: '#9b59b6',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#9b59b6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    newPetButtonSecondary: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#9b59b6',
        shadowOpacity: 0.1,
    },
    newPetButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    newPetButtonTextSecondary: {
        color: '#9b59b6',
    },
});

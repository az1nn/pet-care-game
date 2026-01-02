import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePet } from '../context/PetContext';
import { ConfirmModal } from '../components/ConfirmModal';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

export const MenuScreen: React.FC<Props> = ({ navigation }) => {
    const { pet, removePet } = usePet();
    const [showNewPetConfirm, setShowNewPetConfirm] = useState(false);
    const [showDeletePetConfirm, setShowDeletePetConfirm] = useState(false);

    const handleContinue = () => {
        if (pet) {
            navigation.navigate('Home');
        }
    };

    const handleNewPet = () => {
        if (pet) {
            setShowNewPetConfirm(true);
        } else {
            navigation.navigate('CreatePet');
        }
    };

    const handleConfirmNewPet = async () => {
        setShowNewPetConfirm(false);
        await removePet();
        navigation.navigate('CreatePet');
    };

    const handleDeletePet = () => {
        if (pet) {
            setShowDeletePetConfirm(true);
        }
    };

    const handleConfirmDeletePet = async () => {
        setShowDeletePetConfirm(false);
        await removePet();
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

                    {pet && (
                        <TouchableOpacity
                            style={styles.deletePetButton}
                            onPress={handleDeletePet}
                        >
                            <Text style={styles.deletePetButtonText}>
                                Apagar Pet 🗑️
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ConfirmModal
                visible={showNewPetConfirm}
                title="Criar Novo Pet"
                message={`Você tem certeza? Seu pet "${pet?.name}" será removido permanentemente.`}
                confirmText="Confirmar"
                cancelText="Cancelar"
                confirmStyle="destructive"
                onConfirm={handleConfirmNewPet}
                onCancel={() => setShowNewPetConfirm(false)}
            />

            <ConfirmModal
                visible={showDeletePetConfirm}
                title="Apagar Pet"
                message={`Você tem certeza que deseja apagar o pet "${pet?.name}"? Esta ação não pode ser desfeita.`}
                confirmText="Apagar"
                cancelText="Cancelar"
                confirmStyle="destructive"
                onConfirm={handleConfirmDeletePet}
                onCancel={() => setShowDeletePetConfirm(false)}
            />
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
    deletePetButton: {
        backgroundColor: '#fff',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#F44336',
        shadowOpacity: 0.1,
    },
    deletePetButtonText: {
        color: '#F44336',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

import React from 'react';
import {
    View,
    Text,
    TextInput,
    Button
} from 'react-native';

export function Profile(){
    return (
        <View>
            <Text testID='text-title'>
                Perfil
            </Text>

            <TextInput 
                testID="input-name"
                placeholder="Nome"
                autoCorrect={false}
                value="Caio"
            />

            <TextInput 
                testID="input-surname"
                placeholder="Sobrenome"
                value="Detore"
            />

            <Button 
                title="Salvar"
                onPress={() => {}}
            />
        </View>
    );
}
import React from 'react';
import { useNavigation } from '@react-navigation/core';

import { 
    KeyboardAvoidingView, 
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';

import { Input } from '../../../components/Input';
import { Bullet } from '../../../components/Bullet';
import { Button } from '../../../components/Button';
import { BackButton } from '../../../components/BackButton';

import {
    Container,
    Header,
    Steps,
    Title,
    Subtitle,
    Form,
    FormTitle
} from './styles';

export function SignUpFirstStep(){
    const navigation = useNavigation<any>();

    function handleBack(){ 
        navigation.goBack();
    }

    return (
        <KeyboardAvoidingView behavior="position" enabled>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container>
                    <Header>
                        <BackButton onPress={handleBack} />
                        <Steps>
                            <Bullet active />
                            <Bullet  />
                        </Steps>
                    </Header>

                    <Title>
                        Crie sua{'\n'}conta
                    </Title>
                    <Subtitle>
                        Faça seu cadastro de{'\n'}
                        forma rápida e fácil
                    </Subtitle>

                    <Form>
                        <FormTitle>1. Dados</FormTitle>
                        <Input 
                            iconName="user"
                            placeholder="nome"
                        />

                        <Input 
                            iconName="mail"
                            placeholder="E-mail"
                            keyboardType="email-address"
                        />

                        <Input 
                            iconName="credit-card"
                            placeholder="CNH"
                            keyboardType="numeric"
                        />
                    </Form>

                    <Button 
                        title="Próximo"
                    />

                </Container>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
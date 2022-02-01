import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/core';

import { 
    KeyboardAvoidingView, 
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';

import * as Yup from 'yup'

import { useAuth } from '../../../hook/auth';
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
    const [name, setName] = useState('');
    const [email, setEmail] = useState<string>('');
    const [driverLicense, setDriverLicense] = useState('');

    const navigation = useNavigation<any>();
    const { user } = useAuth();

    function handleBack(){ 
        navigation.goBack();
    }

    async function handleNextStep(){
        try {
            const schema = Yup.object().shape({
                driverLicense: Yup.string()
                .required('CNH é obrigatória'),
                email: Yup.string()
                .email('E-mail inválido')
                .required('E-mail é obrigatório'),
                name: Yup.string()
                .required('Nome é obrigatório')
            });

            const data = {name, email, driverLicense};
            await schema.validate(data);

            navigation.navigate('SignUpSecondStep', { user: data });
        } catch (error) {
            if(error instanceof Yup.ValidationError){
                return Alert.alert('Opa', error.message);
            }
        }
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
                            onChangeText={setName}
                            value={name}
                        />

                        <Input 
                            iconName="mail"
                            placeholder="E-mail"
                            keyboardType="email-address"
                            onChangeText={(text: string) => setEmail(text.trim())}
                            value={email}
                        />

                        <Input 
                            iconName="credit-card"
                            placeholder="CNH"
                            keyboardType="numeric"
                            onChangeText={setDriverLicense}
                            value={driverLicense}
                            // onChangeText={(value) => setDriverLicense(Number(value))}
                        />
                    </Form>

                    <Button 
                        title="Próximo"
                        onPress={handleNextStep}
                    />

                </Container>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
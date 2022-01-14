import React, { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { useTheme } from 'styled-components';

import api from '../../services/api';
import CarDTO from '../../dtos/CarDTO';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from '../../components/BackButton';

import {
    Container,
    Header,
    Title,
    Subtitle
} from './styles';

export function MyCars(){
    const [cars, setCars] = useState<CarDTO[]>([])
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();
    const theme = useTheme();


    function handleBack() {
        navigation.goBack();
    }

    useEffect(() => {
        async function fetchCars(){
            try{
                const response = await api.get('/schedules_byuser?user_id=1');
                setCars(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchCars();
    }, []);

    return (
        <Container>
            <Header>
                <StatusBar 
                    barStyle="light-content"
                    translucent
                    backgroundColor="transparent"
                />
                <View style={{ alignSelf: 'flex-start'}}>
                    <BackButton color={theme.colors.shape} onPress={handleBack} />
                </View>

                <Title>
                    Escolha uma {'\n'}
                    data de início e {'\n'}
                    fim do aluguel
                </Title>

                <Subtitle>
                    Conforto, segurança e praticidade.
                </Subtitle>
            </Header>
        </Container>
    );
}
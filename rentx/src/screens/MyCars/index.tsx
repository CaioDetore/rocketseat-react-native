import React, { useEffect, useState } from 'react';

import { useTheme } from 'styled-components';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import { BackButton } from '../../components/BackButton';
import { LoadAnimation } from '../../components/LoadAnimation';

import api from '../../services/api';
import { Car } from '../../components/Car'; 
import { StatusBar, View, FlatList } from 'react-native';
import { Car as ModelCar } from '../../database/models/Car'

import { format, parseISO} from 'date-fns';
import { AntDesign } from '@expo/vector-icons';

import {
    Container,
    Header,
    Title,
    Subtitle,
    Content,
    Appointments,
    AppointmentsTitle,
    AppointmentsQuantity,
    CarWapper,
    CarFooter,
    CarFooterTitle,
    CarFooterPeriod,
    CarFooterDate
} from './styles';

interface DataProps {
    id: string;
    car: ModelCar;
    start_date: string;
    end_date: string;
}

export function MyCars(){
    const [cars, setCars] = useState<DataProps[]>([])
    const [loading, setLoading] = useState(true);
    const screenIsFocus = useIsFocused();

    const navigation = useNavigation();
    const theme = useTheme();


    function handleBack() {
        navigation.goBack();
    }

    useEffect(() => {
        async function fetchCars(){
            try{
                const response = await api.get('/rentals');
                const dataFormatted = response.data.map((data: DataProps) => {
                    return {
                        id: data.id,
                        car: data.car,
                        start_date: format(parseISO(data.start_date), 'dd/MM/yyyy'),
                        end_date: format(parseISO(data.end_date), 'dd/MM/yyyy'),
                    }
                })
                setCars(dataFormatted);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchCars();
    }, [screenIsFocus]);

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
            { 
                loading ? <LoadAnimation /> : 
            <Content>
                <Appointments>
                    <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
                    <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
                </Appointments>

                <FlatList 
                    data={cars}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <CarWapper>
                            <Car data={item.car} />
                            <CarFooter>
                                <CarFooterTitle>Período</CarFooterTitle>
                                <CarFooterPeriod>
                                    <CarFooterDate>{item.start_date}</CarFooterDate>
                                    <AntDesign 
                                        name="arrowright"
                                        size={20}
                                        color={theme.colors.title}
                                        style={{marginHorizontal: 10}}
                                    />
                                    <CarFooterDate>{item.end_date}</CarFooterDate>
                                </CarFooterPeriod>
                            </CarFooter>
                        </CarWapper>
                    )}
                />
            </Content>
            }
        </Container>
    );
}
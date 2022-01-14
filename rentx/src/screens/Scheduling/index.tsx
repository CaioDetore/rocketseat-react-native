import React, { useState } from 'react';
import { useTheme } from 'styled-components'
import { Alert, StatusBar, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { format } from 'date-fns'
import ArrowSvg from '../../assets/arrow.svg'

import CarDTO from '../../dtos/CarDTO';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/BackButton';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { 
    Calendar,
    DayProps,
    generateInterval,
    MarkedDateProps
} from '../../components/Calendar';

import {
    Container,
    Header,
    Title,
    RentalPeriod,
    DateInfo,
    DateTitle,
    DateValue,
    Content,
    Footer
} from './styles';

interface RentalPeriod {
    startFormatted: string;
    endFormatted: string;
}

interface Params {
    car: CarDTO;
    dates: string[];
}

export function Scheduling(){
    const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>({} as DayProps);
    const [markedDates, setMarkedDates] = useState<MarkedDateProps>({} as MarkedDateProps);
    const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod)

    const theme = useTheme();
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { car, dates } = route.params as Params;

    function handleSchedulingDetails() {
        if(!rentalPeriod.startFormatted || !rentalPeriod.endFormatted){
            Alert.alert('Atenção', 'Selecione o intervalo para alugar.')
        } else {
            navigation.navigate('SchedulingDetails', {
                car, 
                dates: Object.keys(markedDates)
            })
        }
    }

    function handleBack() {
        navigation.goBack();
    }

    function handleChangeDate(date: DayProps){
        let start = !lastSelectedDate.timestamp ? date: lastSelectedDate;
        let end = date;

        if(start.timestamp > end.timestamp){
            start = end;
            end = start;
        }

        setLastSelectedDate(end);
        const interval = generateInterval(start, end);
        setMarkedDates(interval);

        const firstDate = Object.keys(interval)[0];
        const endDate = Object.keys(interval)[Object.keys(interval).length - 1];

        setRentalPeriod({
            startFormatted: format(getPlatformDate(new Date(firstDate)), 'dd/MM/yyyy'),
            endFormatted: format(getPlatformDate(new Date(endDate)), 'dd/MM/yyyy'),
        })
    }


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

                <RentalPeriod>
                    <DateInfo>
                        <DateTitle>DE</DateTitle>
                        <DateValue selected={!!rentalPeriod.startFormatted}>
                            {rentalPeriod.startFormatted}
                        </DateValue>
                    </DateInfo>

                    <ArrowSvg />

                    <DateInfo>
                        <DateTitle>ATÉ</DateTitle>
                        <DateValue selected={!!rentalPeriod.endFormatted}>
                            {rentalPeriod.endFormatted}
                        </DateValue>
                    </DateInfo>
                </RentalPeriod>
            </Header>

            <Content>
                <Calendar 
                    markedDates={markedDates}
                    onDayPress={handleChangeDate}
                />
            </Content>

            <Footer>
                <Button title="confirmar" onPress={ handleSchedulingDetails }/>
            </Footer>

       </Container>
    );
}
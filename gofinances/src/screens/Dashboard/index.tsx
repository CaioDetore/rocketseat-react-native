import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Alert } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { useTheme } from 'styled-components'

import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard } from '../../components/TransactionCard'

import { TransactionCardProps } from '../../components/TransactionCard' 

import { AlertDialog } from '../../components/Dialog'

import { useAuth } from '../../hooks/auth'

import { 
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionsList,
    LogoutButton,
    LoadContainer
} from './styles'


export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
    lastTransaction: string;
}

interface HighlightData {
    entries:  HighlightProps;
    expensives: HighlightProps;
    total: HighlightProps;
}

export function Dashboard(){
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);
    const [transictionId, setTransictionId] = useState('');

    //Dialog
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);

    const theme = useTheme();
    const { signOut, user } = useAuth();

    const dataKey = `@gofinances:transactions_user:${user.id}`;
    
    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'positive' | 'negative'){

        const collectionFiltered = collection
        .filter(transaction => transaction.type === type);

        if(collectionFiltered.length === 0)
            return 0

        const lastTransaction = new Date(
        Math.max.apply(Math, collectionFiltered
            .map(transaction => new Date(transaction.date)
            .getTime())));
        
        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pr-BR', { month: 'long' })}`;
    }

    async function handleRemoveCard(transactionId: string){
        try {
            const response = await AsyncStorage.getItem(dataKey);
            const storagedTransactions = response ? JSON.parse(response) : [];

            const filteredTransactions = storagedTransactions
            .filter( (transaction: DataListProps) => transaction.id !== transactionId);

            setTransactions(filteredTransactions);
            await AsyncStorage
            .setItem(dataKey, JSON.stringify(filteredTransactions));

            setVisible(false);
            loadTransactions();
            
        } catch (error){
            console.log(error)
            Alert.alert("N??o foi poss??vel excluir a transi????o selecionada")
        }
        
    }

    // function alert(name: string, id: string){
    //     Alert.alert(`Voc?? deseja deletar ${String(name)}`,
    //     "",
    //     [
    //       {text: 'Cancelar', },
    //       {text: 'Deletar', onPress: () => handleRemoveCard(id) },
    //     ],
    //       {cancelable: false}
    // )}

    async function loadTransactions(){
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionFormatted: DataListProps[] = transactions
        .map((item: DataListProps) => {

            if(item.type === "positive"){
                entriesTotal += Number(item.amount);
            } else {
                expensiveTotal += Number(item.amount);
            }

            const amount = Number(item.amount)
            .toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(item.date));

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date,
            }
        });

        setTransactions(transactionFormatted);

        const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
        const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');
        
        const totalInterval = lastTransactionEntries === 0 
        ? 'N??o h?? transa????es'
        : `01 a ${lastTransactionEntries}`;
        
        const total = entriesTotal - expensiveTotal

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionEntries === 0 ? 'N??o h?? transa????es' 
                : `??ltima entrada dia ${lastTransactionEntries}`,
            },
            expensives: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionExpensives === 0 ? 'N??o h?? transa????es' 
                : `??ltima sa??da dia ${lastTransactionExpensives}`,
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: totalInterval,
            }
        });

        setIsLoading(false);
    }

    useEffect(() => {
        loadTransactions()
    }, []);

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []));

    function showDialog(name: string, id: string){
        setTransictionId(id)
        setMessage('Deseja excluir a tansa????o: ' + name)
        setVisible(true)
    }

    const handleCancel = () => {
        setVisible(false);
    };

    return(
        <Container>
            {
                isLoading ?
                <LoadContainer> 
                    <ActivityIndicator 
                        color={theme.colors.primary}
                        size="large"
                    /> 
                </LoadContainer> :
                <>
                    <Header>
                        <UserWrapper>
                            <UserInfo>
                                <Photo 
                                    source={{uri: user.photo}}
                                />
                                <User>
                                    <UserGreeting>Ol??, </UserGreeting>
                                    <UserName>{user.name}</UserName>
                                </User>
                            </UserInfo>

                            <LogoutButton onPress={signOut}>
                                <Icon name="power" />
                            </LogoutButton>
                        </UserWrapper>
                    </Header>

                    <HighlightCards>
                        <HighlightCard 
                            type="up"
                            title="Entradas" 
                            amount={highlightData.entries.amount}
                            lastTransaction={highlightData.entries.lastTransaction}
                        />
                        <HighlightCard 
                            type="down"
                            title="Saidas"
                            amount={highlightData?.expensives?.amount}
                            lastTransaction={highlightData.expensives.lastTransaction}
                        />
                        <HighlightCard 
                            type="total"
                            title="Total" 
                            amount={highlightData?.total?.amount}
                            lastTransaction={highlightData.total.lastTransaction}
                        />
                    </HighlightCards>

                    <Transactions>
                        <Title>Listagem</Title>

                        <TransactionsList 
                            data={transactions}
                            keyExtractor={item => item.id}
                            renderItem={({item }) => 
                                <TransactionCard  
                                    onPress={ () => showDialog(item.name, item.id) }
                                    data={item} 
                                />
                            }
                        />
                        
                        <AlertDialog 
                                    visible={visible}
                                    title='Excluir'
                                    message={ message }
                                    confirm={ () => handleRemoveCard(transictionId) }
                                    cancel={ () => handleCancel() } 
                        />
                    </Transactions>
                </>
            }
        </Container>
    )
}
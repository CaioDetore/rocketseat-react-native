import React from 'react'

import { BorderlessButtonProps } from 'react-native-gesture-handler'

import { categories } from '../../utils/categories'

import { 
    Container,
    Title,
    Amount,
    Footer,
    Category,
    Icon,
    IconButton,
    IconDelete,
    CategoryName,
    Date
} from './styles'

export interface TransactionCardProps {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: String;
    date: string;
}

interface Props extends BorderlessButtonProps {
    data: TransactionCardProps;
    onPress: () => void;
}

export function TransactionCard({ data, onPress, ...rest} : Props ){
    const category = categories.filter(
        item => item.key === data.category
    )[0];

    return (
        <Container>
            <Title>
                {data.name}
            </Title>

            <Amount type={data.type}>
                {data.type === 'negative' && '- '}
                {data.amount}
            </Amount>

            <Footer>
                <Category>
                    <Icon name={category.icon}/>
                    <CategoryName>
                        {category.name}
                    </CategoryName>
                </Category>
                <Date>
                    {data.date}
                </Date>

                <IconButton onPress={onPress} {...rest}>
                    <IconDelete name={'x'}/>
                </IconButton>
            </Footer>
        </Container>
    )
}
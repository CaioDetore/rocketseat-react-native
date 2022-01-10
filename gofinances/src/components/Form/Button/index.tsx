import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import {
Container,
GestureHandlerView,
ButtonContainer,
Title
} from './styles';

interface Props extends RectButtonProps {
title: string;
onPress: () => void;
}

export function Button({
    title,
    onPress,
    ...rest
} : Props) {
    return (
        <Container>
            <GestureHandlerView>
                <ButtonContainer onPress={onPress} {...rest}>
                    <Title>
                        { title }
                    </Title>
                </ButtonContainer>
            </GestureHandlerView>
        </Container>
    );
}
import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

export const Container = styled.View`
    flex: 1;
`;

export const Header = styled.View`
    width: 100%;
    height: 325px;

    background-color: ${({ theme }) => theme.colors.header};
    padding: 25px;
    padding-top: ${getStatusBarHeight() + 30}px;
`;

export const Title = styled.Text`
    color: ${({ theme }) => theme.colors.shape};
    font-family: ${({ theme }) => theme.fonts.secondary_600};
    font-size: ${RFValue(30)}px;

    margin-top: 24px;
`;

export const Subtitle = styled.Text`
    color: ${({ theme }) => theme.colors.shape};
    font-family: ${({ theme }) => theme.fonts.secondary_400};
    font-size: ${RFValue(15)}px;

    margin-top: 24px;
`;
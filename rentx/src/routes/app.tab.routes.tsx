import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTheme } from 'styled-components'

import HomeSvg from '../assets/home.svg'
import CarSvg from '../assets/carTab.svg'
import PeopleSvg from '../assets/peopleTab.svg'

import { Home } from '../screens/Home'
import { MyCars } from '../screens/MyCars'
import { Profile } from '../screens/Profile'

import { AppStackRoutes } from './app.stack.routes'
import { Platform } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

const { Navigator, Screen } = createBottomTabNavigator();

export function AppTabRouter(){
    const theme = useTheme();

    return (
        <Navigator 
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.main,
                tabBarInactiveTintColor: theme.colors.text_detail,
                tabBarShowLabel: false,
                tabBarStyle: {
                    paddingVertical: Platform.OS === 'ios' ? 20 : 0,
                    height: RFValue(78),
                    backgroundColor: theme.colors.background_primary
                }
            }}
        >
            <Screen 
                name="HomeTab"
                component={AppStackRoutes}
                options={{
                    tabBarIcon: ({ color }) => (
                        <HomeSvg width={RFValue(24)} height={RFValue(24)} fill={color} />
                    )
                }}
            />
            <Screen 
                name="MyCars"
                component={MyCars}
                options={{
                    tabBarIcon: ({ color }) => (
                        <CarSvg width={RFValue(24)} height={RFValue(24)} fill={color} />
                    )
                }}
            />
            <Screen 
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ color }) => (
                        <PeopleSvg width={RFValue(24)} height={RFValue(24)} fill={color} />
                    )
                }}
            /> 
        </Navigator>
    )
}
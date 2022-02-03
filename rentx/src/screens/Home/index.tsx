import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native'
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNetInfo } from '@react-native-community/netinfo';
import { synchronize } from '@nozbe/watermelondb/sync';
import { database } from '../../database';

import Animated, {
   useSharedValue,
   useAnimatedStyle,
   useAnimatedGestureHandler,
   withSpring
} from 'react-native-reanimated'

const ButtonAnimated = Animated.createAnimatedComponent(RectButton)

import { RectButton, PanGestureHandler } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons'
import Logo  from '../../assets/logo.svg'
import CarDTO from '../../dtos/CarDTO'
import api from '../../services/api'

import { Car } from '../../components/Car' 
import { Car as ModelCar } from '../../database/models/Car'
import { LoadAnimation } from '../../components/LoadAnimation'

import {
   Container,
   Header,
   TotalCars,
   HeaderContent,
   CarList,
} from './styles';

export function Home(){
   const [cars, setCars] = useState<ModelCar[]>([]);
   const [loading, setLoading] = useState(true);

   const positionY = useSharedValue(0);
   const positionX = useSharedValue(0);
   
   const netInfo = useNetInfo();
   const synchronizing = useRef(false);

   const navigation = useNavigation<any>();

   const theme = useTheme();

   const myCarsButtonStyle = useAnimatedStyle(() => {
      return {
         transform: [
            { translateX: positionX.value },
            { translateY: positionY.value },
         ]
      }
   })

   const onGestureEvent = useAnimatedGestureHandler({
      onStart(_, ctx: any){
         ctx.positionX = positionX.value;
         ctx.positionY = positionY.value;
      },
      onActive(event, ctx: any){
         positionX.value = ctx.positionX + event.translationX;
         positionY.value = ctx.positionY + event.translationY
      },
      onEnd(){
         positionX.value = withSpring(0);
         positionY.value = withSpring(0);
      }
   })

   async function offlineSynchronize(){
      await synchronize({
         database,
         pullChanges: async ({ lastPulledAt }) => {
            const response = await api
            .get(`cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`);

            const { changes, latestVersion } = response.data;
            return { changes, timestamp: latestVersion }
         },
         pushChanges: async ({ changes }) => {
            const user = changes.users;
            await api.post('/users/sync', user);
         },
      });
   }

   function handleCarDetails(car: CarDTO) {
      navigation.navigate('CarDetails', { car })
   }

   function handleOpenMyCars(car: CarDTO) {
      navigation.navigate('MyCars')
   }

   useEffect(() => {
      let isMounted = true;

      async function fetchCars() {
         try {
            const carCollection = database.get<ModelCar>('cars');
            const cars = await carCollection.query().fetch();

            if(isMounted){
               setCars(cars);
            }
         } catch (error) {
            console.log(error);
         } finally {
            if(isMounted){
               setLoading(false);
            }
         }
      }

      fetchCars();
      return () => {
         isMounted = false;
      }
   },[]);

   // useEffect(() => {
   //    const syncChanges = async () => {
   //       if(netInfo.isConnected && !synchronizing.current) {
   //          synchronizing.current = true;
   //          try {
   //             offlineSynchronize();
   //          } catch (err){
   //             console.log(err);
   //          } finally {
   //             synchronizing.current = false;
   //          }
   //       }
   //       syncChanges();
   //    }
   // },[netInfo.isConnected])

   useEffect(() => {
      if(netInfo.isConnected == true) {
         offlineSynchronize();
      }
   },[netInfo.isConnected])


   return (
      <Container>
         <StatusBar 
           barStyle="light-content"
           backgroundColor="transparent"
           translucent
         />
         <Header>
            <HeaderContent>
               <Logo 
                  width={RFValue(108)}
                  height={RFValue(12)}
               />
               {
                  !loading &&
                  <TotalCars>
                     Total de {cars.length} carros
                  </TotalCars>
               }
            </HeaderContent>
         </Header>
         { loading ? <LoadAnimation/> : 
         <CarList 
            data={cars}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => 
               <Car data={item} onPress={() => handleCarDetails(item)} /> 
            }
         />
         }

         <PanGestureHandler onGestureEvent={onGestureEvent}>
            <Animated.View
               style={[
                  myCarsButtonStyle,
                  {
                     position: 'absolute',
                     bottom: 13,
                     right: 22
                  }
               ]}
            >
               <ButtonAnimated 
                  onPress={() => handleOpenMyCars}
                  style={[styles.button, {backgroundColor: theme.colors.main}]}
               >
                  <Ionicons 
                     name="ios-car-sport" 
                     size={32}
                     color={theme.colors.shape}
                  />
               </ButtonAnimated>
            </Animated.View>
         </PanGestureHandler>

      </Container>
   );
}

const styles = StyleSheet.create({
   button: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center'
   }
})
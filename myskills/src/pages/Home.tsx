import React, { useState, useEffect } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Platform,
  FlatList,
} from 'react-native'
import { Button } from '../components/Button'
import { SkillCard } from '../components/SkillCard'

interface SkillData {
  id: string
  name: string
}

export function Home(){
  const [newSkill, setNewSkill] = useState('')
  const [mySkills, setMySkills] = useState<SkillData[]>([])
  const [greeting, setGretting] = useState('')

  function handleAddNewSkill(){
    const data = {
      id: String(new Date().getTime()),
      name: newSkill
    }

    setMySkills(oldState => [...oldState, data])
  }

  function handleRemoveSkill(id: string){
    setMySkills(oldState => oldState.filter(
      skill => skill.id !== id
    ))
  }

  useEffect(() => {
    const currentHour = new Date().getHours()
    
    if(currentHour < 12) {
      setGretting('Good morning')
    } else if(currentHour >= 12 && currentHour < 18){
      setGretting('Good afternoon')
    } else{
      setGretting('Good night')
    }
  }, [])

  return (
    <View style={styles.container}>

      <Text style={styles.title} testID='welcome'>
        Welcome, Caio.
      </Text>

      <Text style={styles.greetings}>
        { greeting }
      </Text>

      <TextInput
        testID="input-new" 
        style={styles.input}
        placeholder="New skill"
        placeholderTextColor="#555"
        onChangeText={setNewSkill}
      />

      <Button
        testID='button-add'
        onPress={handleAddNewSkill} 
        title='Add'
      />

      <Text style={[styles.title, {marginVertical: 50}]}>
        My Skills
      </Text>

      {
        mySkills && 
      <FlatList 
        testID="flat-list-skills"
        data={mySkills}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="never"
        renderItem={({ item }) => (
          <SkillCard 
            skill={item.name} 
            onPress={() => handleRemoveSkill(item.id)}
          />
        )}
      />
      }

      {/* <ScrollView showsVerticalScrollIndicator={false}>
      {
        mySkills.map(skill => (
          <SkillCard key={skill} skill={skill} />
        ))
      }
      </ScrollView> */}

    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121015',
    paddingVertical: Platform.OS == 'ios' ? 70 : 40,
    paddingHorizontal: 30
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold'
  },
  input: {
    backgroundColor: '#1F1E25',
    color: '#FFF',
    padding: Platform.OS == 'ios' ? 15 : 10,
    fontSize: 18,
    marginTop: 10,
    borderRadius: 7
  },
  greetings: {
    color: '#FFF'
  }
})

import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import { Fontisto, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'

function Login({ navigation }) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const auth = FIREBASE_AUTH

    const signIn = async (navigation) => {
        setLoading(true)

        try {
            const response = await signInWithEmailAndPassword(auth, email.trim(), password)
        } catch (error) {
            console.log(error)
            alert('Sign in failed: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>{'Login'}</Text>

            <View style={styles.inputWrapper}>

            {/* Email */}
            <Fontisto style={styles.icon} name="email" size={25} color="black" />
            <TextInput 
                value={email}
                placeholder="Email"
                style={styles.textInput}
                autoCapitalize='none'
                onChangeText={(text) => setEmail(text)}
            />
            </View>

            {/* Pass word */}
            <View style={styles.inputWrapper}>
                <Fontisto style={styles.icon} name="locked" size={24} color="black" />
                <TextInput 
                    secureTextEntry={true}
                    placeholder="Password"
                    style={styles.textInput}
                    autoCapitalize='none'
                    onChangeText={(text) => setPassword(text)}
                />
                <Ionicons style={styles.icon} name="eye" size={25} color="black" />
            </View>

            {/* Done */}
            {loading ? (<ActivityIndicator size='large' color='#0000ff' />) :
                (
                    <TouchableOpacity 
                      style={[styles.button, {marginTop: 45}]}
                      onPress={() => signIn(navigation)}
                    >
                      <Text style={styles.textButton}>{'Done'}</Text>
                    </TouchableOpacity>
                )
            }
            
            <Text style={{}}>{'Forgot password'}</Text>
            
        </View>
    )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    marginVertical: 35,
  },
  inputWrapper: {
    flexDirection: 'row',
    width: '75%',
    height: 50,
    backgroundColor: 'lightgray',
    marginVertical: 15,
    alignItems: 'center',
    borderRadius: 15,
    paddingLeft: 5,
  },
  textInput: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    width: '70%',
  },
  icon: {
    padding: 10
  },
  button: {
    width: '65%',
    height: 50,
    borderRadius: 45,
    backgroundColor: '#00E426',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginVertical: 10,
  },
  textButton: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black'
  }
})

export default Login
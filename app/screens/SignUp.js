
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import { Fontisto, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react'
import { db, FIREBASE_AUTH } from '../../FirebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from "firebase/firestore";

function SignUp({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const auth = FIREBASE_AUTH

  const createUser = async (uid) => {
    try {
      // Tạo một tài liệu mới trong collection "users" với ID là uid
      const userRef = doc(db, "Users", uid);  // Collection "users", Document ID là uid
  
      // Dữ liệu người dùng sẽ được lưu
      const userData = {
        id: uid,
        idOfLikedAlbums: [],
        idOfLikedSingers: [],
        idOfLikedSongs: [],
        idOfRecentlySongs: [],
        image: "https://i.imgur.com/OHBlxAo.jpeg",
        name: "New account"
      };
  
      // Lưu dữ liệu vào Firestore
      await setDoc(userRef, userData);
  
      console.log('User created in Firestore');
    } catch (error) {
      console.error("Error creating user: ", error);
      alert('Error creating user: ' + error.message);
    }
  };

  const signUp = async () => {
    setLoading(true);
  
    try {
      // Tạo tài khoản với email và mật khẩu
      const response = await createUserWithEmailAndPassword(auth, email.trim(), password);
  
      // Gọi hàm createUser để tạo người dùng trên Firestore
      createUser(response.user.uid);
    } catch (error) {
      console.log(error);
      alert('Sign up failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

        <Fontisto name="music-note" size={65} color="blue" />

        <Text style={styles.title}>{'Create New Account'}</Text>
        
        {/* Email */}
        <View style={styles.inputWrapper}>
            <Fontisto style={styles.icon} name="email" size={25} color="black" />
            <TextInput 
                value={email}
                placeholder="Email"
                style={styles.textInput}
                autoCapitalize='none'
                onChangeText={(text) => setEmail(text)}
            />
        </View>

        {/* Password */}
        <View style={styles.inputWrapper}>
            <Fontisto style={styles.icon} name="locked" size={24} color="black" />
            <TextInput 
                value={password}
                placeholder="Password"
                style={styles.textInput}
                secureTextEntry={true}
                autoCapitalize='none'
                onChangeText={(text) => setPassword(text)}
            />
            <Ionicons style={styles.icon} name="eye" size={25} color="black" />
        </View>

        {/* Confirm password */}
        <View style={styles.inputWrapper}>
            <Fontisto style={styles.icon} name="locked" size={24} color="black" />
            <TextInput 
                placeholder="Confirm Password"
                style={styles.textInput}
                secureTextEntry={true}
                autoCapitalize='none'
            />
            <Ionicons style={styles.icon} name="eye" size={25} color="black" />
        </View>

        {/* Done */}
        {loading ? (<ActivityIndicator size='large' color='#0000ff' />) :
                (
                    <TouchableOpacity 
                      style={[styles.button, {marginTop: 45}]}
                      onPress={() => signUp()}
                    >
                      <Text style={styles.textButton}>{'Done'}</Text>
                    </TouchableOpacity>
                )
        }

        <TouchableOpacity 
          style={[styles.button, {backgroundColor:'#F05637'}]} 
          onPress={() => {navigation.navigate('Launch')}}
        >
          <Text style={[styles.textButton, {color:'black'}]}>{'Cancel'}</Text>
        </TouchableOpacity>
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

export default SignUp
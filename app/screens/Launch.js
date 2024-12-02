import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native'

function LaunchScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/LaunchScreen.png')} style={styles.image} />
      <Image source={require('../../assets/Image33.png')} style={{marginBottom:'60%'}} />

      <Text style={styles.title}>{'Your Music'}</Text>
      <Text style={[styles.title,{marginBottom: '20%'}]}>{'Your Artists'}</Text>

      <TouchableOpacity 
        style={[styles.button, 
        {backgroundColor: '#171717'}]}
        onPress={() => {navigation.navigate('SignUp')}}
      >
        <Text style={{color: 'white', fontSize: 18}}>{'Create an account'}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, 
        {backgroundColor: 'white'}]}
        onPress={() => {navigation.navigate('Login')}}
      >
        <Text style={{color: '#30B4FF', fontSize: 18}} >{'I already have an acount'}</Text>
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
  image: {
    width:'100%', 
    height:'100%',
    position:'absolute',
    opacity: 0.9,
  },
  title: {
    fontSize: 33,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 5,
  },
  button: {
    width: '80%',
    height: 55,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  }
})

export default LaunchScreen
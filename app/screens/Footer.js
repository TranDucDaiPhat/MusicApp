import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome, AntDesign, MaterialIcons } from '@expo/vector-icons';

function Footer({ navigation, songs, active }) {

    return (
        <View style={styles.footer}>
            {/* home */}
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => {
                    navigation.navigate('Home')
                }}
            >
                <AntDesign name="home" size={27} color={active == 'Home' ? "blue" : 'black'} style={styles.icon} />
                <Text style={{fontSize: 13}}>{'Trang chủ'}</Text>
            </TouchableOpacity>

            {/* search */}
            <TouchableOpacity style={styles.button}>
                <FontAwesome name="search" size={27} color={active == 'Search' ? "blue" : 'black'} style={styles.icon} />
                <Text style={{fontSize: 13}}>{'Tìm kiếm'}</Text>
            </TouchableOpacity>

            {/* feed */}
            <TouchableOpacity style={styles.button}>
                <MaterialIcons name="feed" size={27} color={active == 'Feed' ? "blue" : 'black'} style={styles.icon} />
                <Text style={{fontSize: 13}}>{'Bài đăng'}</Text>
            </TouchableOpacity>

            {/* library */}
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => {
                    navigation.navigate('Library', {songs})
                }}
            >
                <MaterialIcons name="library-music" size={27} color={active == 'Library' ? "blue" : 'black'} style={styles.icon} />
                <Text style={{fontSize: 13}}>{'Thư viện'}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    icon: {
      paddingTop: 10,
      paddingBottom: 5,
    },
    footer: {
        position:'absolute', 
        bottom: 0, 
        flexDirection:'row', 
        paddingBottom: 5,
        justifyContent:'space-around', 
        borderTopWidth: 1,
        width: '100%',
        borderColor: 'lightgray',
        backgroundColor: '#F2F0F0'
    },
    button: {
        alignItems: 'center'
    },  
  })

export default Footer
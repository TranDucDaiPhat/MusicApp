import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Entypo, } from '@expo/vector-icons';
import { memo } from 'react'

function Song ({index, listSong, navigation, dir, setCurrentListSong, setCurrentIndex, isLiked}) {
    const song = listSong[index]
    return (
        <TouchableOpacity 
            style={styles.song} 
            onPress={() => {
                setCurrentListSong(listSong)
                setCurrentIndex(index)
                navigation.navigate('PlaySong',{dir, isLiked})
            }}
        >
            <View style={{flexDirection:'row'}}>
                <Image src={song.image} style={{width:55, height:55, borderRadius: 8}} />
                <View style={{marginLeft: 2, padding: 5}}>
                    <Text style={{fontWeight:'bold',fontSize:15}}>{song.name}</Text>
                    <Text>{song.author}</Text>
                </View>
            </View>
            <TouchableOpacity>
                <Entypo name="dots-three-horizontal" size={22} color="gray"/>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    song: {
      alignItems:'center',
      justifyContent:'space-between', 
      alignItems:'center', 
      flexDirection:'row', 
      marginBottom: 15
    },
})
  
export default memo(Song) 
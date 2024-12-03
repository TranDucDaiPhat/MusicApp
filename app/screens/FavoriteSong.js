import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { AntDesign, MaterialIcons, } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { ListSongContext } from '../../App';
import Footer from './Footer';
import PlayingBar from './PlayingBar';
import Song from './Song';

function FavoriteSong ({ route, navigation}) {
    const {data, songs} = route.params;
    const [favoriteSongs,setFavoriteSongs] = useState([])

    const [currentListSong, setCurrentListSong, currentIndex, setCurrentIndex, status, setStatus, sound, , userInfo] = useContext(ListSongContext)
    
    useEffect(() => {
        const listSong = data.map((id) => {
            return songs.find((song) => {
                return song.id == id
            })
        })
        setFavoriteSongs(listSong)
    },[])

    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <View style={{flexDirection:'row', justifyContent: 'space-between', marginVertical: 10}} >
                    <TouchableOpacity onPress={() => {navigation.goBack()}}>
                        <AntDesign name="left" size={27} color="gray" />
                    </TouchableOpacity>
                    <MaterialIcons name="screen-share" size={27} color="gray" />
                </View>

                <ScrollView> 
                    <Text style={{textAlign:'center', fontSize: 21, fontWeight: 'bold'}} >{'Bài hát yêu thích'}</Text>
                    <Text style={{textAlign:'center', color: 'gray', fontSize: 13}} >{`${favoriteSongs.length} bài hát • Đã lưu vào thư viện`}</Text>
                    <View style={{marginVertical: 15}} />
                    {/* List song */}
                    {
                        favoriteSongs.map((song, index) => {
                            return <Song 
                                        index={index} 
                                        listSong={favoriteSongs}
                                        navigation={navigation} 
                                        dir={'Bài hát yêu thích'}
                                        key={song.id}
                                        setCurrentListSong={setCurrentListSong}
                                        setCurrentIndex={setCurrentIndex}
                                        isLiked={true}
                                    />
                        })
                    }
                    <View style={{height:125}} />
                </ScrollView>
                {/* Playing */}
            </View>
            
            {
                currentListSong.length > 0 ? <PlayingBar song={currentListSong[currentIndex]}/> : <></>
            }

            {/* footer */}
            <Footer navigation={navigation} songs={songs} />
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    paddingHorizontal: 15,
    paddingTop: 45,
    justifyContent: 'center',
  },
  footer: {
    flexDirection:'row', 
    paddingBottom: 5,
    justifyContent:'space-around', 
    position:'fixed', 
    bottom: 0, 
    borderTopWidth: 1,
    borderColor: 'lightgray',
  },
  icon: {
    padding: 8
  },
  song: {
    alignItems:'center',
    justifyContent:'space-between', 
    alignItems:'center', 
    flexDirection:'row', 
    marginBottom: 15
  },
  statusBar: {
    flexDirection:'row', 
    justifyContent:'space-between', 
    marginVertical: 10
  }
})

export default FavoriteSong;

import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import { FontAwesome, AntDesign, MaterialIcons, Entypo, } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { ListSongContext } from '../../App';
import Footer from './Footer';
import PlayingBar from './PlayingBar';
import Song from './Song';

function Topic ({ route, navigation}) {
    const {data, songs, dir, singerName} = route.params;
    const [topicSongs,setTopicSongs] = useState([])

    const [currentListSong, setCurrentListSong, currentIndex, setCurrentIndex, status, setStatus, sound, ,userInfo] = useContext(ListSongContext)
    
    useEffect(() => {
        const listSong = data.songIds.map((id) => {
            return songs.find((song) => {
                return song.id == id
            })
        })
        setTopicSongs(listSong)
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
                    {/* Topic */}
                    <View style={{flexDirection:'row'}}>
                        <Image src={data.image} style={{width: 135, height: 135, borderRadius: 8}} />
                        <View style={{justifyContent: 'center', marginLeft: 15, width: 0, flexGrow: 1}}>
                            <Text style={{fontSize: 19, fontWeight:'bold',}}>{data.name}</Text>

                            {singerName 
                                ? <Text>{singerName}</Text> 
                                : <View style={{flexDirection: 'row'}}>
                                    <View style={{flexDirection: 'row', marginTop: 7}}>
                                        <AntDesign name="heart" size={24} color="red" style={{marginRight: 5}}/>
                                        <Text>{data.like}</Text>
                                    </View>
                                </View>
                            }
                        </View>
                    </View>

                    {/* status bar */}
                    <View style={styles.statusBar}>
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <AntDesign name="hearto" size={27} color="gray" style={styles.icon} />
                            <Entypo name="dots-three-horizontal" size={27} color="gray" style={styles.icon}/>
                        </View>

                        <View style={{flexDirection:'row', alignItems: 'center' }}>
                            <FontAwesome name="random" size={27} color="gray" style={styles.icon}/>
                            <AntDesign name="play" size={42} color="black" style={styles.icon}/>
                        </View>
                        
                    </View>

                    {/* List song */}
                    {
                        topicSongs.map((song, index) => {
                            return <Song 
                                        index={index} 
                                        listSong={topicSongs}
                                        navigation={navigation} 
                                        dir={dir}
                                        key={song.id}
                                        setCurrentListSong={setCurrentListSong}
                                        setCurrentIndex={setCurrentIndex}
                                        isLiked={userInfo.idOfLikedSongs.some((id) => id==song.id)}
                                    />
                        })
                    }
                    <View style={{height:145}} />
                </ScrollView>
                {/* Playing */}
            </View>
            
            {
                currentListSong.length > 0 ? <PlayingBar song={currentListSong[currentIndex]}/> : <></>
            }

            {/* footer */}
            <Footer songs={songs} navigation={navigation} />
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

export default Topic;

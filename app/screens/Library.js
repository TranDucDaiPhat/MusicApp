import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native'
import { FontAwesome, AntDesign, Entypo, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { ListSongContext } from '../../App'; 
import Footer from './Footer';
import PlayingBar from './PlayingBar';
import Song from './Song';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

const initUserData = [
    {
        icon: <Entypo name="beamed-note" size={27} color="blue" />,
        name: 'Bài hát',
        list: [],
    },
    {
        icon: <MaterialIcons name="album" size={27} color="black" />,
        name: 'Album',
        list: [],
    },
    {
        icon: <Ionicons name="people" size={27} color="orange" />,
        name: 'Ca sĩ',
        list: [],
    },
    {
        icon: <MaterialCommunityIcons name="playlist-music" size={27} color="red" />,
        name: 'Playlist',
        list: [],
    },
    {
        icon: <MaterialCommunityIcons name="download-circle-outline" size={27} color="purple" />,
        name: 'Đã tải',
        list: [],
    },
]

function changeNavigate(item, navigation, songs) {
    if (item.name == 'Bài hát') {
        navigation.navigate('FavoriteSong',{data:item.list, songs})
    } else if (item.name == 'Album') {
        // navigation.navigate('FavoriteSong',{data:item.list, albums})
    }
}

function MyFavorite({item, navigation, songs}) {
    return (
        <TouchableOpacity style={styles.itemWrapper} onPress={() => changeNavigate(item, navigation, songs)}>
            {item.icon}
            <Text style={{fontSize: 16}}>{item.name}</Text>
            <Text style={{color:'gray'}}>{item.list.length}</Text>
        </TouchableOpacity>
    )
}

function Library ({ route, navigation }) {
    const {songs} = route.params

    const [currentListSong, setCurrentListSong, currentIndex, setCurrentIndex, status, setStatus, sound, ,userInfo] = useContext(ListSongContext)
    
    const getMyFavoriteList = () => {
        initUserData[0].list = userInfo.idOfLikedSongs
        initUserData[1].list = userInfo.idOfLikedAlbums
        initUserData[2].list = userInfo.idOfLikedSingers
        // initUserData.playlist.count = userInfo.idOfLikedSongs.length
        return initUserData
    }

    const getRecentlySongs = () => {
        const listSong = userInfo.idOfRecentlySongs.map((id) => {
            return songs.find((song) => {
                return song.id == id
            })
        })
        return listSong
    }

    // idOfRecentlySongs
    const [myFavoriteList, setMyFavoriteList] = useState([])
    const [myRecentlySongs, setRecentlySongs] = useState([])

    useEffect(() => {
        setMyFavoriteList(getMyFavoriteList())
        setRecentlySongs(getRecentlySongs())
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => {navigation.goBack()}}>
                        <AntDesign name="left" size={27} color="gray" />
                    </TouchableOpacity>
                    <Text style={{fontSize: 24, fontWeight: 700, marginLeft: 15}}>{'Thư viện'}</Text>
                    <TouchableOpacity style={{flex:1}} onPress={() => FIREBASE_AUTH.signOut()}>
                        <Text style={{textAlign:'right', fontSize: 16, color:'gray'}}>{'Đăng xuất'}</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView>
                    {/* account */}
                    <TouchableOpacity style={styles.account}>
                        <Image src={userInfo.image} style={{width: 45, height: 45, borderRadius:45}} />
                        <Text style={{fontSize: 16, marginHorizontal: 5}}>{'Thông tin tài khoản'}</Text>
                        <AntDesign name="right" size={24} color="black" />
                    </TouchableOpacity>

                    {/* My favorite */}
                    <Text style={{fontSize: 21, fontWeight: 700, marginVertical: 15}}>{'Nội dung yêu thích'}</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={myFavoriteList}
                        keyExtractor={item => item.name}
                        renderItem={({item}) => {
                            return (
                                <MyFavorite item={item} navigation={navigation} songs={songs} />
                            )
                        }} 
                    />

                    {/* recently songs */}
                    <Text style={{fontSize: 21, fontWeight: 700, marginTop: 55, marginBottom: 15}}>{'Nghe gần đây'}</Text>
                    {
                        myRecentlySongs.map((song, index) => {
                            return <Song 
                                        index={index} 
                                        listSong={myRecentlySongs}
                                        navigation={navigation} 
                                        dir={'Nghe gần đây'}
                                        key={song.id}
                                        setCurrentListSong={setCurrentListSong}
                                        setCurrentIndex={setCurrentIndex}
                                        isLiked={userInfo.idOfLikedSongs.some((id) => id==song.id)}
                                    /> 
                        })
                    }

                    {/* playlist suggestion */}
                    <Text style={{fontSize: 21, fontWeight: 700, marginTop: 55, marginBottom: 15}}>{'Playlist gợi ý'}</Text>

                </ScrollView>
            </View>

            {/* Playing */}
            {
                currentListSong.length > 0 ? <PlayingBar song={currentListSong[currentIndex]}/> : <></>
            }

            {/* footer */}
            <Footer navigation={navigation} songs={songs} active={'Library'} />
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
    width: '100%'
  },
  account: {
    height: 65,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 25,
    marginVertical: 25,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  itemWrapper: {
    width: 115,
    height: 115,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'space-around',
    padding: 12,
    marginRight: 15,
  },
})

export default Library;

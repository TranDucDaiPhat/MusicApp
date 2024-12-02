import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, FlatList } from 'react-native'
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { ListSongContext } from '../../App';
import Footer from './Footer';
import PlayingBar from './PlayingBar';


function SongSuggestion({item, navigation, setCurrentIndex, setCurrentListSong, isLiked}) {
  return (
    <TouchableOpacity 
        style={styles.suggestionWrapper}
        onPress={() => {
            setCurrentListSong([item])
            setCurrentIndex(0)
            navigation.navigate('PlaySong', {dir:'Có thể bạn muốn nghe', isLiked})
        }}
    >
      <Image src={item.image} style={{width: 193, height: '50%'}} />

      <View style={styles.suggestionInfo}>
        <Text numberOfLines={1} style={{color:'white', fontWeight:'bold'}}>{item.name}</Text>
        <Text numberOfLines={1} style={{color:'white'}}>{item.author}</Text>
      </View>
    </TouchableOpacity>
  )
}

function Topic({data, navigation, songs}) {
    
    return (
        <TouchableOpacity 
            style={styles.topicWrapper}
            onPress={() => {navigation.navigate('Topic', {data, songs, dir:data.name})}}
        >
            <Image src={data.image} style={{width: 155, height: 155, borderRadius: 8}} />

            <Text numberOfLines={2} style={{marginVertical: 5}}>{data.name}</Text>
        </TouchableOpacity>
    )
}

function Album({data, name, navigation, songs}) {
    return (
        <TouchableOpacity 
            style={styles.topicWrapper}
            onPress={() => {navigation.navigate('Topic', {data, songs, dir:data.name, singerName: name})}}
        >
            <Image src={data.image} style={{width: 155, height: 155, borderRadius: 8}} />

            <Text numberOfLines={2} style={{marginVertical: 5}}>{data.name}</Text>
        
            <Text style={{color:'gray'}}>{name}</Text>
        </TouchableOpacity>
    )
}

function TrendingSinger({singer, navigation, songs, albums, listSinger}) {
    const isFollow = false
    return (
        <View style={{marginBottom: 95, marginRight: 25, alignItems: 'center'}}>
            <TouchableOpacity 
                style={{alignItems: 'center'}}
                onPress={() => {navigation.navigate('Singer', {singer, songs, dir:singer?.nickname, albums, listSinger})}}
            >
                <Image src={singer.image} style={{width: 155, height: 155, borderRadius: 155}} />
            
                <Text numberOfLines={2} style={{marginVertical: 5}}>{singer?.nickname}</Text>
            </TouchableOpacity>

            {isFollow 
                ? <TouchableOpacity style={styles.followButton}>
                    <Text>{'Đã Follow'}</Text>
                </TouchableOpacity>

                : <TouchableOpacity style={styles.notFollowButton}>
                    <Text style={{color:'white'}}>{'Follow'}</Text>
                </TouchableOpacity> 
            }
            
        </View>
    )
}



function Home({ navigation }) {
    const [topics, setTopics] = useState([])
    const [songs, setSongs] = useState([])
    const [albums, setAlbums] = useState([])
    const [singers, setSingers] = useState([])

    const [currentListSong, setCurrentListSong, currentIndex, setCurrentIndex, , , , , userInfo] = useContext(ListSongContext)
    
    useEffect(() => {
        fetch('https://672eeca7229a881691f14f5f.mockapi.io/song')
            .then((response) => response.json())
            .then((data) => {
                setSongs(data)
                // console.log(data)
            })
            .catch((error) => console.log(error))
        fetch('https://672eeca7229a881691f14f5f.mockapi.io/topic')
            .then((response) => response.json())
            .then((data) => {
                setTopics(data)
                // console.log(data)
            })
            .catch((error) => console.log(error))
        fetch('https://673e35fb0118dbfe860a85cc.mockapi.io/album')
            .then((response) => response.json())
            .then((data) => {
                setAlbums(data)
                // console.log(data)
            })
            .catch((error) => console.log(error))
        fetch('https://673e35fb0118dbfe860a85cc.mockapi.io/singer')
            .then((response) => response.json())
            .then((data) => {
                setSingers(data)
                // console.log(data)
            })
            .catch((error) => console.log(error))
    },[])

    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <ScrollView>
                    {/* header */}
                    <View style={styles.rowView}>
                        <Image source={require('../../assets/Image36.png')} style={styles.headerImage} />
                        <View style={styles.rowView}>
                            <FontAwesome name="bell-o" size={30} color="gray" style={styles.icon} />
                            <Image src={userInfo.image} style={styles.headerImage} />
                        </View>
                    </View>

                    <Text style={{color: 'gray', marginTop: 35}} >{'Good morning,'}</Text>
                    <Text style={{fontSize: 24, fontWeight:700, marginBottom: 15}} >{userInfo.name}</Text>

                    {/* search input */}
                    <View style={styles.searchWtapper}>
                        <FontAwesome name="search" size={24} color="black" style={styles.icon} />
                        <TextInput placeholder='Tìm kiếm bài hát của bạn' style={styles.searchInput} />
                    </View>

                    {/* suggestion */}
                    <Text style={[styles.subTitle,{marginBottom: 15}]}>{'Có thể bạn muốn nghe'}</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={songs.slice(0,10)}
                        keyExtractor={song => song.id}
                        renderItem={({item}) => {
                            return (
                                <SongSuggestion 
                                    item={item} 
                                    navigation={navigation} 
                                    setCurrentIndex={setCurrentIndex} 
                                    setCurrentListSong={setCurrentListSong} 
                                    isLiked={userInfo.idOfLikedSongs.some((id) => id==item.id)}
                                />
                            )
                        }} 
                    />

                    {/* topic */}
                    <View style={styles.subTitleWrapper}>
                        <Text style={styles.subTitle}>{'Chủ đề & thể loại '}</Text>
                        <AntDesign name="rightcircleo" size={24} color="black" />
                    </View>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={topics}
                        keyExtractor={topic => topic.id}
                        renderItem={({item}) => {
                            return (
                                <Topic data={item} navigation={navigation} songs={songs} />
                            )
                        }} 
                    />

                    {/* Album */}
                    <View style={styles.subTitleWrapper}>
                        <Text style={styles.subTitle}>{'Album hot '}</Text>
                        <AntDesign name="rightcircleo" size={24} color="black" />
                    </View>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={albums}
                        keyExtractor={album => album.id}
                        renderItem={({item}) => {
                            const singer = singers.find((singer) => singer.id == item.id)
                            return (
                                <Album data={item} name={singer?.nickname} navigation={navigation} songs={songs}/>
                            )
                        }} 
                    />

                    {/* trending singer */}
                    <View style={styles.subTitleWrapper}>
                        <Text style={styles.subTitle}>{'Ca sĩ nổi bật '}</Text>
                        <AntDesign name="rightcircleo" size={24} color="black" />
                    </View>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={singers}
                        keyExtractor={singer => singer.id}
                        renderItem={({item}) => {
                            return (
                                <TrendingSinger listSinger={singers} singer={item} navigation={navigation} songs={songs} albums={albums} />
                            )
                        }} 
                    />
                    <View style={{height:65}} />
                </ScrollView>

            </View>

            {/* Playing */}
            {
                currentListSong.length > 0 ? <PlayingBar song={currentListSong[currentIndex]}/> : <></>
            }

            {/* footer */}
            <Footer songs={songs} navigation={navigation} active={'Home'} />
            
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
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 700,
  },
  subTitleWrapper: {
    flexDirection:'row', 
    alignItems: 'center', 
    marginBottom: 15, 
    marginTop: 55,
  },
  headerImage: {
    width: 45,
    height: 45,
    borderRadius: 45,
  },
  icon: {
    padding: 8
  },
  searchWtapper: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 5,
    alignItems: 'center',
    marginBottom: 45,
    backgroundColor: 'white'
  },
  searchInput: {
    width: '85%',
    padding: 5,
  },
  suggestionWrapper: {
    width: 195, 
    height: 265, 
    justifyContent:'center', 
    borderWidth: 1, 
    borderColor: 'lightgray', 
    marginRight: 15,
    backgroundColor: '#211F1F',
    borderRadius: 12,
  },
  suggestionInfo: {
    position:'absolute', 
    width: '100%',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  topicWrapper: {
    width: 155,
    marginRight: 15,
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
  notFollowButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: 38,
    backgroundColor: 'black',
    borderRadius: 18,
  },
  followButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 95,
    height: 38,
    backgroundColor: '#DCDCDC',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'gray',
  }
})

export default Home;

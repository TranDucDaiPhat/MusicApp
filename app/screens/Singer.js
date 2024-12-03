import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native'
import { FontAwesome, AntDesign, Entypo, } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { ListSongContext } from '../../App'; 
import Footer from './Footer';
import PlayingBar from './PlayingBar';
import Song from './Song';
import { memo } from 'react'

function TrendingSinger({singer, navigation, songs, albums}) {
    const isFollow = false
    return (
        <View style={{marginBottom: 95, marginRight: 25, alignItems: 'center'}}>
            <TouchableOpacity 
                style={{alignItems: 'center'}}
                onPress={() => {navigation.navigate('Singer', {singer, songs, dir:singer.nickname, albums})}}
            >
                <Image src={singer.image} style={{width: 155, height: 155, borderRadius: 155}} />
            
                <Text numberOfLines={2} style={{marginVertical: 5}}>{singer.nickname}</Text>
            </TouchableOpacity>
            
        </View>
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
        </TouchableOpacity>
    )
}

function Singer ({ route, navigation}) {
    const {singer, songs, dir, albums, listSinger} = route.params;
    const [listAlbum, setListAlbum] = useState([])
    const [singerSongs,setSingerSongs] = useState([])
    const [follow,setFollow] = useState(() => {
        if (singer.follow >= 1000) {
            const result = (singer.follow / 1000).toFixed(1);
            return result.endsWith('.0') ? `${parseInt(result)}k` : `${result}k`
        } else {
            return singer.follow
        }
    })

    const [currentListSong, setCurrentListSong, currentIndex, setCurrentIndex, status, setStatus, sound] = useContext(ListSongContext)
    
    useEffect(() => {
        const listSong = singer.songIds.map((id) => {
            return songs.find((song) => {
                return song.id == id
            })
        })
        const listAlbum = singer.albumIds.map((id) => {
            return albums.find((album) => {
                return album.id == id
            })
        })
        setSingerSongs(listSong)
        setListAlbum(listAlbum)
    },[])

    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <TouchableOpacity onPress={() => {navigation.goBack()}}>
                    <AntDesign name="left" size={27} color="gray" />
                </TouchableOpacity>

                <ScrollView>
                    {/* singer info */}
                    <View style={{width:'100%',alignItems:'center',marginTop:25}} >
                        <Image src={singer.image} style={{width: 215, height: 215, borderRadius: 155}} />
                        <Text style={{textAlign:'center', fontSize: 25, fontWeight: 700, marginVertical: 10}}>{singer.nickname}</Text>
                        <Text style={{textAlign:'center', color: 'gray'}}>{`${follow} Followers`}</Text>
                    </View>

                    {/* status bar */}
                    <View style={styles.statusBar}>
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <TouchableOpacity style={styles.followButton}>
                                <Text style={{color:'white'}} >{'Follow'}</Text>
                            </TouchableOpacity>
                            <Entypo name="dots-three-horizontal" size={27} color="gray" style={styles.icon}/>
                        </View>

                        <View style={{flexDirection:'row', alignItems: 'center' }}>
                            <FontAwesome name="random" size={27} color="gray" style={styles.icon}/>
                            <AntDesign name="play" size={42} color="black" style={styles.icon}/>
                        </View>
                        
                    </View>
                    
    
                    {/* List song */}
                    <Text style={{fontSize: 18, fontWeight: 700, marginVertical: 15}} >{'Bài hát nổi bật'}</Text>
                    {
                        singerSongs.map((song, index) => {
                            return <Song 
                                        index={index} 
                                        listSong={singerSongs}
                                        navigation={navigation} 
                                        dir={dir}
                                        key={song.id}
                                        setCurrentListSong={setCurrentListSong}
                                        setCurrentIndex={setCurrentIndex}
                                    />
                        })
                    }

                    {/* Albums */}
                    <Text style={{fontSize: 18, fontWeight: 700, marginTop: 30, marginBottom: 15}}>{'Albums'}</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={listAlbum}
                        keyExtractor={album => album.id}
                        renderItem={({item}) => {
                            return (
                                <Album data={item} name={singer.nickname} navigation={navigation} songs={songs}/>
                            )
                        }} 
                    />

                    {/* singer info */}
                    <Text style={{fontSize: 18, fontWeight: 700, marginTop: 30, marginBottom: 10}}>{'Thông tin'}</Text>
                    <Text style={{color:'#5C5C5C', marginVertical: 10}} >{singer.moreInfo}</Text>

                    <Text style={{marginVertical: 5}}>{`Tên thật      ${singer.name}`}</Text>
                    {singer?.dayOfBirth && <Text style={{marginVertical: 10}}>{`Ngày sinh   ${singer.dayOfBirth}`}</Text>}
                    <Text style={{marginVertical: 5}}>{`Quốc gia     ${singer.country}`}</Text>
                    <Text style={{marginVertical: 5}}>{`Thể loại       ${singer.typeOfSong}`}</Text>

                    {/* more singer */}
                    <Text style={{fontSize: 18, fontWeight: 700, marginTop: 45, marginBottom: 15}}>{'Có thể bạn sẽ thích'}</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={listSinger.filter(s => s.id != singer.id)}
                        keyExtractor={singer => singer.id}
                        renderItem={({item}) => {
                            return (
                                <TrendingSinger singer={item} navigation={navigation} songs={songs} albums={albums} />
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
            <Footer songs={songs} navigation={navigation}/>
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
    marginVertical: 20
  },
  followButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 40,
    backgroundColor: 'black',
    borderRadius: 20,
    marginRight: 12,
  },
  topicWrapper: {
    width: 135,
    marginRight: 15,
  },
})

export default memo(Singer);

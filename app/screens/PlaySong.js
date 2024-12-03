import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { AntDesign, Entypo, Fontisto, MaterialCommunityIcons, FontAwesome  } from '@expo/vector-icons';
import Slider from '@react-native-community/slider'
import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { useContext } from 'react';
import { ListSongContext } from '../../App';
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../../FirebaseConfig';

function PlaySong ({ route, navigation }) {

    const {dir, isLiked} = route.params;
    const [currentListSong, , currentIndex, setCurrentIndex, status, setStatus, sound, setSound, userInfo, setUserInfo] = useContext(ListSongContext)

    const [currentSong, setCurrentSong] = useState(currentListSong[currentIndex])
    const [duration, setDuration] = useState('0:00')
    const [timer, setTimer] = useState(0)
    const [process, setProcess] = useState(0)
    const [like, setLike] = useState(isLiked)

    async function loadSong(newSong) {
        if (sound) sound.unloadAsync()
        const newSound = new Audio.Sound()

        await newSound.loadAsync({
            uri: newSong.audio
        })
        setStatus({...status,isPlay: true})
        await newSound.playAsync()
        setSound(newSound)
        newSound.getStatusAsync()
            .then(function(result) {
                let duration = Number.parseInt((result.durationMillis)/1000)
                let min = Number.parseInt(duration/60)
                let sec = duration - min*60
                setDuration(`${min}:${sec>9?sec:'0'+sec}`)
            })  
            .catch((error) => {console.log(error)})
    }

    useEffect(() => {
        loadSong(currentSong)
        const updateRecentlySong = async () => {
            let list = userInfo.idOfRecentlySongs
            let index = list.findIndex((id) => id==currentSong.id)
            if (index >= 0) {
                list.splice(index, 1)
            }
            if (list.length >= 10) {
                list.pop()
            }
            list.unshift(currentSong.id)

            const userDoc = doc(db, "Users", userInfo.id)
            await updateDoc(userDoc, {idOfRecentlySongs: list})
            setUserInfo({...userInfo, idOfRecentlySongs: list})
        }
        updateRecentlySong()
    },[])

    useEffect(() => {
        let timerId
        if (sound) {
            timerId = setInterval(() => {
                setTimer(prev => prev+1)
                sound.getStatusAsync().then(status => {
                    setProcess(status.positionMillis*100/status.durationMillis)
                })
            }, 500);
        }
        return () => clearInterval(timerId)
    },[sound])

    function playSound() {
        sound.playAsync();
    }

    function stopSound() {
        sound.pauseAsync();
    }

    function handlePlaySong() {
        setStatus({...status, isPlay: !status.isPlay})
        if(!status.isPlay) {
            playSound()
        } else {
            stopSound()
        }
    }

    function getTimer() {
        if (sound) {
            return sound.getStatusAsync()
                .then(function(result) {
                    let time = Number.parseInt((result.positionMillis)/1000)
                    let min = Number.parseInt(time/60)
                    let sec = time - min*60
                    return time ? `${min}:${sec>9?sec:'0'+sec}` : '0:00'
                })  
                .catch((error) => {console.log(error)})
        }
        else return '0:00'
    }

    function changeProcess(value) {
        if (sound) {
            setProcess(value)
            sound.getStatusAsync()
                .then(function(result) {
                    sound.setPositionAsync(value*result.durationMillis/100)
                })  
                .catch((error) => {console.log(error)})
        }
    }

    function changeCurrentSong(move) {
        if (move == 'next') {
            if (currentIndex < currentListSong.length-1) {
                setCurrentSong(currentListSong[currentIndex+1])
                setCurrentIndex(currentIndex+1)
                loadSong(currentListSong[currentIndex+1])
                setLike(userInfo.idOfLikedSongs.some((id) => id==currentListSong[currentIndex+1].id))
            } else {
                loadSong(currentListSong[currentIndex])
                setLike(userInfo.idOfLikedSongs.some((id) => id==currentListSong[currentIndex].id))
            }
        } else if (move == 'prev') {
            if (currentIndex > 0) {
                setCurrentSong(currentListSong[currentIndex-1])
                loadSong(currentListSong[currentIndex-1])
                setCurrentIndex(currentIndex-1)
                setLike(userInfo.idOfLikedSongs.some((id) => id==currentListSong[currentIndex-1].id))
            } else {
                loadSong(currentListSong[currentIndex])
                setLike(userInfo.idOfLikedSongs.some((id) => id==currentListSong[currentIndex].id))
            }
        }
    }

    function handleLikeSong(id) {
        setLike(!like)
        let listOfLike = userInfo.idOfLikedSongs
        if (like) {
            listOfLike = listOfLike.filter((oldId) => oldId != id)
        } else {
            listOfLike.push(id)
        }
        const updateUserInfo = async () => {
            const userDoc = doc(db, "Users", userInfo.id)
            await updateDoc(userDoc, {idOfLikedSongs: listOfLike})
            setUserInfo({...userInfo, idOfLikedSongs: listOfLike})
        }
        updateUserInfo()
    }

    return (
        <View style={styles.container}>
            {/* header */}
            <View style={{flexDirection:'row', justifyContent:'space-between', width: '100%'}}>
                <TouchableOpacity onPress={() => {navigation.goBack()}}>
                    <AntDesign name="down" size={27} color="white" />
                </TouchableOpacity>

                <View style={{alignItems:'center'}}>
                    <Text style={{color:'lightgray',fontSize:10}}>{'PHÁT TỪ'}</Text>
                    <Text style={{color:'white'}}>{dir}</Text>
                </View>

                <TouchableOpacity>
                    <Entypo name="dots-three-vertical" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <Image src={currentSong.image} style={{width: "100%",height: 255, marginVertical: 65}} />

            {/* song info */}
            <Text style={{color:'white', fontSize: 18, fontWeight: '600'}}>{currentSong.name}</Text>
            <Text style={{color:'lightgray', fontWeight: '600', marginTop: 5}}>{currentSong.author}</Text>

            <Slider
                style={{marginTop: 45, width: '100%'}}
                value={process}
                minimumValue={0}
                maximumValue={100}
                thumbTintColor='white'
                minimumTrackTintColor='white'
                maximumTrackTintColor='lightgray'
                onSlidingComplete={(value) => changeProcess(value)}
            />

            {/* timer */}
            <View style={{flexDirection:'row', justifyContent:'space-between', width: '90%'}}>
                <Text style={{color:'white'}}>{getTimer()}</Text>
                <Text style={{color:'white'}}>{duration}</Text>
            </View>

            {/* tool bar */}
            <View style={{flexDirection:'row', width: '100%', justifyContent:'space-around', marginVertical: 45, alignItems:'center'}}>
                <TouchableOpacity onPress={() => setStatus({...status,isRandom: !status.isRandom})}>
                    {status.isRandom 
                        ? <FontAwesome name="random" size={24} color="lightpink"/>
                        : <FontAwesome name="random" size={24} color="gray"/>
                    }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changeCurrentSong('prev')}>
                    <Fontisto name="step-backwrad" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        handlePlaySong()
                    }}
                >
                    {status.isPlay 
                        ? <AntDesign name="pausecircle" size={55} color="lightblue"/>
                        : <AntDesign name="play" size={55} color="white"/>
                    }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changeCurrentSong('next')}>
                    <Fontisto name="step-forward" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {setStatus({...status,isRepeat: !status.isRepeat})}}>
                    {status.isRepeat
                        ? <AntDesign name="reload1" size={25} color="lightpink" />
                        : <AntDesign name="reload1" size={25} color="gray" />
                    }
                </TouchableOpacity>
            </View>

            {/* like, comment */}
            <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%'}}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <TouchableOpacity onPress={() => handleLikeSong(currentSong.id)} >
                        {like
                            ? <AntDesign name="heart" size={27} color="red" style={styles.icon} />
                            : <AntDesign name="hearto" size={27} color="gray" style={styles.icon} />
                        }
                    </TouchableOpacity>
                    <Text style={{color:'gray'}}>{currentSong.like}</Text>

                    <TouchableOpacity style={{marginLeft: 15, alignItems:'center'}}>
                        <MaterialCommunityIcons name="comment-text-outline" size={24} color="gray" style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={{color:'gray'}}>{'952'}</Text>
                </View>

                <TouchableOpacity>
                    <AntDesign name="download" size={24} color="gray" style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 45,
        backgroundColor:'#2E2B2B',
        alignItems: 'center'
    },
    icon: {
        padding: 8
    },
})

export default PlaySong


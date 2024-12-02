import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { AntDesign, Fontisto } from '@expo/vector-icons';
import { useContext } from 'react';
import { ListSongContext } from '../../App';
import { Audio } from 'expo-av';

function PlayingBar({song}) {

    const [currentListSong, setCurrentListSong ,currentIndex, setCurrentIndex, status, setStatus, sound, setSound] = useContext(ListSongContext)

    async function loadSong(newSong) {
        if (sound) sound.unloadAsync()
        const newSound = new Audio.Sound()

        await newSound.loadAsync({
            uri: newSong.audio
        })
        setStatus({...status,isPlay: true})
        await newSound.playAsync()
        setSound(newSound)
    }

    function changeCurrentSong(move) {
        if (move == 'next') {
            if (currentIndex < currentListSong.length-1) {
                setCurrentIndex(currentIndex+1)
                loadSong(currentListSong[currentIndex+1])
            } else {
                loadSong(currentListSong[currentIndex])
            }
        } else if (move == 'prev') {
            if (currentIndex > 0) {
                setCurrentIndex(currentIndex-1)
                loadSong(currentListSong[currentIndex-1])
            } else {
                loadSong(currentListSong[currentIndex])
            }
        }
        setStatus({...status,isPlay:true})
    }

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

    return (
        <View style={styles.container}>
            <Image src={song.image} style={{width: 55, height: 55, borderRadius: 55}} />
            <View style={{marginLeft: 15, justifyContent:'center', flex:2}}>
                <Text numberOfLines={1} style={{color:'white',fontSize:15,fontWeight:600}}>{song.name}</Text>
                <Text style={{color:'white',fontSize:12}}>{song.author}</Text>
            </View>

            <TouchableOpacity onPress={() => changeCurrentSong('prev')}>
                <Fontisto name="step-backwrad" size={15} color="white" style={styles.icon} />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handlePlaySong}
            >
                {status.isPlay 
                    ? <AntDesign name="pausecircle" size={33} color="lightblue" style={styles.icon}/>
                    : <AntDesign name="play" size={33} color="white" style={styles.icon}/>
                }
            </TouchableOpacity>

            <TouchableOpacity onPress={() => changeCurrentSong('next')}>
                <Fontisto name="step-forward" size={15} color="white" style={styles.icon}/>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => {
                    sound.unloadAsync()
                    setCurrentListSong([])
                }}
            >
                <AntDesign name="close" size={24} color="white" style={styles.icon}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 70,
        backgroundColor:'#2E2B2B', 
        padding: 8, 
        flexDirection:'row', 
        justifyContent:'center', 
        alignItems: 'center',
        marginHorizontal: 5,
    },
    icon: {
      padding: 8,
    },
  })

export default PlayingBar
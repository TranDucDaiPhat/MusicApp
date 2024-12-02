import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useState, useEffect } from 'react'
import { createContext } from 'react'
import LaunchScreen from './app/screens/Launch'
import Login from './app/screens/Login'
import SignUp from './app/screens/SignUp'

const Stack = createNativeStackNavigator()

const InsideStack = createNativeStackNavigator();
const OutsideStack = createNativeStackNavigator();

export const ListSongContext = createContext()

function OutsideLayout() {
  return (
    <OutsideStack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='Launch' component={LaunchScreen}/>
      <Stack.Screen name='Login' component={Login}/>
      <Stack.Screen name='SignUp' component={SignUp}/>
    </OutsideStack.Navigator>
  )
}

export default function App() {
  const [user,setUser] = useState(null)
  // const [currentListSong, setCurrentListSong] = useState([])
  // const [currentIndex, setCurrentIndex] = useState()
  // const [status, setStatus] = useState({isPlay: false, isRepeat: false, isRandom: false})
  // const [sound, setSound] = useState()
  // const [userInfo, setUserInfo] = useState()
  // const usersCollectionRef  = collection(db, "Users")

  // Khi create account hoặc login 
  // -> user sẽ nhận giá trị 
  // -> gọi hàm onAuthStateChanged
  // -> setUser và render lại

  // useEffect(() => {
  //   const getUserInfo = async (uid) => {
  //     try {
  //       const userDocRef = doc(usersCollectionRef, uid);
  //       const userDoc = await getDoc(userDocRef);
  //       return userDoc.data();
  //     } catch (err) {
  //       console.log(err);
  //       return null; // Trả về null nếu có lỗi
  //     }
  //   }
  
  //   const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
  //     if (user) {
  //       const userInfo = await getUserInfo(user.uid); // Đợi dữ liệu từ getUserInfo
  //       setUserInfo({...userInfo, id: user.uid}); // Gọi setUserInfo sau khi có dữ liệu
  //       setUser(user);
  //     } else {
  //       setUserInfo(null); // Xử lý trường hợp người dùng đăng xuất
  //       setUser(null);
  //     }
  //   });
  
  //   return () => unsubscribe(); // Cleanup khi component unmount
  // }, []);

  return (
      <ListSongContext.Provider value={[]}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Outside'>
          {user 
            ? <Stack.Screen name='Inside' component={InsideLayout} options={{headerShown: false}} />
            : <Stack.Screen name='Outside' component={OutsideLayout} options={{headerShown: false}} /> 
          }
          </Stack.Navigator>
        </NavigationContainer>
      </ListSongContext.Provider>
  );
}


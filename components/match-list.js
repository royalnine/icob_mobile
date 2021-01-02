import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, AsyncStorage } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FetchingIndicator from 'react-native-fetching-indicator'


export default function MatchList(props) {

    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(false)
    let token = null

    const getData = async () => {
        token = await AsyncStorage.getItem('icob-token');
        // console.log("in getdata"+token)
        if (token) {
            
            getMatches()
            
        } else {
            props.navigation.navigate('Auth')
        }
    }

    const getMatches = async () => {
        token = await AsyncStorage.getItem('icob-token');
        // console.log("in get matches"+token)
        setLoading(true)
        fetch('https://icob-app.herokuapp.com/mainapp/matches/', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then(res => {
            return res.json()
        }) 
        .then(jsonRes => {
            setMatches(jsonRes)
            // console.log(jsonRes)
            setLoading(false)
        })
        .catch(error => {
            console.log(error)
            setLoading(false)
        })
    }

    // const saveToken = async (token) => {
    //     await AsyncStorage.setItem('icob-token', "2d7f62b73ed767c255683169f4bba306ca7d6b0c")
    // }

    useEffect(() => {
        // saveToken();
        getData();
    }, [])

    const matchClicked = (item) => {
        props.navigation.navigate('Detail', {match: item, opposition: item.opposition})
    }

    return (
        
        <View style={styles.container}>
        <FlatList  
            data={matches}
            renderItem={({item}) => (
                <TouchableOpacity onPress={() => matchClicked(item)}>
                    <View style={styles.item}>
                        <Text adjustsFontSizeToFit={true} style={styles.itemText}>{`${item.opposition} ${item.date}`}</Text>
                        <View style={styles.lineStyle} />
                    </View>
                </TouchableOpacity>
            )}
            keyExtractor = {(item, index) => item.id.toString()}
        />
        <FetchingIndicator isFetching={loading} message="Fetching matches" backdropColor='rgba(0, 0, 0, 0.50)' color='blue'/>
        </View>
    );
}

MatchList.navigationOptions = _ => ({
    title: "Matches"
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282C35',
    padding: 10
  },
  item: {
    flex: 1,
    padding: 10,
    height: 50,
    backgroundColor: '#282C35'
  },
  itemText: {
    color: '#fff',
    fontSize: 24
  },
  lineStyle:{
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  }
});
import { StatusBar } from "expo-status-bar";
import { Alert, Text, View, Pressable } from "react-native";
import tw from "twrnc";
import { Picker } from "@react-native-picker/picker";
import React, { useState, useEffect } from "react";
import { Audio } from 'expo-av';

let Minutes = [];
for (let i = 0; i <= 59; i++) {
  Minutes.push(i);
}

let Seconds = [];
for (let i = 0; i <= 59; i++) {
  Seconds.push(i);
}

function StartButton({ displayTime, pressed }) {
  return (
    <Pressable
    onPress={displayTime}
      style={tw`border-[6px] border-[${pressed?"#fc6d07":"#6784da"}] p-[10px] h-[200px] w-[200px] rounded-[200px] items-center justify-center`}
    >
      <Text style={tw`text-[${pressed?"#fc6d07":"#6784da"}] text-4xl`}>{pressed?"Stop":"Start"}</Text>
    </Pressable>
  );
}

function TimerPicker({ selectedSecond, selectedMinute, setSelectedMinute, setSelectedSecond }) {
  return (
    <View style={tw`flex-row`}>
      <View style={tw`flex-row`}>
        <Picker
          mode="dropdown"
          style={tw`w-[90px] h-[10px]`}
          itemStyle={tw`text-white`}
          selectedValue={selectedMinute}
          onValueChange={(itemValue, itemIndex) => setSelectedMinute(itemValue)}
        >
          {Minutes.map((min, index) => {
            return <Picker.Item label={min} value={min} key={index} />;
          })}
        </Picker>
        <Text style={tw`text-white mt-[100px]`}>Minutes</Text>
      </View>


      <View style={tw`flex-row`}>
        <Picker
          mode="dropdown"
          style={tw`w-[90px] h-[10px]`}
          itemStyle={tw`text-white`}
          selectedValue={selectedSecond}
          onValueChange={(itemValue, itemIndex) => setSelectedSecond(itemValue)}
        >
          {Seconds.map((min, index) => {
            return <Picker.Item label={min} value={min} key={index} />;
          })}
        </Picker>
        <Text style={tw`text-white mt-[100px]`}>Seconds</Text>
      </View>
    </View>
  );
}

function Counter({Mins, Secs}) {

  const [minutes, setMinutes] = useState(Mins);
  const [seconds, setSeconds] = useState(Secs);
  const [sound, setSound] = useState();

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync( require('./assets/Sounds/alarms.mp3')
    );
    setSound(sound);

    await sound.playAsync();

    useEffect(() => {
      return sound
        ? () => {
            console.log('Unloading Sound');
            sound.unloadAsync();
          }
        : undefined;
    }, [sound]);
  }

  
  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        if (minutes === 0) {
          clearInterval(timer);

          Alert.alert(
            'Okay! Timer has ended!',
            'Click to stop beep sound!',
            [
              {
                text: 'OK',
                onPress: () => {

                },
              },
            ],
            { cancelable: false }
          );

          playSound();
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, seconds]);

  // Add leading zero if minutes or seconds are less than 10
  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  return(
    <View>
      <Text style={tw`text-8xl text-white mt-[200px]`} >{`${formatTime(minutes)}:${formatTime(seconds)}`}</Text>
    </View>
  
  )
}

export default function App() {
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedSecond, setSelectedSecond] = useState(0);
  const [pressedState, setPressedState] = useState(false)

  const handleStartPress = (a, b) => {
    console.log(a, b);
    setPressedState(!pressedState);
  }

  return (
    <View style={tw`flex-1 flex-col items-center justify-center bg-[#090f15]`}>
      <View style={tw`h-[400px] items-center justify-center`}>
        {pressedState?(
          <Counter Mins={selectedMinute} Secs={selectedSecond}/>
        ):(
          <TimerPicker
          setSelectedSecond={setSelectedSecond}
          selectedMinute={selectedMinute}
          selectedSecond={selectedSecond}
          setSelectedMinute={setSelectedMinute}
        />
        )}
      </View>
      <View style={tw`flex-1`}>
        <StartButton pressed={pressedState} displayTime={()=>handleStartPress(selectedMinute,selectedSecond)} />
      </View>
      <StatusBar style="light" />
    </View>
  );
}

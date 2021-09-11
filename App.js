import React, { useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Clipboard,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Dimensions } from "react-native";
import Voice from "@react-native-voice/voice";

const App = () => {
  const [results, setResults] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const startValue = new Animated.Value(1);
  const endValue = 1.1;

  useEffect(() => {
    Animated.loop(
      Animated.spring(startValue, {
        toValue: endValue,
        friction: 1,
        useNativeDriver: true,
      }),
      { iterations: 1000 }
    ).start();
  }, [startValue, endValue]);

  const copyToClipboard = () => {
    Clipboard.setString(results.join(""));
  };

  useEffect(() => {
    const onSpeechResults = (e) => {
      setResults(e.value ?? []);
    };
    const onSpeechError = (e) => {
      console.error(e);
    };
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    return function cleanup() {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  async function toggleListening() {
    try {
      if (isListening) {
        await Voice.stop();
        setIsListening(false);
      } else {
        setResults([]);
        await Voice.start("es-AR");
        setIsListening(true);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View style={styles.container}>
      <Text>Press the button and start speaking.</Text>
      <TouchableOpacity
        style={[
          styles.recButton,
          {
            transform: [
              {
                scale: isListening ? startValue : 1,
              },
            ],
          },
        ]}
        onPress={toggleListening}
      >
        <View style={styles.recPoint} />
      </TouchableOpacity>
      <Text>Results:</Text>
      <View style={styles.resultContainer}>
        {results.map((result, index) => {
          return <Text key={`result-${index}`}>{result}</Text>;
        })}
      </View>
      <Button
        title="Click here to copy to Clipboard"
        onPress={copyToClipboard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  resultContainer: {
    width: Dimensions.get("window").width - 30,
    height: 200,
    borderColor: "#4EC5C1",
    borderWidth: 1,
    padding: 8,
  },
  recButton: {
    width: 70,
    height: 70,
    borderColor: "#EC576B",
    borderRadius: 50,
    borderWidth: 1,
    padding: 9,
  },
  recPoint: {
    width: 50,
    height: 50,
    backgroundColor: "#EC576B",
    borderRadius: 50,
  },
});

export default App;

import React, { useState } from "react";
import { Text, SafeAreaView, StyleSheet, View, Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { Card, CardProps, CARD_HEIGHT } from "./src/cards/Card";
import { getBorder, randomHexColor } from "./src/utils/util";

const CARDS: CardProps[] = [
  {
    id: "3057301785",
    title: "1. Card",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, totam sit? Quam sunt, ipsum dolorem labore praesentium reiciendis. Fuga repellat beatae id reprehenderit sit quisquam dolor eius pariatur error recusandae!",
    backgroundColor: randomHexColor(),
  },
  {
    id: "2833230558",
    title: "2. Card",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, totam sit? Quam sunt, ipsum dolorem labore praesentium reiciendis. Fuga repellat beatae id reprehenderit sit quisquam dolor eius pariatur error recusandae!",
    backgroundColor: randomHexColor(),
  },
  {
    id: "4226539632",
    title: "3. Card",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, totam sit? Quam sunt, ipsum dolorem labore praesentium reiciendis. Fuga repellat beatae id reprehenderit sit quisquam dolor eius pariatur error recusandae!",
    backgroundColor: randomHexColor(),
  },
  {
    id: "1681263771",
    title: "4. Card",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, totam sit? Quam sunt, ipsum dolorem labore praesentium reiciendis. Fuga repellat beatae id reprehenderit sit quisquam dolor eius pariatur error recusandae!",
    backgroundColor: randomHexColor(),
  },
  {
    id: "2274690112",
    title: "5. Card",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, totam sit? Quam sunt, ipsum dolorem labore praesentium reiciendis. Fuga repellat beatae id reprehenderit sit quisquam dolor eius pariatur error recusandae!",
    backgroundColor: randomHexColor(),
  },
];
type Item = { item: CardProps; index: number };

export default function App() {
  const [cards, setCards] = useState(CARDS);

  const displayAsFirst = (id: string) => {
    const cardIdx = cards.findIndex((c) => c.id === id);

    setCards([
      ...cards.slice(0, cardIdx),
      ...cards.slice(cardIdx + 1),
      cards[cardIdx],
    ]);
  };

  const displayAsLast = (id: string) => {
    const cardIdx = cards.findIndex((c) => c.id === id);

    setCards([
      cards[cardIdx],
      ...cards.slice(0, cardIdx),
      ...cards.slice(cardIdx + 1),
    ]);
  };

  const addCard = () => {
    const newCard: CardProps = {
      id: Date.now().toString(),
      title: `${cards.length + 1}. Card`,
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, totam sit? Quam sunt, ipsum dolorem labore praesentium reiciendis. Fuga repellat beatae id reprehenderit sit quisquam dolor eius pariatur error recusandae!",
      backgroundColor: randomHexColor(),
    };

    setCards([...cards, newCard]);
  };

  const removeCard = (id: string) => {
    const cardIdx = cards.findIndex((c) => c.id === id);

    setCards([...cards.slice(0, cardIdx), ...cards.slice(cardIdx + 1)]);
  };

  const renderCard = ({ item: props, index }: Item) => {
    return (
      <Card
        key={props.id}
        {...props}
        offset={index}
        onGestureEnd={
          index === cards.length - 1 ? displayAsLast : displayAsFirst
        }
        onClosePress={() => removeCard(props.id)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView>
        <View style={styles.header}>
          <Text style={styles.text}>Header</Text>
        </View>
        <Animated.FlatList
          contentContainerStyle={styles.cards}
          data={cards}
          renderItem={renderCard}
          scrollEnabled={false}
        />
      </GestureHandlerRootView>
      <View style={styles.footer}>
        <Pressable onPress={addCard} style={styles.button}>
          <Text style={styles.text}>Add card</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: "8%",
    flex: 1,
    backgroundColor: "#082032",
  },
  header: {
    position: "absolute",
    top: 0,
    width: "100%",

    height: "5%",
    ...getBorder(),
  },
  cards: {
    paddingHorizontal: 8,
    paddingTop: CARD_HEIGHT * 1.2,

    // alignSelf: "center",
    alignItems: "center",
    height: "100%",

    overflow: "visible",

    backgroundColor: "transparent",
    ...getBorder("white"),
  },

  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "10%",

    justifyContent: "center",
    alignContent: "center",

    ...getBorder(),
  },

  button: {
    height: "50%",
    backgroundColor: "#1711fd",

    justifyContent: "center",
    alignContent: "center",
  },

  text: {
    color: "#fefefe",
    fontSize: 16,
    textAlign: "center",
    textAlignVertical: "center",
  },
});

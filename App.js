import React, { Component } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { AppLoading, Asset } from "expo";
import {
  Provider as PaperProvider,
  Appbar,
  Paragraph,
  Title,
  Card
} from "react-native-paper";
import { getTodayInHistory } from "./components/api";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventsResponse: [],
      isLoadingComplete: false
    };
  }

  componentDidMount() {
    this.fetchDataFromServer();
  }

  fetchDataFromServer = () => {
    getTodayInHistory()
      .then(json => json.Events)
      .then(events => {
        this.setState({ eventsResponse: events });
        console.log("setstate" + events);
      })
      .catch(error => {
        console.warn(error);
        this.setState({ eventsResponse: [] });
      });
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <PaperProvider>
          <View style={styles.container}>
            <Appbar.Header theme={theme}>
              <Appbar.Content title="Today in history" subtitle="Subtitle" />
              {/* <Appbar.Action icon="search" onPress={this._onSearch} />
            <Appbar.Action icon="more-vert" onPress={this._onMore} /> */}
            </Appbar.Header>
            <FlatList
              style={styles.flatlist}
              data={this.state.eventsResponse}
              renderItem={({ item, index }) => {
                return <FlatListItem item={item} index={index} />;
              }}
            />
          </View>
        </PaperProvider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        // require('./assets/images/robot-dev.png'),
        // require('./assets/images/robot-prod.png'),
      ])
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

class FlatListItem extends Component {
  render() {
    return (
      <View padding={8} style={{ flex: 1 }}>
        <Card elevation={4}>
          <Card.Content>
            <Title>Year {this.props.item.year}</Title>
            <Paragraph>{this.props.item.text}</Paragraph>
          </Card.Content>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  flatlist: {
    flex: 1
  }
});
const theme = {
  dark: false,
  colors: {
    primary: "#3f51b5",
    accent: "#e91e63"
  }
};

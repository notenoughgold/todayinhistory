import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  DatePickerAndroid,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
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
      chosenDate: new Date(),
      eventsResponse: [],
      deathsResponse: [],
      birthsResponse: [],
      isLoadingComplete: false,
      isFetchComplete: false,
      index: 1,
      routes: [
        { key: "events", title: "Events" },
        { key: "births", title: "Briths" }
      ]
    };
  }

  componentDidMount() {
    this.fetchDataFromServer();
  }

  fetchDataFromServer = () => {
    this.setState({ isFetchComplete: false, apiResponse: null });

    getTodayInHistory(
      this._extractMonthfromDate(this.state.chosenDate),
      this._extractDayfromDate(this.state.chosenDate)
    )
      .then(response => {
        this.setState({
          eventsResponse: response.Events,
          birthsResponse: response.Births,
          deathsResponse: response.Deaths,
          isFetchComplete: true
        });
      })
      .catch(error => {
        console.warn(error);
        this.setState({
          eventsResponse: [],
          birthsResponse: [],
          deathsResponse: [],
          isFetchComplete: true
        });
      });
  };

  _onClickChangeDate = async () => {
    try {
      var { action, year, month, day } = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: this.state.chosenDate
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        if (
          this.state.chosenDate.getMonth() == month &&
          this.state.chosenDate.getDate() == day
        ) {
          return;
        } else {
          this.setState({ chosenDate: new Date(year, month, day) });
          this.fetchDataFromServer();
        }
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
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
              <Appbar.Content
                title="Today In History"
                subtitle={this.state.chosenDate.toLocaleDateString()}
              />
              <Appbar.Action icon="today" onPress={this._onClickChangeDate} />
            </Appbar.Header>
            <MyTabView
              eList={this.state.eventsResponse}
              bList={this.state.birthsResponse}
              dList={this.state.deathsResponse}
            />
            <ActivityIndicator
              animating={!this.state.isFetchComplete}
              size="large"
              style={{
                position: "absolute",
                top: Dimensions.get("window").height / 2 - 18,
                left: Dimensions.get("window").width / 2 - 18
              }}
            />
          </View>
        </PaperProvider>
      );
    }
  }

  _extractMonthfromDate = date => {
    return date.getMonth() + 1;
  };
  _extractDayfromDate = date => {
    return date.getDate();
  };

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
class MyTabView extends Component {
  state = {
    index: 0,
    routes: [
      { key: "events", title: "Events" },
      { key: "births", title: "Births" },
      { key: "deaths", title: "Deaths" }
    ]
  };
  renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: theme.colors.accent }}
      style={{ backgroundColor: theme.colors.primary }}
    />
  );
  renderScene = ({ route }) => {
    switch (route.key) {
      case "events":
        return <EventsTab response={this.props.eList} />;
      case "births":
        return <EventsTab response={this.props.bList} />;
      case "deaths":
        return <EventsTab response={this.props.dList} />;
      default:
        return null;
    }
  };
  render() {
    return (
      <TabView
        renderTabBar={this.renderTabBar}
        navigationState={this.state}
        renderScene={this.renderScene}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get("window").width }}
      />
    );
  }
}
class EventsTab extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <View style>
          <FlatList
            style={styles.flatlist}
            data={this.props.response}
            keyExtractor={(item, index) => index + ""}
            renderItem={({ item, index }) => {
              return <FlatListItem item={item} index={index} />;
            }}
          />
        </View>
      </View>
    );
  }
}

class FlatListItem extends Component {
  render() {
    return (
      <View padding={8} style={{ flex: 1 }}>
        <Card elevation={2}>
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

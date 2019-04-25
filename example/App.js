import React, { Component } from 'react';

import { Alert, Button, Platform, TextInput, StyleSheet, Text, View } from 'react-native';

import Share from 'react-native-share';

import images from './images/imagesBase64';

export default class App extends Component {
  state = {
    packageSearch: '',
  };

  /**
   * You can use the method isPackageInstalled to find
   * if a package is insalled. It returns a { isInstalled, message }
   * only works on Android :/
   */
  checkIfPackageIsInstalled = async () => {
    const { packageSearch } = this.state;

    const { isInstalled } = await Share.isPackageInstalled(packageSearch);

    Alert.alert(`Package: ${packageSearch}`, `${isInstalled ? 'Installed' : 'Not Installed'}`);
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      result: '',
    };
  }

  getErrorString(error: any, defaultValue?: string): string {
    let e = defaultValue || 'Something went wrong. Please try again';
    if (typeof error === 'string') {
      e = error;
    } else if (error && error.message) {
      e = error.message;
    } else if (error && error.props) {
      e = error.props;
    }
    return e;
  }

  setPackageSearch = packageSearch => this.setState({ packageSearch });

  /**
   * This functions share multiple images that
   * you send as the urls param
   */
  shareMultipleImages = async () => {
    const shareOptions = {
      title: 'Share file',
      failOnCancel: false,
      urls: [images.image1, images.image2],
    };

    // If you want, you can use a try catch, to parse
    // the share response. If the user cancels, etc.
    try {
      const ShareResponse = await Share.open(shareOptions);
      this.setState({ result: JSON.stringify(ShareResponse, 0, 2) });
    } catch (error) {
      console.log('Error =>', error);
      this.setState({ result: 'error: '.concat(this.getErrorString(error)) });
    }
  };

  /**
   * This functions share a image passed using the
   * url param
   */
  shareSingleImage = async () => {
    const shareOptions = {
      title: 'Share file',
      url: images.image1,
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      this.setState({ result: JSON.stringify(ShareResponse, 0, 2) });
    } catch (error) {
      console.log('Error =>', error);
      this.setState({ result: 'error: '.concat(this.getErrorString(error)) });
    }
  };

  onShareEmail = async () => {
    const shareOptions = {
      title: 'Share file',
      social: Share.Social.EMAIL,
      failOnCancel: false,
      urls: [images.image1, images.image2],
    };

    try {
      const result = await Share.shareSingle(shareOptions);
      this.setState({ result: JSON.stringify(result, 0, 2) });
    } catch (e) {
      // Handle Error
      console.warn(e);
      this.setState({ result: 'error: '.concat(this.getErrorString(e)) });
    }
  }

  render() {
    const { packageSearch } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native Share Example!</Text>
        <View style={styles.optionsRow}>
          <View style={styles.button}>
            <Button onPress={this.shareMultipleImages} title="Share Multiple Images" />
          </View>
          <View style={styles.button}>
            <Button onPress={this.shareSingleImage} title="Share Single Image" />
          </View>
          <View style={styles.button}>
            <Button title="Share via Social: EMAIL" onPress={this.onShareEmail}/>
          </View>
          {Platform.OS === 'android' && (
          <View style={styles.searchPackageContainer}>
            <TextInput
              placeholder="Search for a Package"
              onChangeText={this.setPackageSearch}
              value={packageSearch}
              style={styles.textInput}
            />
            <View>
              <Button onPress={this.checkIfPackageIsInstalled} title="Check Package" />
            </View>
          </View>
          )
          }
          <Text style={{ marginTop: 20, fontSize: 20 }}>Result</Text>
          <Text style={styles.result}>{this.state.result}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textInput: {
    borderBottomColor: '#151313',
    borderBottomWidth: 1,
    marginRight: 10,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  result: {
    fontSize: 14,
    margin: 10,
  },
  optionsRow: {
    justifyContent: 'space-between',
  },
  searchPackageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

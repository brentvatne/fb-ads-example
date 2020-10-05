import * as FacebookAds from "expo-ads-facebook";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const {
  NativeAdsManager,
  InterstitialAdManager,
  BannerAd,
  withNativeAd,
  AdMediaView,
  AdIconView,
  AdTriggerView,
  AdOptionsView,
} = FacebookAds;

const DEMO_NATIVE_AD_ID = "VID_HD_16_9_15S_APP_INSTALL#YOUR_PLACEMENT_ID";
const DEMO_INTERSTITIAL_AD_ID = "VID_HD_16_9_15S_APP_INSTALL#YOUR_PLACEMENT_ID";
const DEMO_BANNER_AD_ID = "IMG_16_9_APP_INSTALL#YOUR_PLACEMENT_ID";

let adsManager: FacebookAds.NativeAdsManager | null = null;

try {
  adsManager = new NativeAdsManager(DEMO_NATIVE_AD_ID);
} catch (e) {
  // CTKNativeAdManager may be undefined too
}

interface State {
  expanded: boolean;
}

class ChangingFullAd extends React.Component<
  {
    nativeAd: {
      advertiserName?: string;
      sponsoredTranslation?: string;
      headline?: string;
      socialContext?: string;
      bodyText?: string;
      callToActionText?: string;
    };
  },
  State
> {
  readonly state: State = {
    expanded: true,
  };

  render() {
    const { nativeAd } = this.props;
    return (
      <View style={styles.fullad}>
        <View style={[styles.nativeRow, { paddingVertical: 10 }]}>
          <Text style={[styles.description, { flex: 1 }]}>
            Toggling this switch should show/hide the bottom row which contains
            an "Install now" button. When shown, clicking on the button should
            trigger the ad.
          </Text>
          <Switch
            value={this.state.expanded}
            onValueChange={() =>
              this.setState((state) => ({ expanded: !state.expanded }))
            }
          />
        </View>
        <AdOptionsView
          iconSize={40}
          iconColor="#ff0000"
          style={{
            backgroundColor: "white",
          }}
        />
        <View style={styles.nativeRow}>
          <AdIconView style={styles.iconView} />
          <View style={styles.nativeColumn}>
            <AdTriggerView>
              {nativeAd.advertiserName && (
                <Text style={styles.title}>{nativeAd.advertiserName}</Text>
              )}
              {nativeAd.sponsoredTranslation && (
                <Text style={styles.description}>
                  {nativeAd.sponsoredTranslation}
                </Text>
              )}
              {nativeAd.headline && (
                <Text style={styles.title}>{nativeAd.headline}</Text>
              )}
            </AdTriggerView>
          </View>
        </View>

        <View style={styles.nativeRow}>
          <AdMediaView style={styles.mediaView} />
        </View>

        {this.state.expanded && (
          <View style={styles.nativeRow}>
            <View style={styles.nativeColumn}>
              {nativeAd.socialContext && (
                <Text style={styles.description}>{nativeAd.socialContext}</Text>
              )}
              {nativeAd.bodyText && (
                <Text style={styles.description}>{nativeAd.bodyText}</Text>
              )}
            </View>

            <View style={styles.adButton}>
              <AdTriggerView>
                <Text>{nativeAd.callToActionText}</Text>
              </AdTriggerView>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const FullNativeAd = withNativeAd(ChangingFullAd);

export default class App extends React.Component {
  static navigationOptions = {
    title: "FacebookAds",
  };

  showFullScreenAd = () => {
    InterstitialAdManager.showAd(DEMO_INTERSTITIAL_AD_ID)
      .then((didClick) => {
        console.log(didClick);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onBannerAdPress = () => console.log("Ad clicked!");

  onBannerAdError = (event: Error) =>
    console.log("Ad error :(", (event as any).nativeEvent);

  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.header}>Native Ad</Text>
        {adsManager && <FullNativeAd adsManager={adsManager} />}
        <Text style={styles.header}>Banner Ad</Text>
        <BannerAd
          type="large"
          placementId={DEMO_BANNER_AD_ID}
          onPress={this.onBannerAdPress}
          onError={this.onBannerAdError}
        />
        <Text style={styles.header}>Interstitial ad</Text>
        <TouchableOpacity style={styles.button} onPress={this.showFullScreenAd}>
          <Text style={styles.buttonText}>Show interstitial ad</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 8,
  },
  p: {
    marginBottom: 10,
    marginHorizontal: 40,
    textAlign: "center",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  fullad: {
    flexDirection: "column",
  },
  nativeRow: {
    maxWidth: "100%",
    alignSelf: "stretch",
    flexDirection: "row",
    overflow: "hidden",
  },
  nativeColumn: {
    flexDirection: "column",
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
    marginTop: 5,
  },
  adButton: {
    borderColor: "#CDCDCD",
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderRadius: 10,
    padding: 5,
    marginTop: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
  },
  description: {
    fontSize: 12,
    opacity: 0.8,
  },
  subtitle: {
    fontSize: 13,
    fontStyle: "italic",
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 3,
    backgroundColor: "blue",
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
  },
  iconView: {
    width: 50,
    height: 50,
  },
  mediaView: {
    flex: 1,
    height: 100,
  },
});

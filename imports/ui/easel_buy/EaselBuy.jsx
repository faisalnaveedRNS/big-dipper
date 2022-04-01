import React, { Component } from "react";
import { Spinner, Row, Col } from "reactstrap";
import axios from "axios";
import i18n from "meteor/universe:i18n";
import PopupModal from "../popup/popup";
import settings from "../../../settings.json";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import {
  FlowRouterMeta,
  FlowRouterTitle,
} from "meteor/ostrio:flow-router-meta";

FlowRouter.route("/", {
  action() {
    /* ... */
  },
  title: "Big Dipper",
  /* ... */
});

new FlowRouterMeta(FlowRouter);
new FlowRouterTitle(FlowRouter);

const T = i18n.createComponent();

export default class EaselBuy extends Component {
  constructor(props) {
    super(props);
    console.log("[EasyBuy]: props in constructor", this.props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isPurchaseOpen: "",
      name: this.props.name,
      description: this.props.description,
      price: this.props.price,
      img: this.props.img,
      loading: false,
    };
  }
  componentDidMount() {
    const url = settings.remote.api;
    this.setState({ loading: true });
    axios
      .get(
        `${url}/pylons/recipe/${this.props.cookbook_id}/${this.props.recipe_id}`
      )
      .then((resp) => {
        this.setState({ loading: false });
        const selectedRecipe = resp.data.Recipe;

        const coinInputs = selectedRecipe.coinInputs;
        let price;
        if (coinInputs.length > 0) {
          if (coinInputs[0].coins[0].denom == "USD") {
            price =
              Math.floor(coinInputs[0].coins[0].amount / 100) +
              "." +
              (coinInputs[0].coins[0].amount % 100) +
              " " +
              coinInputs[0].coins[0].denom;
          } else {
            price =
              coinInputs[0].coins[0].amount +
              " " +
              coinInputs[0].coins[0].denom;
          }
        }
        const entries = selectedRecipe.entries;
        let img;
        if (entries != null) {
          const itemoutputs = entries.itemOutputs;
          if (itemoutputs.length > 0) {
            let strings = itemoutputs[0].strings;
            for (let i = 0; i < strings.length; i++) {
              try {
                if (
                  (strings[i].key =
                    "NFT_URL" && strings[i].value.indexOf("http") >= 0)
                ) {
                  img = strings[i].value;
                  break;
                }
              } catch (e) {
                console.log("strings[i].value", e);
                break;
              }
            }
          }
        }
        this.setState({
          name: selectedRecipe.name,
          description: selectedRecipe.description,
          price,
          img,
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log(err);
      });
  }

  toggle() {
    this.setState(
      {
        isPurchaseOpen: !this.state.isPurchaseOpen,
      },
      () => {
        // console.log(this.state.isOpen);
      }
    );
  }


  // In case IOS will redirect to APP Store if app not installed
  // In case Android will redirect to Play store if app not installed
  // In case in Browser will redirect to Play store
  handleLoginConfirmed = (success) => {
    if (success) {
      window.location =
        "https://pylons.page.link/edXKuEX1vC4tjBUD9";
    }
  };

  goPurchaseAlert = () => {
    this.setState({ isPurchaseOpen: true });
  };

  render() {
    if (this.state.loading) {
      return <Spinner type="grow" color="primary" />;
    } else {
      return (
        <div id="home">
          <Col style={{ marginTop: "auto" }}>
            <Col>
              <Row style={{ margin: "auto", justifyContent: "center" }}>
                <img
                  alt="Easel on Google Play"
                  src={
                    this.state.img === "" ? "/img/buy_icon.png" : this.state.img
                  }
                  style={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "100%",
                    maxHeight: "25%",
                    minWidth: "80%",
                  }}
                />
              </Row>
              <Col
                style={{
                  alignSelf: "center",
                  marginTop: "20px",
                  width: "100%",
                }}
              >
                <Row style={{ justifyContent: "center" }}>
                  <a style={{ fontSize: "1.5em" }}>
                    <b>{this.state.name}</b>
                  </a>
                </Row>
                <Row style={{ justifyContent: "center" }}>
                  <a style={{ wordBreak: "break-all" }}>
                    {this.state.description}
                  </a>
                </Row>
                <Row style={{ justifyContent: "center" }}>
                  <p style={{ marginTop: "7px", fontWeight: "500" }}>
                    {this.state.price}
                  </p>
                </Row>
              </Col>
            </Col>
            <Row style={{ marginTop: "10px" }}>
              <PopupModal
                isOpen={this.state.isPurchaseOpen}
                toggle={this.toggle}
                handleLoginConfirmed={this.handleLoginConfirmed}
              />

              <a
                className="btn btn-primary"
                onClick={this.goPurchaseAlert}
                style={{ margin: "auto", width: "120px" }}
              >
                <i className="fas"></i>
                {"    BUY    "}
              </a>
            </Row>
            <Row style={{ margin: "auto", marginTop: "25px" }}>
              <Row
                style={{
                  margin: "auto",
                  alignSelf: "center",
                  marginRight: "20px",
                }}
              >
                <img
                  alt="Easel on Google Play"
                  src="/img/easel.png"
                  style={{ width: "60px", height: "70px" }}
                />
              </Row>
              <Row
                style={{
                  margin: "auto",
                  alignSelf: "center",
                  marginLeft: "15px",
                }}
              >
                <img
                  alt="Easel on Google Play"
                  src="/img/wallet.png"
                  style={{ width: "60px", height: "70px" }}
                />
              </Row>
            </Row>
          </Col>
        </div>
      );
    }
  }
}

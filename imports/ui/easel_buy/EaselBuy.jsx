import React, { Component } from "react";
import { Spinner, Row, Col, Container } from "reactstrap";
import axios from "axios";
import i18n from "meteor/universe:i18n";
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
    this.state = {
      name: this.props.name,
      description: this.props.description,
      price: this.props.price,
      img: this.props.img,
      loading: false,
      imageLoading: false,
      showHideComp1: false,
      showHideComp2: false,
      showHideComp3: false,
    };
    this.hideComponent = this.hideComponent.bind(this);
  }

  hideComponent(name) {
    switch (name) {
      case "showHideComp1":
        this.setState({
          showHideComp1: !this.state.showHideComp1,
          showHideComp2: false,
          showHideComp3: false,
        });
        break;
      case "showHideComp2":
        this.setState({
          showHideComp2: !this.state.showHideComp2,
          showHideComp1: false,
          showHideComp3: false,
        });
        break;
      case "showHideComp3":
        this.setState({
          showHideComp3: !this.state.showHideComp3,
          showHideComp1: false,
          showHideComp2: false,
        });
        break;
      default:
        null;
    }
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
            let coins = Meteor.settings.public.coins;
            let coin = coins?.length
              ? coins.find(
                  (coin) =>
                    coin.denom.toLowerCase() ===
                    coinInputs[0].coins[0].denom.toLowerCase()
                )
              : null;
            if (coin) {
              price =
                coinInputs[0].coins[0].amount / coin.fraction +
                " " +
                coin.displayName;
            } else {
              price =
                coinInputs[0].coins[0].amount +
                " " +
                coinInputs[0].coins[0].denom;
            }
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
        console.log("img", img);
        this.setState({
          name: selectedRecipe.name,
          description: selectedRecipe.description,
          price,
          img,
          imageLoading: img && img !== "",
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log(err);
      });
  }

  // In case IOS will redirect to APP Store if app not installed
  // In case Android will redirect to Play store if app not installed
  // In case in Browser will redirect to Play store
  handleLoginConfirmed = () => {
    const { apn, ibi, isi, oflIOS, oflPlay } =
      Meteor.settings.public.dynamicLink;
    const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
    let ofl = oflPlay;
    if (isMacLike) {
      ofl = oflIOS;
    }

    ofl = encodeURIComponent(ofl);
    const baseURL = `https://pylons.page.link/?amv=1&apn=${apn}&ibi=${ibi}&imv=1&efr=1&isi=${isi}&`;
    window.location = `${baseURL}ofl=${ofl}&link=${encodeURIComponent(
      window.location.href
    )}`;
  };

  render() {
    const { showHideComp1, showHideComp2, showHideComp3 } = this.state;
    if (this.state.loading) {
      return <Spinner type="grow" color="primary" />;
    } else {
      return (
        <div className="buy-page">
          <div id="home">
            <Container>
              <Row>
                <Col xl={5} lg={5} md={12} sm={12}>
                  <div className="mob-img">
                    {this.state.imageLoading && (
                      <Spinner type="grow" color="primary" />
                    )}
                    <div
                      style={{
                        display: this.state.imageLoading ? "none" : "contents",
                      }}
                    >
                      <img
                        alt="Easel on Google Play"
                        src={
                          this.state.img === ""
                            ? "/img/buy_icon.png"
                            : this.state.img
                        }
                        onLoad={() =>
                          this.setState({ ...this.state, imageLoading: false })
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          maxWidth: "100%",
                          maxHeight: "100%",
                          minWidth: "80%",
                        }}
                      />
                    </div>
                  </div>
                </Col>
                <Col xl={7} lg={7} md={12} sm={12}>
                  <div className="details">
                    <div className="title-publisher">
                      <h4>{this.state.name}</h4>
                      <div className="publisher">
                        <p>
                          Created by <span>Sarah Jackson</span>
                          <img
                            alt="Published"
                            src="/img/check.svg"
                            style={{ width: "16px", height: "16px" }}
                          />
                        </p>
                      </div>
                      <div className="views">
                        {" "}
                        <img
                          alt="views"
                          src="/img/eye.svg"
                          style={{ width: "34px", height: "20px" }}
                        />
                        <p>1003 views</p>
                      </div>
                    </div>
                    <div className="description">
                      {/* <p>{this.state.description}</p> */}
                      <p>
                        Reference site about Lorem Ipsum, giving information on
                        its origins, as well as a random Lipsum generator.
                        Reference site about Lorem Ipsum, giving information on
                        its origins, as well as a random Lipsum generator.
                      </p>
                      <a href="">read more</a>
                    </div>
                    <div className="more-details">
                      <div className="left-side">
                        <ul>
                          <li>
                            <div className="tab-name">
                              <p>Ownership</p>
                              <img
                                alt="Ownership"
                                src="/img/trophy.svg"
                                style={{ width: "40px", height: "40px" }}
                              />
                              <img
                                alt="line"
                                src="/img/line.svg"
                                style={{ width: "100%", height: "24px" }}
                                className="line"
                              />
                            </div>
                            <button
                              onClick={() =>
                                this.hideComponent("showHideComp1")
                              }
                            >
                              {showHideComp1 ? (
                                <img
                                  alt="minimize"
                                  src="/img/minimize.svg"
                                  style={{ width: "27px", height: "27px" }}
                                />
                              ) : (
                                <img
                                  alt="expand"
                                  src="/img/expand.svg"
                                  style={{ width: "27px", height: "27px" }}
                                />
                              )}
                            </button>
                            {showHideComp1 ? (
                              <div className="tab-panel">
                                <div className="item">
                                  <p>Owned by</p>
                                  <p>
                                    <a href="#">username</a>
                                  </p>
                                </div>
                                <div className="item">
                                  <p>Edition</p>
                                  <p>4 of 50</p>
                                </div>
                                <div className="item">
                                  <p>Royalty</p>
                                  <p>10%</p>
                                </div>
                                <div className="item">
                                  <p>Size</p>
                                  <p>1920 x 1080 px JPG</p>
                                </div>
                                <div className="item">
                                  <p>Creation Date</p>
                                  <p>11/12/2022</p>
                                </div>
                              </div>
                            ) : null}
                          </li>
                          <li>
                            <div className="tab-name">
                              <p>NFT Detail</p>
                              <img
                                alt="NFT Detail"
                                src="/img/detail.svg"
                                style={{ width: "40px", height: "40px" }}
                              />
                              <img
                                alt="line"
                                src="/img/line.svg"
                                style={{ width: "100%", height: "24px" }}
                                className="line"
                              />
                            </div>
                            <button
                              onClick={() =>
                                this.hideComponent("showHideComp2")
                              }
                            >
                              {showHideComp2 ? (
                                <img
                                  alt="minimize"
                                  src="/img/minimize.svg"
                                  style={{ width: "27px", height: "27px" }}
                                />
                              ) : (
                                <img
                                  alt="expand"
                                  src="/img/expand.svg"
                                  style={{ width: "27px", height: "27px" }}
                                />
                              )}
                            </button>
                            {showHideComp2 ? (
                              <div className="tab-panel">
                                <div className="item">
                                  <p>Recipe ID</p>
                                  <p>
                                    <a href="#">username</a>
                                  </p>
                                </div>
                                <div className="item">
                                  <p>Token ID</p>
                                  <p>4 of 50</p>
                                </div>
                                <div className="item">
                                  <p>Blockchain</p>
                                  <p>10%</p>
                                </div>
                                <div className="item">
                                  <p>Permission</p>
                                  <p>1920 x 1080 px JPG</p>
                                </div>
                              </div>
                            ) : null}
                          </li>
                          <li>
                            <div className="tab-name">
                              <p>History</p>
                              <img
                                alt="History"
                                src="/img/history.svg"
                                style={{ width: "40px", height: "40px" }}
                              />
                              <img
                                alt="line"
                                src="/img/line.svg"
                                style={{ width: "100%", height: "24px" }}
                                className="line"
                              />
                            </div>
                            <button
                              onClick={() =>
                                this.hideComponent("showHideComp3")
                              }
                            >
                              {showHideComp3 ? (
                                <img
                                  alt="minimize"
                                  src="/img/minimize.svg"
                                  style={{ width: "27px", height: "27px" }}
                                />
                              ) : (
                                <img
                                  alt="expand"
                                  src="/img/expand.svg"
                                  style={{ width: "27px", height: "27px" }}
                                />
                              )}
                            </button>
                            {showHideComp3 ? (
                              <div className="tab-panel">
                                <div className="item">
                                  <p>11/28/2021 13:25 EST</p>
                                  <p>
                                    <a href="#">username</a>
                                  </p>
                                </div>
                                <div className="item">
                                  <p>05/12/2021 12:18 EST</p>
                                  <p>4 of 50</p>
                                </div>
                                <div className="item">
                                  <p>01/01/2020 12:10 EST</p>
                                  <p>10%</p>
                                </div>
                              </div>
                            ) : null}
                          </li>
                        </ul>
                      </div>
                      <div className="right-side">
                        <div className="likes">
                          <img
                            alt="expand"
                            src="/img/likes.svg"
                            style={{ width: "41px", height: "39px" }}
                          />
                          <p>359</p>
                        </div>
                        <div className="external-link">
                          <a href="#">
                            {" "}
                            <img
                              alt="expand"
                              src="/img/external.svg"
                              style={{ width: "41px", height: "39px" }}
                            />{" "}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="buy-btn">
                      <button onClick={this.handleLoginConfirmed}>
                        <img
                          alt="bg"
                          src="/img/btnbg.svg"
                          style={{ width: "100%", height: "100%" }}
                          className="btnbg"
                        />
                        <span className="dot"></span>
                        <div className="value-icon">
                          <div className="values">
                            <p>Buy for {this.state.price}</p>
                            <span className="usd">(50.81 USD)</span>
                          </div>
                          <div className="icon">
                            <img
                              alt="coin"
                              src="/img/btc.svg"
                              style={{ width: "30px", height: "29px" }}
                            />
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
            {/* <Col style={{ marginTop: "20rem" }}>
              <Col> */}
            {/* <Row style={{ margin: "auto", justifyContent: "center" }}>
                  {this.state.imageLoading && (
                    <Spinner type="grow" color="primary" />
                  )}
                  <div
                    style={{
                      display: this.state.imageLoading ? "none" : "contents",
                    }}
                  >
                    <img
                      alt="Easel on Google Play"
                      src={
                        this.state.img === ""
                          ? "/img/buy_icon.png"
                          : this.state.img
                      }
                      onLoad={() =>
                        this.setState({ ...this.state, imageLoading: false })
                      }
                      style={{
                        width: "auto",
                        height: "auto",
                        maxWidth: "100%",
                        maxHeight: "25%",
                        minWidth: "80%",
                      }}
                    />
                  </div>
                </Row> */}
            {/* <Col
                  style={{
                    alignSelf: "center",
                    marginTop: "20px",
                    width: "100%",
                  }}
                > */}
            {/* <Row style={{ justifyContent: "center" }}>
                    <a style={{ fontSize: "1.5em" }}>
                      <b>{this.state.name}</b>
                    </a>
                  </Row> */}
            {/* <Row style={{ justifyContent: "center" }}>
                    <a style={{ wordBreak: "break-all" }}>
                      {this.state.description}
                    </a>
                  </Row> */}
            {/* <Row style={{ justifyContent: "center" }}>
                    <p style={{ marginTop: "7px", fontWeight: "500" }}>
                      {this.state.price}
                    </p>
                  </Row>
                </Col>
              </Col> */}
            {/* <Row style={{ marginTop: "10px" }}>
                <a
                  className="btn btn-primary"
                  onClick={this.handleLoginConfirmed}
                  style={{ margin: "auto", width: "120px" }}
                >
                  <i className="fas" />
                  {"    BUY    "}
                </a>
              </Row> */}
            {/* <Row style={{ margin: "auto", marginTop: "25px" }}>
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
                </Row> */}
            {/* </Row> */}
            {/* </Col> */}
          </div>
        </div>
      );
    }
  }
}

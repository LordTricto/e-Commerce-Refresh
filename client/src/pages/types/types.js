import React, { useEffect, useState } from "react";
import "./style.css";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleRight,
  faShoppingCart,
  faAngleUp,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "../../components/footer/footer";
import MiniNav from "../../components/miniNav/miniNav";
import useFullPageLoader from "../../hooks/useFullPageLoader";
import useCart from "../../hooks/useCart";
import Navbar from "../../components/navbar/navbar";
import AddButton from "../../components/buttons/button";
import { connect } from "react-redux";
import { ADD } from "../../redux/cart/actions";
import { useDispatch } from "react-redux";
import axios from "axios";
import image1 from "../../assets/pexels-neemias-seara-3680316 (2).jpg";
import { TimelineLite, Power2, gsap } from "gsap";
import { motion } from "framer-motion";
import * as ScrollMagic from "scrollmagic";
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Cart from "../../components/cart/cart";

gsap.registerPlugin(ScrollTrigger);
ScrollMagicPluginGsap(ScrollMagic, gsap);

function Type({ match }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [items, setItems] = useState([]);
  const [name, setName] = useState([]);
  const [page, setPage] = useState([]);
  const [click, setClick] = useState("noMore");
  const [addedCart, setAddedCart] = useState([]);
  // const [showCart, setShowCart] = useState(false);
  const [displayCart, setDisplayCart] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [cart, showCart, hideCart] = useCart();
  const [clickButton, setClickButton] = useState(false);
  const body = document.querySelector("body");
  const filter = match.params.filterType;
  const style = match.params.productType;
  const level = "1";
  let filterName;
  let nextFilter;
  let itemName;

  const tl6 = new TimelineLite();
  const scrollController = new ScrollMagic.Controller();
  useEffect(() => {
    window.scrollTo(0, 0);
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    };
    fetchItems();
  }, [filter]);

  function fetchItems() {
    hideMask();
    showLoader();
    axios
      .get(`http://localhost:3001/${style}/${filter}`, {
        params: {
          page: 1,
          limit: 4,
        },
      })
      .then((response) => {
        console.log(response.data.next.page);
        setPage(response.data.next.page);
        setItems(response.data.results);
        setClick("More");
        hideLoader();
      });
  }

  async function fetchMore() {
    showLoader();
    const request = await axios.get(
      `http://localhost:3001/${style}/${filter}`,
      {
        params: {
          page: page,
          limit: 4,
        },
      }
    );

    const result = request.data.results;

    result.map((it) => {
      setItems((prevItems) => [
        ...prevItems,
        {
          _id: it._id,
          name: it.name,
          price: it.price,
          description: it.description,
          image: it.image,
        },
      ]);
      return items;
    });

    if (request.data.next) {
      setPage(request.data.next.page);
      setClick("More");
    } else {
      setClick("noMore");
    }
    console.log(request.data.next);
    hideLoader();
  }

  const loadMore = () => {
    fetchMore();
  };

  const loadStyle = (e) => {
    const number = e.target.value;
    if (number === 0) {
      nextFilter = "newIn";
      history.push(`/${style}/${nextFilter}`);
    } else if (number === 1) {
      nextFilter = "highLow";
      history.push(`/${style}/${nextFilter}`);
    } else if (number === 2) {
      nextFilter = "lowHigh";
      history.push(`/${style}/${nextFilter}`);
    }
  };

  const handleChange = () => {
    if (clickButton === true) {
      setClickButton(false);
    } else if (clickButton === false) {
      setClickButton(true);
    }
  };

  if (filter === "newIn") {
    filterName = "New In";
  } else if (filter === "highLow") {
    filterName = "High to Low";
  } else if (filter === "lowHigh") {
    filterName = "Low to High";
  }

  const hideMask = () => {
    const Animation6 = tl6.to(".mask", 1.4, {
      width: "0vw",
      right: "0",
      position: "fixed",
      ease: Power2.easeInOut,
    });
    new ScrollMagic.Scene({
      duration: 0,
      triggerElement: ".container",
      triggerHook: 0.5,
      reverse: false,
    })
      .setTween(Animation6)
      .addTo(scrollController);
  };

  // const nextPage = {
  //   initial: {
  //     height: "100vh",
  //     width: "50vw",
  //     filter: "grayscale(100%) blur(1px)",
  //     position: "absolute",
  //     transition: { delay: 0.5, duration: 2.5, ease: "easeInOut" },
  //   },
  //   animate: {
  //     height: "100vh",
  //     width: "50vw",
  //     filter: "grayscale(100%) blur(1px)",
  //     position: "fixed",
  //     left: "0",
  //     transition: { delay: 0.5, duration: 2.5, ease: "easeInOut" },
  //   },
  //   exit: {},
  // };

  const nextPageMask = {
    exit: {
      width: "100vw",
      left: "0",
      position: "fixed",
      transition: { delay: 0.9, duration: 0.8, ease: "easeInOut" },
    },
  };

  const addItem = (item) => {
    dispatch({
      type: ADD,
      payload: {
        name: item.name,
        price: item.price,
        description: item.description,
        item_img: item.image,
      },
    });
  };

  const btnFun = (item) => {
    setName(item.name);
    setShowAlert(true);
    addItem(item);
    setTimeout(() => {
      setShowAlert(false);
    }, 1500);
    console.log(itemName);
  };
  const cartFun = () => {
    displayCart ? setDisplayCart(false) : setDisplayCart(true);
    displayCart ? showCart() : hideCart();
    setTimeout(() => {
      body.style.overflow = "hidden";
    }, 1000);
  };
  const hideCartFun = () => {
    setDisplayCart(true);
    hideCart();
    setTimeout(() => {
      body.style.overflow = "unset";
    }, 1000);
  };

  return (
    <div className={`container ${click === "noMore" ? "body-overflow" : ""}`}>
      <motion.div
        variants={nextPageMask}
        exit="exit"
        className="mask"
      ></motion.div>
      {loader}
      {/* <motion.div className="img-bg">
        <motion.img
          // variants={nextPage}
          // initial="initial"
          // animate="animate"
          // exit="exit"
          className="img-bg-edit"
          src={image1}
          alt="Locs"
        />
      </motion.div> */}
      <Navbar
        itemName={name}
        showItem={showAlert}
        func={() => {
          cartFun();
        }}
      />
      <div className="type-container">
        <MiniNav level={level} style={style} filter={filter} />
        <main>
          <div className="type-section">
            <div className="type-section-head">
              <div className="type-section-head-content">
                <div className="type-collection"> {style}</div>
                <div className="filter-change">
                  <div
                    className="filter-change-head"
                    onMouseLeave={() => {
                      setClickButton(false);
                    }}
                  >
                    <button
                      className="filter-change-button"
                      onMouseEnter={() => {
                        setClickButton(true);
                      }}
                      onClick={handleChange}
                    >
                      {" "}
                      {filterName}{" "}
                      <span
                        className={` ${
                          clickButton ? "button-span-on" : "button-span-off"
                        }`}
                      >
                        <FontAwesomeIcon icon={faAngleUp} />
                      </span>
                    </button>
                    <ul
                      className={`filter-change-body ${
                        clickButton ? "filter-appear" : ""
                      }`}
                      onClick={() => {
                        setClickButton(false);
                      }}
                    >
                      <li onClick={loadStyle} value="0">
                        New In
                      </li>
                      <li onClick={loadStyle} value="1">
                        High to Low
                      </li>
                      <li onClick={loadStyle} value="2">
                        Low to High
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="type-section-body">
              {items.map((item) => {
                return (
                  <div className="type-product-container" key={item._id}>
                    <div className="type-product-section">
                      <Link to={`/${style}/${filter}/${item._id}/details`}>
                        <div className="product-img">
                          {" "}
                          <img
                            className="image3"
                            src={item.image}
                            alt={item.name}
                          />{" "}
                        </div>
                      </Link>
                      <div className="type-product-name">
                        {" "}
                        <h2> {item.name}</h2>{" "}
                      </div>
                      <div className="type-product-price">
                        {" "}
                        <h3> ₦{item.price} </h3>{" "}
                      </div>
                      <AddButton
                        func={() => {
                          btnFun(item);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="load-more-container">
              <div className="load-more">
                <button onClick={loadMore} className={click}>
                  {" "}
                  load More{" "}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Cart
        func={() => {
          hideCartFun();
        }}
      />
      <Footer />
    </div>
  );
}

export default Type;

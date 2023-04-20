import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scrollbar from "smooth-scrollbar";
import OverscrollPlugin from "smooth-scrollbar/plugins/overscroll";
import "./style.scss";

const overscrollOptions = {
  enable: true,
  damping: 0.15,
  maxOverscroll: 150,
  glowColor: "#fff"
};

const options = {
  damping: 0.07,
  plugins: {
    overscroll: { ...overscrollOptions }
  }
};

export default function App() {
  // add a parallax effect to object
  const [MousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
    centeredX: 0,
    centeredY: 0,
    movementX: 0,
    movementY: 0
  });

  const [isTargeted, setIsTargeted] = useState(false);

  function onMouseEnter(e: any) {
    setIsTargeted(true);
  }
  function onMouseLeave(e: any) {
    setIsTargeted(false);
  }

  function handleMouseMove(e: any) {
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };
    const speed = 1;

    // get mouse (x, y)
    mouse.x = e.x;
    mouse.y = e.y;
    // adjust speed for higher refresh monitors
    const dt = 1 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
    // get position where (0,0) @ middle point
    let coordX = (mouse.x - pos.x) * dt * -1;
    let coordY = (mouse.y - pos.y) * dt * -1;
    setMousePosition({
      x: mouse.x,
      y: mouse.y,
      centeredX: coordX,
      centeredY: coordY,
      movementX: e.movementX,
      movementY: e.movementY
    });
  }
  /** useEffect executed at the start of page laoading */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let bodyScrollBar = Scrollbar.init(document.body, {
      damping: 0.1,
      delegateTo: document
    });
    ScrollTrigger.scrollerProxy(".App", {
      scrollTop(value) {
        if (arguments.length && value) {
          bodyScrollBar.scrollTop = value;
        }
        return bodyScrollBar.scrollTop;
      }
    });
    bodyScrollBar.addListener(ScrollTrigger.update);
    window.addEventListener("mousemove", (e) => {
      handleMouseMove(e);
    });

    // init parallax-bg elements
    gsap.set(".parallax-bg", {
      x: 240,
      y: 200
    });
    gsap.set("#parallax-img", {
      x: -240,
      y: -200
    });

    gsap.to(".parallax-bg", {
      display: "block",
      opacity: 1,
      duration: 2
    });
    // init text animation
    gsap.fromTo(
      ".logo img",
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, ease: "power4.inOut", duration: 2.6 }
    );
    gsap.fromTo(
      ".text-about h1",
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, ease: "power4.inOut", duration: 2.6, delay: 1 }
    );
    gsap.fromTo(
      ".text-about p",
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, ease: "power4.inOut", duration: 2.6, delay: 2 }
    );
    return () => {
      if (Scrollbar) Scrollbar.destroy(document.body);
    };
  }, []);

  /** useEffect when isTargeted update for pan reveal effect */
  useEffect(() => {
    if (isTargeted) {
      const tl = gsap.timeline();
      const object = document
        .querySelector(".parallax-bg")
        ?.getBoundingClientRect();
      const center = { x: 0, y: 0 };
      if (object) {
        center.x = object.width / 2;
        center.y = object.height / 2;
      }
      console.log(MousePosition.centeredX, MousePosition.centeredY);
      if (
        MousePosition.centeredY >= -200 &&
        MousePosition.centeredY <= 100 &&
        MousePosition.centeredX < 500 &&
        MousePosition.centeredX >= 180
      ) {
        tl.to(".parallax-bg", {
          duration: 0.6,
          x: MousePosition.x - center.x,
          y: MousePosition.y - center.y,
          ease: "power2.out"
        });
        tl.to(
          "#parallax-img",
          {
            duration: 0.6,
            x: (MousePosition.x - center.x) * -1,
            y: (MousePosition.y - center.y) * -1,
            ease: "power2.out"
          },
          0
        );
      }
    }
  }, [MousePosition.x, MousePosition.y, isTargeted]);

  return (
    <div className="App">
      <div className="parallax-bg">
        <div id="inner">
          <div
            id="bounding-box"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          ></div>
          <img id="parallax-img" src="FINAL-ROOFTOP-DUSK.webp" alt="" />
        </div>
      </div>
      <section className="kelola-about">
        <div className="section-wrapper">
          <div>
            <div className="section-right">
              <div className="logo">
                <img src="/Kelola-logo-black.svg" alt="" />
              </div>
              <div className="text-about">
                <h1>About.</h1>
                <p>
                  Kelola Hospitality Indonesia provides hotel management
                  services to property owners that are looking for experts to
                  direct their hotel operations. Our team consist of hoteliers
                  with over a decade of experiences across local and global
                  brands alike. We will guide hotel owners with the right
                  business concept, provide initial setup and manage their
                  property accordingly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="kelola-properties">
        <div className="section-wrapper">
          <div>
            <div className="section-top">
              <h1>Our Properties</h1>
              <p>
                As a hotel operator and hotel consultant, we work with quality
                partners. Together with Horwath HTL and STR reputable data
                source, we believe that our decision making process will fall in
                the right direction.
              </p>
            </div>
            <div className="section-bottom">
              <div className="items">
                <div data-property="The Tamora">
                  <div className="image"></div>
                  <div className="title">[ The Tamora ]</div>
                </div>
                <div>
                  <div className="image"></div>
                  <div className="title"></div>
                </div>
                <div>
                  <div className="image"></div>
                  <div className="title"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="kelola-perks">
        <div className="section-wrapper">
          <div></div>
        </div>
      </section>
      <section className="kelola-partners">
        <div className="section-wrapper">
          <div>
            <div className="section-middle">
              <h1>Partners.</h1>
              <p>
                As a hotel operator and hotel consultant, we work with quality
                partners. Together with Horwath HTL and STR reputable data
                source, we believe that our decision making process will fall in
                the right direction.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

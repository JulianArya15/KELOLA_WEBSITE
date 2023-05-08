import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
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
  const scrollBar = useRef<Scrollbar>();

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
  /** useEffect executed at the start of page loading */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(ScrollToPlugin);

    let bodyScrollBar = Scrollbar.init(document.body, {
      damping: 0.1,
      delegateTo: document
    });
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && value) {
          bodyScrollBar.scrollTop = value;
        }
        return bodyScrollBar.scrollTop;
      }
    });
    bodyScrollBar.addListener(ScrollTrigger.update);
    // scrollTo function mouseEvent
    const triggerElem = document.querySelectorAll(".trigger");
    triggerElem.forEach(element => {
      element.addEventListener("click", (e) => {
        const targetSection = (e.target as HTMLInputElement).getAttribute("data-section");
        bodyScrollBar.scrollIntoView(document.querySelector("."+targetSection) as HTMLElement, {
          alignToTop: true,
          onlyScrollIfNeeded: true,
        })
      })
    });
    console.log(triggerElem);

    scrollBar.current = bodyScrollBar;
    window.addEventListener("mousemove", (e) => {
      handleMouseMove(e);
    });

    const navTriggers = document.querySelector(".nav-links > ul")?.querySelectorAll("li");
    
    const animate = (el:string) => {
      var tl = gsap.timeline({paused: true});
      tl.to("."+el.slice(0, 6), { width: 42, x: 54, ease: "power3.inOut" }, 0.5)
      .to("."+el.slice(0, 6)+"-text", { visibility: "visible", opacity: 1, ease: "power3.inOut", delay: 0.5 }, 0.3)
      .to(".rect-1-text", { opacity: 0, ease: "power3.inOut" }, 0.3)
      .to(".rect-1", { width: 96, x: 0, ease: "power3.inOut", delay: 0.3 }, 0.5)
      return tl;
    }

    navTriggers?.forEach((element) => {
      var _el = element.querySelector<HTMLElement>("li > span.trigger");
      if (!_el) {
        throw new ReferenceError("Navigation triggers not found.");
      }
      var query = _el.className.slice(8);
      const animation = animate(query);
      _el.addEventListener("mouseenter", (e) => {
        animation.play();
      })
      _el.addEventListener("mouseleave", (e) => {
        animation.reverse();
      })
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
    gsap.set(
      ".rect-1", {
        x: 54
      }
    )
    return () => {
      if (Scrollbar) Scrollbar.destroy(document.body);
      navTriggers?.forEach((element) => {
        var _el = element.querySelector<HTMLElement>("li > span.trigger");
        if (!_el) {
          throw new ReferenceError("Navigation triggers not found.");
        }
        var query = _el.className.slice(8);
        
        const animation = animate(query);
        _el.removeEventListener("mouseenter", (e) => {
          animation.play();
        })
        _el.removeEventListener("mouseleave", (e) => {
          animation.reverse();
        })
      });
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
      <div className="nav-links-wrapper">
        <div className="nav-links">
          <div id="clipped">
            <img src="/FINAL-ROOFTOP-DUSK_1920x1200_right.jpg" alt="" />
          </div>
          <svg width="104" height="124" viewBox="0 0 104 124">
          <clipPath id="clip">
          <rect className="rect-1" width="42" height="20" rx="10" ry="10" x="0" y="0"/>
          <rect className="rect-2" width="96" height="20" rx="10" ry="10" x="0" y="32"/>
          <rect className="rect-3" width="96" height="20" rx="10" ry="10" x="0" y="64"/>
          <rect className="rect-4" width="96" height="20" rx="10" ry="10" x="0" y="96"/>
          </clipPath>
          </svg>
          
          <ul>
            <li><h3 className="rect-1-text">About \</h3><span className="trigger rect-1_trigger"></span></li>
            <li><h3 className="rect-2-text">Our Properties \</h3><span className="trigger rect-2_trigger" data-section="kelola-properties"></span></li>
            <li><h3 className="rect-3-text">Perks \</h3><span className="trigger rect-3_trigger" data-section="kelola-perks"></span></li>
            <li><h3 className="rect-4-text">Partners \</h3><span className="trigger rect-4_trigger" data-section="kelola-partners"></span></li>
          </ul>
        </div>
      </div>
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
                <img src="/KELOLA_LOGO_black.svg" alt="" />
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
              <h1>Our Properties.</h1>
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
                  <div className="image">
                    <img src="/Tamora-01.webp" alt="" />
                  </div>
                  <div className="title">[ The Tamora ]</div>
                </div>
                <div data-property="Pererenan">
                  <div className="image"></div>
                  <div className="title">[ Coming Soon ]</div>
                </div>
                <div data-property="">
                  <div className="image"></div>
                  <div className="title">[ Coming Soon ]</div>
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

import { d3_extended as d3 } from "./d3.extensions.mjs";

const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const basePath = isLocal ? "" : "/RnD-Archive";

var pos = 0;

function handleScroll() {
  let moving = window.pageYOffset;
  // SET VISIBILITY
  d3.select("nav#head").classed("moveout", pos < moving);
  pos = moving;
}

export const renderMenu = async function () {
  // LOAD MENU
  const list = await fetch(`${basePath}/routing.json`)
    .then((res) => res.json())
    .catch((err) => console.log(err));

  // <li><a href='/stories/'>Stories</a></li>
  d3.select("nav#head")
    .classed("moveout", true)
    .select("menu")
    .addElems("li", null, list)
    .addElems("a")
    .attr("href", (d) => `/${d}/`)
    .html((d) => d);

  window.addEventListener("scroll", handleScroll);
};

// const handleScroll = () => {
//    let moving = window.pageYOffset

//    setVisible(position > moving);
//    setPosition(moving)
// };

// useEffect(() => {
//   window.addEventListener('scroll', handleScroll);
//   return(() => {
//      window.removeEventListener('scroll', handleScroll);
//   });
// });

// const cls = visible ? 'movein' : 'moveout';

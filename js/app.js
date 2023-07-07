const API_URL = 'https://planets-api.vercel.app/api/v1';

const navLinkList = document.querySelector('.nav_list');
const planetDescription = document.querySelector('.planet_description');
const planetImage = planetDescription.querySelector('.planet_description_img');
const planetTabs = planetDescription.querySelector('.planet_description_tabs')
const planetDescriptionImgWrapperEl = planetDescription.querySelector('.planet_description_img_wrapper');
const tabsButtons = planetTabs.querySelectorAll('.planet_description_btn');
const planetDescriptionContent = planetDescription.querySelector('.planet_description_content');

let planetsData;
let planetData;
let activeTabName;
let planetName = window.location.href.split('#')[1] ?? 'mercury';
let prevPlanetName;

const imagesKeysByTab = {
  overview: 'planet',
  structure: 'internal',
  geology: 'geology'
};

navLinkList.addEventListener('click', handleNavLinkListCLick);
tabsButtons.forEach(btn => btn.addEventListener('click', switchTab));


(async function fetchPlanetsData() {
  const fetchUri = `${API_URL}/planets`;
  const response = await fetch(fetchUri);
  planetsData =  await response.json();
  
  renderPlanetData(planetName)
})()

function renderPlanetData() {
  planetData = getPlanetData(planetName);
  activeTabName = 'overview';


  setPlanetInfo();
  resetActiveTabBtn();
  setActiveHeaderLink();
  getPlanetImage();
}

function setPlanetInfo(activeTab) {
  const planetRotation = document.querySelector('.planet_rotation');
  const planetRevolution = document.querySelector('.planet_revolution');
  const planetRadius = document.querySelector('.planet_radius');
  const planetTemp = document.querySelector('.planet_temp');
  const planetName = document.querySelector('.planet_description_title');
  const textContent = document.querySelector('.planet_description_text');
  const textSource = document.querySelector('.planet_description_source_tag');
  
  planetRotation.innerHTML = planetData.rotation
  planetRevolution.innerHTML = planetData.revolution
  planetRadius.innerHTML = planetData.radius
  planetTemp.innerHTML = planetData.temperature
  planetName.innerHTML = planetData.name
  textContent.innerHTML = activeTab ? planetData[activeTab].content : planetData.overview.content
  textSource.href = activeTab ? planetData[activeTab].source : planetData.overview.source
}

async function handleNavLinkListCLick(e) {
  const link = e.target.closest('a');
  if (!link) return;

  planetName = link.dataset.planet?.toLowerCase();

  if (!planetName) return;
  if (prevPlanetName && planetName === prevPlanetName) return;
  prevPlanetName = planetName;

  renderPlanetData();
}



function setActiveHeaderLink() {
  document.documentElement.style.setProperty('--nav_active', planetData.color);

  Array.prototype.forEach.call(navLinkList.children, li => {
    const link = li.firstElementChild;
    if (!link) return;
    if (link.dataset.planet && link.dataset.planet === planetName) {
      link.classList.add('active');
    }
    else link.classList.remove('active');
  });
}



function switchTab(e) {
  const btn = e.currentTarget;

  activeTabName = btn.dataset.tab ?? 'overview';
  if (!planetData[activeTabName]) return;
  setActiveTabBtn(btn);
  setActiveTab(activeTabName);
  switchPlanetImage();
  setPlanetInfo(activeTabName);

}


function resetActiveTabBtn() {
  tabsButtons.forEach(btn => btn.classList.remove('active'));
  tabsButtons[0].classList.add('active');
}

function getPlanetImage() {
  planetImage.src = planetData.images.planet;
}



function getPlanetData(name) {
  return planetsData.find(data => data.name?.toLowerCase() === name.toLowerCase());
}



function setActiveTabBtn(btn) {
  tabsButtons.forEach(btn => btn.classList.remove('active'));
  btn.classList.add('active');
}



function setActiveTab(activeTabName) {
  Array.prototype.forEach.call(planetDescriptionContent.children, tabContentEl => {
    if (tabContentEl.id === activeTabName) {
      tabContentEl.classList.add('active');
    }
    else tabContentEl.classList.remove('active');
  });
}



function switchPlanetImage() {
  const image = planetDescriptionImgWrapperEl.firstElementChild;
  image.src = planetData.images[imagesKeysByTab[activeTabName]];

  image.addEventListener('error', () => {
    image.src = planetData.images.planet;
  }, { once: true });
}

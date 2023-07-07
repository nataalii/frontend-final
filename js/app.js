const API_URL = 'https://planets-api.vercel.app/api/v1';

const navLinkList = document.querySelector('.nav_list');
const planetDescription = document.querySelector('.planet_description');
const planetImage = planetDescription.querySelector('.planet_description_img');
const planetTabs = planetDescription.querySelector('.planet_description_tabs')
const planetDescriptionImgWrapperEl = planetDescription.querySelector('.planet_description_img_wrapper');
const tabsButtons = planetTabs.querySelectorAll('.planet_description_btn');
const planetDescriptionContent = planetDescription.querySelector('.planet_description_content');

let isNavClosed = false;
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


const handleNavLinkListCLick = async (e) =>  {
  const link = e.target.closest('a');
  if (!link) return;

  planetName = link.dataset.planet?.toLowerCase();

  if (!planetName) return;
  if (prevPlanetName && planetName === prevPlanetName) return;
  prevPlanetName = planetName;

  renderPlanetData();
}

const switchTab = (e) => {
  const btn = e.currentTarget;

  activeTabName = btn.dataset.tab ?? 'overview';
  if (!planetData[activeTabName]) return;
  setActiveTabBtn(btn);
  setActiveTab(activeTabName);
  switchPlanetImage();
  setPlanetInfo(activeTabName);

}


navLinkList.addEventListener('click', handleNavLinkListCLick);
tabsButtons.forEach(btn => btn.addEventListener('click', switchTab));


(async function fetchPlanetsData() {
  const fetchUri = `${API_URL}/planets`;
  const response = await fetch(fetchUri);
  planetsData =  await response.json();
  
  renderPlanetData(planetName)
})()

const renderPlanetData = () => {
  planetData = getPlanetData(planetName);
  activeTabName = 'overview';


  setPlanetInfo();
  resetActiveTabBtn();
  setActiveHeaderLink();
  getPlanetImage();
}

const setPlanetInfo = (activeTab) => {
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



const setActiveHeaderLink = () => {
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



const resetActiveTabBtn = () => {
  tabsButtons.forEach(btn => btn.classList.remove('active'));
  tabsButtons[0].classList.add('active');
}

const getPlanetImage = () => {
  planetImage.src = planetData.images.planet;
}



const getPlanetData = (name) => {
  return planetsData.find(data => data.name?.toLowerCase() === name.toLowerCase());
}



const setActiveTabBtn = (btn) => {
  tabsButtons.forEach(btn => btn.classList.remove('active'));
  btn.classList.add('active');
}



const setActiveTab = (activeTabName) =>  {
  Array.prototype.forEach.call(planetDescriptionContent.children, tabContentEl => {
    if (tabContentEl.id === activeTabName) {
      tabContentEl.classList.add('active');
    }
    else tabContentEl.classList.remove('active');
  });
}

const handleMobileLinkClick = (e) => {
  e.preventDefault();
  const link = e.currentTarget;
  const planetId = link.getAttribute('id');
  planetName = planetId.toLowerCase();
  if (prevPlanetName && planetName === prevPlanetName) return;
  prevPlanetName = planetName;
  renderPlanetData();
  toggleNavbar();
};

const mobileLinks = document.querySelectorAll('.mobile-link a');
mobileLinks.forEach((link) => {
  link.addEventListener('click', handleMobileLinkClick);
});

const toggleNavbar = () => {
  const mobileNav = document.querySelector('.mobile-nav');
  const navButton = document.querySelector('.icon-burger');
  if (!mobileNav.classList.contains('hidden')) {
    mobileNav.classList.add('hidden');
    navButton.classList.remove('active-burger');
  } else {
    mobileNav.classList.remove('hidden');
    navButton.classList.add('active-burger');
  }
};

const navButton = document.querySelector('.icon-burger');
navButton.addEventListener('click', toggleNavbar);


const switchPlanetImage = () => {
  const image = planetDescriptionImgWrapperEl.firstElementChild;
  image.src = planetData.images[imagesKeysByTab[activeTabName]];

  image.addEventListener('error', () => {
    image.src = planetData.images.planet;
  }, { once: true });
}

const headOptions = document.querySelectorAll('.head-option');
const underlineElements = document.querySelectorAll('.underline');

const switchOption = (e) => {
  const option = e.currentTarget;
  const index = Array.from(headOptions).indexOf(option);
  if (index === -1) return;

  setActiveOption(index);
};

headOptions.forEach((option) => {
  option.addEventListener('click', switchOption);
});

const setActiveOption = (index) => {
  headOptions.forEach((option, i) => {
    if (i === index) {
      option.classList.add('active');
      underlineElements[i].classList.add('active');
    } else {
      option.classList.remove('active');
      underlineElements[i].classList.remove('active');
    }
  });
  activeTabName = tabsButtons[index].dataset.tab;
  setActiveTabBtn(tabsButtons[index]);
  setActiveTab(activeTabName);
  switchPlanetImage();
  setPlanetInfo(activeTabName);
};

setActiveOption(0);
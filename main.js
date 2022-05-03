// 資料們
// DOM選擇器
const dataPanel = document.querySelector('#data-panel')
const heroModalName = document.querySelector('#hero-modal-name')
const heroModalImg = document.querySelector('#hero-modal-img')
const heroModalDescription = document.querySelector('#hero-modal-description')
const paginator = document.querySelector('#paginator')
const displayWay = document.querySelector('#display-way')
const superpowerFilterList = document.querySelector('#superpower-filter-list')
const gridView = document.querySelector('#grid-view')
// 資料產生
const USER_URL = "https://randomuser.me/api/?results=35";
const heroDatas = [];
const heroPerPage = 6;
let nowPage = 1
const superpower = [
  {
    id: "fire",
    icon: "local_fire_department",
    color: "md-red",
    border: "md-card-red",
    ability: "Burn anything except myself."
  },
  {
    id: "ice",
    icon: "ac_unit",
    color: "md-blue",
    border: "md-card-blue",
    ability: "Frozen as Elsa."
  },
  {
    id: "bolt",
    icon: "bolt",
    color: "md-red",
    border: "md-card-red",
    ability: "Speed as a bolt!"
  },
  {
    id: "water",
    icon: "water_drop",
    color: "md-blue",
    border: "md-card-blue",
    ability: "Become water, control water."
  },
  {
    id: "mind-read",
    icon: "psychology",
    color: "md-red",
    border: "md-card-red",
    ability: "No secret at all."
  },
  {
    id: "hacker",
    icon: "cell_tower",
    color: "md-yellow",
    border: "md-card-yellow",
    ability: "Anything with electricity can be hacked."
  },
  {
    id: "invisible",
    icon: "visibility_off",
    color: "md-black",
    border: "md-card-black",
    ability: "Items in hands can be invisible as well."
  },
  {
    id: "unknown",
    icon: "help_outline",
    color: "md-black",
    border: "md-card-black",
    ability: "Ability cannot be defined, but will surprise you."
  }
];

// function們
// 畫面產生
// Cards畫面
function renderGridDataPanel(herodata) {
  const dataFromLocalStorage = JSON.parse(localStorage.getItem('favoriteHeros')) || []
  let rawHTML = ''
  for (let info of herodata) {
    const favorite = (dataFromLocalStorage.some(hero => hero.name === info.name)) ? 'favorite' : 'favorite_border'
    rawHTML += `
    <div class="col-sm-2">
        <div class="card ${info.superpower.border} mb-3">
          <div class="card-head d-flex justify-content-between p-1">
            <img src="${info.picture}" data-bs-toggle="modal" data-bs-target="#hero-info"
              data-name="${info.name}" class="card-img-top" alt="...">
          </div>
          <div class="body d-flex justify-content-around align-items-center">
            <span class="hero-name fw-bold" data-bs-toggle="modal" data-bs-target="#hero-info" data-name="${info.name}">${info.name}</span>
            <span class="material-icons md-red" id="add-to-ATeam" data-name="${info.name}">
              ${favorite}
            </span>
          </div>
        </div>
      </div>
    `
  }
  dataPanel.innerHTML = rawHTML
}
// lists畫面
function renderListDataPanel(herodata) {
  const dataFromLocalStorage = JSON.parse(localStorage.getItem('favoriteHero')) || []
  let rawHTML = '<ul class="list-group col-sm-8">'
  for (let info of herodata) {
    const favorite = (dataFromLocalStorage.some(hero => hero.name === info.name)) ? 'favorite' : 'favorite_border'
    rawHTML += `
    <li class="list-group-item d-flex justify-content-between p-2 mb-3 ${info.superpower.border}">
      <h3 class="hero-name fw-bold">${info.name}</h3>
      <div class="function-icons d-flex justify-content-between align-items-center">
        <span class="material-icons md-blue me-2" data-bs-toggle="modal" data-bs-target="#hero-info" data-name="${info.name}">description</span>
        <span class="material-icons md-red" id="add-to-ATeam" data-name="${info.name}">${favorite}</span>
      </div>
      
    </li>
    `
  }
  rawHTML += '</ul>'
  dataPanel.innerHTML = rawHTML
}
// 個人資訊Modal
function renderHeroModal(getName) {
  const hero = heroDatas.find(data => data.name === getName)
  heroModalName.innerText = hero.name
  heroModalImg.src = hero.picture
  heroModalDescription.innerHTML = `
  <li>gender：${hero.gender}</li>
  <li>age：${hero.age}</li>
  <li>ability：<strong class="${hero.superpower.color} fs-5">${hero.superpower.id}</strong></li>
  <li class="mt-2 fs-5"><strong><em>${hero.superpower.ability}</em></strong></li>
  `
}

// 檢查篩選哪些超能力
function checkSuperpowerFilterArr(rawData) {
  const filterDatas = []
  for (let icon of superpowerFilterList.children) {
    if (!icon.matches('.md-gray')) {
      filterDatas.push(...rawData.filter(hero => hero.superpower.id === icon.dataset.superpower))
    }
  }
  return filterDatas
}


// 分頁器功能
function renderPaginator(rawDatas) {
  const pageNumber = Math.ceil(rawDatas.length / heroPerPage)
  let rawHTML = `
  <li class="page-item active"><a class="page-link" data-id="1" href="#">1</a></li>
  `
  if (pageNumber > 1) {
    for(let i = 2; i <= pageNumber; i++) {
      rawHTML += `
      <li class="page-item"><a class="page-link" data-id="${i}" href="#">${i}</a></li>
      `
    }
  }
  nowPage = 1
  paginator.innerHTML = rawHTML
}

function heroPerPageArr(page, rawDatas) {
  const startIndex = (page - 1) * heroPerPage
  const endIndex = page * heroPerPage
  return rawDatas.slice(startIndex, endIndex)
}

// 加入我的最愛, local storage
function addToLocalStorage(datasetName) {
  const dataFromLocalStorage = JSON.parse(localStorage.getItem('favoriteHero')) || []
  const heroData = heroDatas.find(hero => hero.name === datasetName)
  if (!dataFromLocalStorage.some(item => item.name === datasetName)) dataFromLocalStorage.push(heroData)
  localStorage.setItem('favoriteHero', JSON.stringify(dataFromLocalStorage))
}

// 移除我的最愛, Local Storage
function removeFromLocalStorage(datasetName) {
  const dataFromLocalStorage = JSON.parse(localStorage.getItem('favoriteHero')) || []
  const Index = dataFromLocalStorage.findIndex(item => item.name === datasetName)
  if (Index && Index >= 0) dataFromLocalStorage.splice(Index, 1)
  localStorage.setItem('favoriteHero', JSON.stringify(dataFromLocalStorage))
}

// 事件監聽器們
// display-way選擇
displayWay.addEventListener('click', function(event) {
  const target = event.target
  switch(true) {
    case target.matches('#grid-view'):
      target.classList.remove('md-gray')
      if (!target.nextElementSibling.matches('.md-gray')) target.nextElementSibling.classList.add('md-gray')
      renderGridDataPanel(heroPerPageArr(nowPage, checkSuperpowerFilterArr(heroDatas)))
      break
    case target.matches('#list-view'):
      target.classList.remove('md-gray')
      if (!target.previousElementSibling.matches('.md-gray')) target.previousElementSibling.classList.add('md-gray')
      renderListDataPanel(heroPerPageArr(nowPage, checkSuperpowerFilterArr(heroDatas)))
      break
    case target.matches('#superpower-filter'):
      target.classList.toggle('md-gray')
      superpowerFilterList.classList.toggle('inactive')
      break
    default:
      break
  }
})
// 超能力篩選
superpowerFilterList.addEventListener('click', function(event) {
  const target = event.target
  if (target.matches('.material-icons')) {
    target.classList.toggle('md-gray')
    const filterData = checkSuperpowerFilterArr(heroDatas)
    renderPaginator(filterData)
    if (!gridView.matches('.md-gray')) {
      renderGridDataPanel(heroPerPageArr(nowPage, filterData))
    } else {
      renderListDataPanel(heroPerPageArr(nowPage, filterData))
    }
  }
})

// 分頁器頁碼
paginator.addEventListener('click', function(event) {
  const target = event.target
  const filterData = heroPerPageArr(Number(target.dataset.id), checkSuperpowerFilterArr(heroDatas))
  if (target.tagName === 'A') {
    for (let li of paginator.children) {
      li.classList.remove('active')
    }
    target.parentElement.classList.add('active')
    if (!gridView.matches('.md-gray')) {
      renderGridDataPanel(filterData)
    } else {
      renderListDataPanel(filterData)
    }
  }
})

// dataPanel監聽
dataPanel.addEventListener('click', function(event) {
  const target = event.target
  const datasetName = target.dataset.name
  // 加入/移除我的最愛, Local Storage
  if (datasetName) {
    if (target.innerText === 'favorite_border') {
      target.innerText = 'favorite'
      addToLocalStorage(datasetName)
    } else if (target.innerText === 'favorite') {
      target.innerText = 'favorite_border'
      removeFromLocalStorage(datasetName)
    } else {
      renderHeroModal(datasetName)
    }
  }
  
})



// 初始資料產生 api
axios
  .get(USER_URL)
  .then((response) => {
    const data = response.data.results
    for(let infos of data) {
      const info = {
        name: `${infos.name.first} ${infos.name.last}`,
        gender: infos.gender,
        age: infos.dob.age,
        picture: infos.picture.large,
        email: infos.email,
        superpower: superpower[Math.floor(Math.random() * superpower.length)]
      }
      heroDatas.push(info)
    }
    const filterData = checkSuperpowerFilterArr(heroDatas)
    renderPaginator(filterData)
    renderGridDataPanel(heroPerPageArr(nowPage, filterData))
  })
  .catch((err) => console.log(err));

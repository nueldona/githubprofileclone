// navigation
const menuIcon = document.getElementById('menu__icon');
const navItem = document.getElementById('nav__item');
const navList = document.querySelectorAll('.nav__list');
const header = document.getElementById('header');
const repoContent = document.getElementById('repoContent');

// set initial state of the menu 
let showMenu = false;

menuIcon.addEventListener('click', toggleMenu);
function toggleMenu() {
  if (!showMenu) {
    navItem.classList.add('show');
    navItem.classList.remove('close');
    showMenu = true;
    header.style.height = '25.5rem';
  } else {
    navItem.classList.add('close');
    navItem.classList.remove('show');
    showMenu = false;
    header.style.height = '3.8rem';
  }
}


// tab selection

const tabItems = document.querySelectorAll('.tab-item');
const tabContentItems = document.querySelectorAll('.tab-content-item');

// select item 
function selectItem(e) {

  // remove border from the unclicked 
  removeBorder();
  removeShow();
  //add boreder
  this.classList.add('tab-border');
  // grab content item from the DOM
  const tabContentItem = document.querySelector(`#${this.id}-content`);
  // add show class
  tabContentItem.classList.add('show');
}

function removeBorder() {
  tabItems.forEach(item => item.classList.remove('tab-border'))  
}

function removeShow() {
  tabContentItems.forEach(item => item.classList.remove('show'))
}

// listen to a tab clicked
tabItems.forEach(item => item.addEventListener('click', selectItem));

// GitHub api and call function
const github_data = {
  token: "c622107001830bd9d9f82976656c498d7408e7cf",
  username: "nueldona"
};

// const fetch = require("node-fetch");
const body = {
  query: `
  {
    viewer {
      login
      repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
        nodes {
          description
          homepageUrl
          name
          forkCount
          isFork
          languages(first: 1) {
            nodes {
              color
              name
            }
          }
          updatedAt
        }
      }
    }
  }
  `,
};

const baseUrl = "https://api.github.com/graphql";

const headers = {
  "Content-Type": "application/json",
  Authorization: "bearer " + github_data["token"],
};


fetch(baseUrl, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(body),
})
.then(res => res.json())
.then(data => { 
  data.data.viewer.repositories.nodes.forEach(function (repository, i) {
    repository.languages.nodes.forEach((language, i) => {
        repoContent.innerHTML += `
          <div class="content-card">
            <div>
              <h1>${repository.name}</h1>
              <div class="language">
                <div class="dot" style="background-color: ${language.color}"></div>
                <span><p>${language.name}</p></span>
                <relative-time datetime="${repository.updatedAt}">
                  8 hours ago
                </relative-time>

              </div>
            </div>
            <button class="star-btn">
              <svg class="octicon octicon-star mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
              Star
            </button>
          </div>
      
        `;
    });
  });
})

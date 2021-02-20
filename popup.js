const BASE_URL = "https://hacker-news.firebaseio.com/v0/";
const COMMENT_BASE_URL = "https://news.ycombinator.com/item?id=";
const AUTHOR_BASE_URL = "https://news.ycombinator.com/user?id=";
let LIMIT = 10;
let BASE_TIMELINE = "topstories";

const getNewStories = async (story) => {
  const res = await fetch(BASE_URL.concat(`${story}.json`));
  return res.json();
};

const getStoryById = async (id) => {
  const res = await fetch(BASE_URL.concat(`/item/${id}.json`));
  return res.json();
};

const populateStory = async (max, story) => {
  const newStories = await getNewStories(story);
  const populated = await Promise.all(
    newStories.slice(0, max).map((storyID) => getStoryById(storyID))
  );
  return populated;
};

const clearMain = () => {
  const main = document.getElementById("main");
  main.innerHTML = "";
};

/**
 * is this how its done???
 * back to react i guess
 */
const createHTML = (
  HNauthor = "author",
  HNscore = "100",
  HNcomments = "50",
  HNtitle = "HN Story",
  HNtime = "1",
  HNurl,
  HNid
) => {
  // story div
  const storyDiv = document.createElement("div");
  storyDiv.className = "story";

  // header
  const headerDiv = document.createElement("div");
  headerDiv.className = "header";

  const title = document.createElement("a");
  title.className = "title";
  if (!HNurl) {
    title.setAttribute("href", COMMENT_BASE_URL.concat(HNid));
  } else {
    title.setAttribute("href", HNurl);
  }

  title.setAttribute("target", "_blank");
  title.setAttribute("rel", "noopener noreferrer");

  title.innerText = HNtitle;

  const pocket = document.createElement("div");
  pocket.className = "score-pocket";

  const iconDiv = document.createElement("div");
  iconDiv.className = "icon score-icon";

  const img = document.createElement("img");
  img.className = "logo";
  img.setAttribute("src", "./icons/caret-up.svg");
  img.setAttribute("alt", "score");

  iconDiv.appendChild(img);

  const score = document.createElement("div");
  score.className = "score";
  score.innerText = HNscore;

  pocket.appendChild(iconDiv);
  pocket.appendChild(score);

  headerDiv.appendChild(pocket);
  headerDiv.appendChild(title);

  // footer
  const footerDiv = document.createElement("div");
  footerDiv.className = "footer";

  // author icon begin
  const authorDivIcon = document.createElement("div");
  authorDivIcon.className = "icon author-icon";

  const imgAuthor = document.createElement("img");
  imgAuthor.className = "logo";
  imgAuthor.setAttribute("src", "./icons/person.svg");
  imgAuthor.setAttribute("alt", "person");
  authorDivIcon.appendChild(imgAuthor);

  // author icon end

  const authorDiv = document.createElement("a");
  authorDiv.className = "author";
  authorDiv.innerText = HNauthor;
  authorDiv.setAttribute("href", `${AUTHOR_BASE_URL.concat(HNauthor)}`);
  authorDiv.setAttribute("target", "_blank");
  authorDiv.setAttribute("rel", "noopener noreferrer");

  authorDivIcon.appendChild(authorDiv);

  // comments icon begin
  const commentsDivIcon = document.createElement("div");
  commentsDivIcon.className = "icon comments-icon";

  const imgComments = document.createElement("img");
  imgComments.className = "logo";
  imgComments.setAttribute("src", "./icons/chatbubble.svg");
  imgComments.setAttribute("alt", "comments");
  commentsDivIcon.appendChild(imgComments);

  // comments icon end

  const commentsDiv = document.createElement("a");
  commentsDiv.className = "comments";
  commentsDiv.setAttribute("href", COMMENT_BASE_URL.concat(HNid));
  commentsDiv.setAttribute("target", "_blank");
  commentsDiv.setAttribute("rel", "noopener noreferrer");
  commentsDiv.innerText = HNcomments;

  commentsDivIcon.appendChild(commentsDiv);

  // time icon begin
  const timeDivIcon = document.createElement("div");
  timeDivIcon.className = "icon time-icon";

  const imgTime = document.createElement("img");
  imgTime.className = "logo";
  imgTime.setAttribute("src", "./icons/hourglass.svg");
  imgTime.setAttribute("alt", "time");
  timeDivIcon.appendChild(imgTime);

  // time icon end

  const timeDiv = document.createElement("div");
  timeDiv.className = "time";
  timeDiv.innerText = `${format_time(HNtime)}`;

  timeDivIcon.appendChild(timeDiv);

  footerDiv.appendChild(authorDivIcon);
  footerDiv.appendChild(commentsDivIcon);
  footerDiv.appendChild(timeDivIcon);

  storyDiv.appendChild(headerDiv);
  storyDiv.appendChild(footerDiv);

  const main = document.getElementById("main");
  main.appendChild(storyDiv);
};

const injectToHTML = async (limit = 10, story = "topstories") => {
  const allStories = await populateStory(limit, story);
  clearMain();
  allStories.map(({ by, score, descendants, title, time, url, id }) =>
    createHTML(by, score, descendants, title, time, url, id)
  );
};

function format_time(s) {
  return new Date(s * 1000).toISOString().slice(0, 19).replace("T", " ");
}

const injectBtn = () => {
  const main = document.getElementById("main");
  // more btn
  const btn = document.createElement("button");
  btn.className = "more-btn";
  btn.id = "more";
  btn.innerText = "more";

  main.appendChild(btn);
};

//following 3 function have same structure
// TODO: refactor

// load new
const loadNewHN = async () => {
  const newHN = document.getElementById("hn-new");
  newHN.addEventListener("click", async () => {
    LIMIT = 10;
    BASE_TIMELINE = "newstories";
    await injectToHTML(LIMIT, BASE_TIMELINE);
    injectBtn();
    loadmore();
  });
};

// load best
const loadBestHN = async () => {
  const newHN = document.getElementById("hn-best");
  newHN.addEventListener("click", async () => {
    LIMIT = 10;
    BASE_TIMELINE = "beststories";
    await injectToHTML(LIMIT, BASE_TIMELINE);
    injectBtn();
    loadmore();
  });
};

// load top
const loadTopHN = async () => {
  const newHN = document.getElementById("hn-top");
  newHN.addEventListener("click", async () => {
    LIMIT = 10;
    BASE_TIMELINE = "topstories";
    await injectToHTML(LIMIT, BASE_TIMELINE);
    injectBtn();
    loadmore();
  });
};

// wtf did I do just here
const loadmore = async () => {
  const moreBtn = document.getElementById("more");
  moreBtn.addEventListener("click", async () => {
    moreBtn.setAttribute("disabled", "true");
    LIMIT += 10;
    await injectToHTML(LIMIT, BASE_TIMELINE);
    injectBtn();
    loadmore();
  });
};

// iife to await injectToHTML function
(async function () {
  await injectToHTML(10, BASE_TIMELINE);
  injectBtn();
  loadmore();
  loadNewHN();
  loadBestHN();
  loadTopHN();
})();

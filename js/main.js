'use strict';

const articleGrid = document.getElementById('articleGrid');
const filters = document.getElementById('categoryFilters');
const resultsMessage = document.getElementById('resultsMessage');
const totalCount = document.getElementById('totalCount');
let articles = [];
let activeCategory = '全部';

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function createCard(item) {
  const link = makeElement('a', 'article-card');
  link.href = `article.html?id=${encodeURIComponent(item.slug)}`;
  link.setAttribute('aria-label', `閱讀文章：${item.title}`);

  const top = makeElement('div', 'card-top');
  top.append(makeElement('span', 'category-tag', item.category));
  top.append(makeElement('span', 'card-time', item.readingTime));
  link.append(top);
  link.append(makeElement('h3', '', item.title));
  link.append(makeElement('div', 'english-name', item.englishTitle));
  link.append(makeElement('p', 'card-summary', item.summary));
  link.append(makeElement('span', 'read-more', '閱讀文章 ↗'));
  return link;
}

function renderArticles() {
  const matching = articles.filter((article) => {
    const inCategory = activeCategory === '全部' || article.category === activeCategory;
    return inCategory;
  });
  articleGrid.replaceChildren();
  resultsMessage.textContent = `找到 ${matching.length} 篇文章`;
  if (matching.length === 0) {
    const empty = makeElement('div', 'empty-state');
    empty.append(makeElement('h3', '', '沒有找到符合的文章'));
    empty.append(makeElement('p', '', '請選擇其他文章分類。'));
    articleGrid.append(empty);
    return;
  }
  matching.forEach((item) => articleGrid.append(createCard(item)));
}

function renderFilters() {
  const categories = ['全部', ...new Set(articles.map((item) => item.category))];
  filters.replaceChildren();
  categories.forEach((category) => {
    const button = makeElement('button', 'filter-button', category);
    button.type = 'button';
    button.classList.toggle('is-active', activeCategory === category);
    button.setAttribute('aria-pressed', String(activeCategory === category));
    button.addEventListener('click', () => {
      activeCategory = category;
      renderFilters();
      renderArticles();
    });
    filters.append(button);
  });
}

async function initialize() {
  try {
    const response = await fetch('content/articles.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('文章清單格式不正確');
    articles = data.filter((item) =>
      item && typeof item.slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) &&
      ['title', 'englishTitle', 'category', 'summary', 'readingTime'].every((key) => typeof item[key] === 'string')
    );
    totalCount.textContent = `✦ 共 ${articles.length} 篇文章`;
    renderFilters();
    renderArticles();
  } catch (error) {
    totalCount.textContent = '文章載入失敗';
    resultsMessage.textContent = '暫時無法取得文章資料。請使用本地 HTTP Server 開啟，或確認 GitHub Pages 已啟用。';
    console.error('文章清單載入失敗：', error);
  }
}

initialize();

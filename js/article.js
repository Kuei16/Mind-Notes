'use strict';

const articleContent = document.getElementById('articleContent');
const requiredHeadings = ['心理學定義', '形成原因', '生活案例', '可能的影響', '改善與應用'];

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function showError(message) {
  const box = makeElement('div', 'error-message');
  box.append(makeElement('h1', '', '文章暫時無法顯示'));
  box.append(makeElement('p', '', message));
  const back = makeElement('a', '', '返回文章列表');
  back.href = 'index.html#explore';
  box.append(back);
  articleContent.replaceChildren(box);
}

function isValidArticle(article, slug) {
  return article && article.slug === slug &&
    ['title', 'englishTitle', 'category', 'summary'].every((key) => typeof article[key] === 'string') &&
    Array.isArray(article.sections) && article.sections.length === requiredHeadings.length &&
    article.sections.every((section, i) => section.heading === requiredHeadings[i] &&
      Array.isArray(section.paragraphs) && section.paragraphs.length > 0 &&
      section.paragraphs.every((p) => typeof p === 'string' && p.trim())) &&
    Array.isArray(article.references) && article.references.length > 0 &&
    article.references.every((r) => r && typeof r.label === 'string');
}

function renderArticle(article) {
  document.title = `${article.title}｜Mind Notes`;
  const paper = makeElement('article', 'article-paper');
  const hero = makeElement('div', 'article-hero');
  hero.append(makeElement('span', 'category-tag', article.category));
  hero.append(makeElement('h1', '', article.title));
  hero.append(makeElement('p', 'article-en', article.englishTitle));
  hero.append(makeElement('p', 'article-summary', article.summary));
  paper.append(hero);

  article.sections.forEach((section) => {
    const sectionElement = makeElement('section', 'article-section');
    sectionElement.append(makeElement('h2', '', section.heading));
    section.paragraphs.forEach((paragraph) => sectionElement.append(makeElement('p', '', paragraph)));
    paper.append(sectionElement);
  });

  const referenceSection = makeElement('section', 'references');
  referenceSection.append(makeElement('h2', '', '參考資料'));
  const list = makeElement('ul');
  article.references.forEach((ref) => {
    const item = makeElement('li');
    if (ref.url && /^https:\/\//.test(ref.url)) {
      const link = makeElement('a', '', ref.label);
      link.href = ref.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      item.append(link);
    } else {
      item.textContent = ref.label;
    }
    list.append(item);
  });
  referenceSection.append(list);
  paper.append(referenceSection);
  articleContent.replaceChildren(paper, makeElement('p', 'reader-foot', '每一次好奇，都是理解自己的一小步 ✦'));
}

async function initialize() {
  const slug = new URLSearchParams(window.location.search).get('id');
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    showError('文章網址不正確。請從文章列表重新選擇。');
    return;
  }
  try {
    const response = await fetch(`content/${slug}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const article = await response.json();
    if (!isValidArticle(article, slug)) throw new Error('文章資料格式不正確');
    renderArticle(article);
  } catch (error) {
    showError('找不到這篇文章，或資料尚未正確發布。');
    console.error('文章載入失敗：', error);
  }
}

initialize();

'use strict';

const fs = require('fs');
const cheerio = require('cheerio');
const got = require('got');
let jsonData = {};

const handyServicesURL = 'https://www.handy.com/services';
const handyBaseURL = 'https://www.handy.com';
const targetSelector = 'a.service-link.mixpanel';

const getCapitalizedString = (name) => {
  const lowerCaseTitle = name.toLowerCase();
  if (typeof lowerCaseTitle !== 'string') return '';
  return lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1);
};

const findDescription = async function (url) {
  let description = [];
  let descriptionString = '';
  let response = null;
  try {
    response = await got(url);
  } catch (e) {
    return descriptionString;
  }
  if (response && response.body) {
    const $ = cheerio.load(response.body);
    if ($('div.service-desc-when')[0] && $('div.service-desc-when')[0].type === 'tag' && $('div.service-desc-when')[0].name === 'div') {
      $('div.service-desc-when').each((i, link) => {
        if (link.children && link.children[0]) {
          if (link.children[0].type === 'text' && link.children[0].data && link.children[0].data.length > 1) {
            description.push(link.children[0].data);
          }
        }
      });
    } else {
      $('div.cell.head__description').each((i, link) => {
        for (let i = 0; i < link.children.length; i++) {
          if (link.children[i].data === undefined) {
            if (link.children[i].children && link.children[i].children[0]) {
              if (link.children[i].children[0].type === 'text' && link.children[i].children[0].data) {
                if (link.children[i].children[0].data.length > 1) {
                  description.push(link.children[i].children[0].data);
                }
              }
              if (link.children[i].children[0].type === 'tag' && link.children[i].children[0].name === 'strong') {
                if (link.children[i].children[0].children[0] && link.children[i].children[0].children[0].type === 'text') {
                  if (link.children[i].children[0].children[0].data.length > 1) {
                    description.push(link.children[i].children[0].children[0].data);
                  }
                }
              }
            }
          }
        }
      });
    }
  } else {
    return descriptionString;
  }

  if (description.length > 0) {
    descriptionString = description.join(' ');
  }
  return descriptionString;
};

(async () => {
  const response = await got(handyServicesURL);
  const $ = cheerio.load(response.body);
  $(targetSelector).each(async (i, link) => {
    let href = null;
    let title = null;
    let category = null;

    if (link && link.attribs && link.attribs.href) {
      href = link.attribs.href.split('?')[0];
    }

    if (link && link.children && link.children[0] && link.children[0].data) {
      title = link.children[0].data;
    }

    if (link && link.attribs && link.attribs['data-mixpanel-category']) {
      if (link.attribs['data-mixpanel-category'] === 'ha_services') {
        category = 'Home Improvement Projects';
      } else {
        let formattedCategoryName = [];
        let categoryString = link.attribs['data-mixpanel-category'].split('_');

        categoryString.forEach((category) => {
          if (category && category.length > 0) {
            formattedCategoryName.push(getCapitalizedString(category));
          }
        });
        category = formattedCategoryName.join(' ').trim();
      }
    }

    if (!jsonData[category]) {
      jsonData[category] = [];
    }
    let description = null;
    try {
      description = await findDescription(handyBaseURL + href);
    } catch(e) {
      console.log(e);
    }

    let individualService = {
      title,
      url: handyBaseURL + href,
      category,
      description: description ? description : '',
      favorited: false,
    };

    jsonData[category].push(individualService);
    let data = JSON.stringify(jsonData);
    fs.writeFileSync('handyServices.json', data);
  });
})();

export {}
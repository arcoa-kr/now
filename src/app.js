(function () {
  "use strict";

  var data = window.ARCOA_DATA;

  if (!data) {
    return;
  }

  var socialIconMarkup = {
    home: '<path d="m3.5 9.4 6.5-5.3 6.5 5.3v6.1a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V9.4Z"/><path d="M7.5 16.5v-4h5v4"/>',
    threads: '<path d="M15.7 11.2c0-3.6-2.1-5.8-5.6-5.8-3.8 0-5.9 2.5-5.9 6 0 3.7 2.3 6 6 6 2.5 0 4.5-1.3 5.2-3.3.4-1.3-.1-2.5-1.3-3.1-1.7-.9-4.2-.3-5.4.7"/><path d="M8.5 11.7c1.5-1.2 4.8-1.5 6.7-.5 1.2.6 1.9 1.6 1.9 2.8"/>',
    instagram: '<rect x="3.5" y="3.5" width="13" height="13" rx="3"/><circle cx="10" cy="10" r="3.1"/><circle cx="14.2" cy="5.8" r=".7" fill="currentColor" stroke="none"/>',
    x: '<path d="M4 4.2 16 15.8M16 4.2 4 15.8"/>',
    linkedin: '<rect x="3.5" y="3.5" width="13" height="13" rx="1.5"/><path d="M6.5 8.5v5M6.5 6.4v.1M9.5 13.5v-3c0-1.2.7-2 1.8-2s1.7.7 1.7 2v3M9.5 8.6v4.9"/>'
  };

  var setText = function (selector, value) {
    var element = document.querySelector(selector);
    if (element) {
      element.textContent = value;
    }
  };

  var setMeta = function (selector, value) {
    var element = document.querySelector(selector);
    if (element) {
      element.setAttribute("content", value);
    }
  };

  var createTextElement = function (tagName, className, value) {
    var element = document.createElement(tagName);
    element.className = className;
    element.textContent = value;
    return element;
  };

  var applyExternalLink = function (element, url, label) {
    element.href = url;
    element.target = "_blank";
    element.rel = "noopener noreferrer";
    element.setAttribute("aria-label", label + " 열기");
  };

  var createSocialIcon = function (name) {
    var icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 20 20");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");
    icon.innerHTML = socialIconMarkup[name] || socialIconMarkup.home;
    return icon;
  };

  document.title = data.site.title;
  setMeta('meta[name="description"]', data.site.description);
  setMeta('meta[property="og:title"]', data.site.title);
  setMeta('meta[property="og:description"]', data.site.description);
  setMeta('meta[property="og:url"]', data.site.url);
  setMeta('meta[property="og:image"]', data.site.ogImage);
  setMeta('meta[name="twitter:title"]', data.site.title);
  setMeta('meta[name="twitter:description"]', data.site.description);
  setMeta('meta[name="twitter:image"]', data.site.ogImage);

  setText("[data-hero-title]", data.hero.title);
  setText("[data-hero-url]", data.hero.linkLabel + " ↗");
  setText("[data-services-title]", data.labels.services);
  setText("[data-explore-title]", data.labels.explore);
  setText("[data-featured-title]", data.labels.featured);
  setText("[data-footer-representative]", "대표: " + data.footer.representative);
  setText("[data-footer-email]", "문의: " + data.footer.email);
  setText("[data-footer-copyright]", data.footer.copyright);

  var heroBrand = document.querySelector("[data-hero-brand]");
  var heroLogo = document.querySelector("[data-hero-logo]");
  var footerBrand = document.querySelector("[data-footer-brand]");
  var footerLogo = document.querySelector("[data-footer-logo]");
  applyExternalLink(heroBrand, data.hero.brandUrl, "ARCOA 홈페이지");
  applyExternalLink(document.querySelector("[data-hero-url-link]"), data.hero.brandUrl, "arcoa.kr 홈페이지");
  applyExternalLink(footerBrand, data.footer.brandUrl, "ARCOA 홈페이지");
  heroLogo.src = data.hero.logo;
  heroLogo.alt = data.hero.logoAlt;
  footerLogo.src = data.footer.logo;
  footerLogo.alt = data.footer.logoAlt;

  var serviceList = document.querySelector("[data-services]");
  data.services.forEach(function (service) {
    var item = document.createElement(service.url ? "a" : "div");
    item.className = "service-row" + (service.url ? " service-row--linked" : " service-row--disabled");

    if (service.url) {
      applyExternalLink(item, service.url, service.englishName + " " + service.koreanName);
    } else {
      item.setAttribute("aria-label", service.englishName + " " + service.koreanName + " " + service.status);
    }

    item.appendChild(createTextElement("span", "service-number", service.number));

    var copy = document.createElement("span");
    copy.className = "service-copy";

    var titleLine = document.createElement("span");
    titleLine.className = "service-name-line";
    titleLine.appendChild(createTextElement("span", "service-english-name", service.englishName));
    titleLine.appendChild(createTextElement("span", "service-korean-name", service.koreanName));
    if (service.featured) {
      titleLine.appendChild(createTextElement("span", "service-featured", "FEATURED"));
    }
    copy.appendChild(titleLine);
    copy.appendChild(createTextElement("span", "service-title", service.title));
    if (service.description) {
      copy.appendChild(createTextElement("span", "service-description", service.description));
    }

    var meta = createTextElement("span", service.status ? "service-status" : "service-url", service.status || service.urlLabel);
    item.appendChild(copy);
    item.appendChild(meta);
    serviceList.appendChild(item);
  });

  var exploreList = document.querySelector("[data-explore]");
  data.explore.forEach(function (entry) {
    var item = document.createElement(entry.locales ? "div" : "a");
    item.className = "explore-row" + (entry.locales ? " explore-row--locales" : " explore-row--linked");
    if (!entry.locales) {
      applyExternalLink(item, entry.url, entry.label);
    }

    var copy = document.createElement("span");
    copy.className = "explore-copy";
    copy.appendChild(createTextElement("span", "explore-label", entry.label));
    copy.appendChild(createTextElement("span", "explore-description", entry.description));
    copy.appendChild(createTextElement("span", "explore-detail", entry.detail));
    item.appendChild(copy);

    var meta = document.createElement("span");
    meta.className = "explore-meta";
    if (entry.locales) {
      entry.locales.forEach(function (locale, index) {
        var link = createTextElement("a", "locale-link", locale.label);
        applyExternalLink(link, locale.url, locale.label);
        meta.appendChild(link);
        if (index < entry.locales.length - 1) {
          meta.appendChild(document.createTextNode(" / "));
        }
      });
    } else {
      meta.textContent = entry.urlLabel;
    }
    item.appendChild(meta);
    exploreList.appendChild(item);
  });

  var featured = document.querySelector("[data-featured-card]");
  applyExternalLink(featured, data.featured.url, data.featured.title);
  setText("[data-featured-heading]", data.featured.heading);
  setText("[data-featured-story]", data.featured.title);
  setText("[data-featured-partner]", data.featured.partnerLabel);
  setText("[data-featured-description]", data.featured.description);

  var socialList = document.querySelector("[data-socials]");
  data.footer.socials.forEach(function (social) {
    var link = document.createElement("a");
    link.className = "social-link";
    applyExternalLink(link, social.url, social.label);
    link.appendChild(createSocialIcon(social.icon));
    socialList.appendChild(link);
  });
})();

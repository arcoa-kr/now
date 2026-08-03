(function () {
  "use strict";

  var data = window.ARCOA_DATA;

  if (!data) {
    return;
  }

  var socialIconPaths = {
    home: "./assets/icon-ARCOA.svg",
    threads: "./assets/icon-threads.svg",
    instagram: "./assets/icon-insta.svg",
    x: "./assets/icon-x.svg",
    linkedin: "./assets/icon-linkedin.svg"
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
    var icon = document.createElement("img");
  
    icon.className = "social-icon";
    icon.src = socialIconPaths[name] || socialIconPaths.home;
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
  
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

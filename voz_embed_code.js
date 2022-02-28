// ==UserScript==
// @name        vozembedcode
// @include     https://voz.vn/*
// @version     5
// @description Autodecode base64 text and preview images, links...
// @updateURL   https://raw.githubusercontent.com/git1-eipi10/voz_code/main/voz_embed_code.js
// @require     https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// @run-at      document-start
// ==/UserScript==

function setAttributes(el, attrs) {
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
}

function endsWith2(exts, link) {
  for (const ext of exts)
    if (link.endsWith(ext)) return true;
  return false;
}

function embed_link(link) {
  let link_embed = document.createElement("a");
  let attrs = {
    href: link,
    target: "_blank",
    class: "link link--external",
    rel: "nofollow ugc noopener"
  }
  setAttributes(link_embed, attrs);
  link_embed.innerHTML = link;
  return link_embed;
}

function embed_image(img_link) {
  let img_embed = document.createElement("img");
  let attrs = {
    src: img_link,
    class: "bbImage",
  }
  setAttributes(img_embed, attrs);
  img_embed.innerHTML = img_link;
  return img_embed;
}

function embed_general(contents, item, embed_type) {
  let urls = contents.split("\n");
  let element_embed = "";
  for (const url of urls) {
    if (embed_type === "link") element_embed = embed_link(url);
    else if (embed_type === "image") element_embed = embed_image(url);
    else if (embed_type === "imgur") {
      imgur_id = url.split(".com/")[1];
      img_link = "https://i.imgur.com/" + imgur_id + ".gif";
      element_embed = embed_image(img_link);
    }
    item.parentElement.insertBefore(element_embed, item);
  }
}

var extensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"];

document.arrive(".bbCodeCode", item => {
  let parent = item.closest(".bbCodeBlock--code");
  if (item.innerText.startsWith("aHR0c"))
    embed_general(atob(item.innerText.split("\n")[0]), parent, "link");
  else if (item.innerText.startsWith("http")) {
    if (endsWith2(extensions, item.innerText))
      embed_general(item.innerText, parent, "image");
    else if (item.innerText.startsWith("https://imgur.com") && !item.innerText.startsWith("https://imgur.com/a/"))
      embed_general(item.innerText, parent, "imgur");
    else
      embed_general(item.innerText, parent, "link");
  }
});

document.arrive(".bbCodeBlock--quote > .bbCodeBlock-content", item => {
  if (item.innerText.startsWith("aHR0c"))
    embed_general(atob(item.innerText.split("\n")[0]), item.closest(".bbCodeBlock--quote"), "link");
});

// ==UserScript==
// @name        vozembedcode
// @include     https://voz.vn/*
// @version      2
// @description  Autodecodes any Base64 text on a "code box" and show it as a link.
// @updateURL   https://raw.githubusercontent.com/git1-eipi10/voz_code/main/voz_embed_code.js
// @match        none
// @grant        none
// ==/UserScript==

function setAttributes(el, attrs) {
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
}

function endsWith2(ext, link) {
  for (var i = 0; i < ext.length; i++) {
    if (link.endsWith(ext[i])) { return true; }
  }
  return false;
}

function embed_link(link) {
  let link_embed = document.createElement("a");
  var attrs = {
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
  var attrs = {
    src: img_link,
    class: "bbImage",
  }
  setAttributes(img_embed, attrs);
  img_embed.innerHTML = img_link;
  return img_embed;
}

function embed_general(contents, item_i, embed_type) {
  var urls = contents.split("\n");
  var element_embed = "";
  for (var j = 0; j < urls.length; j++) {
    if (embed_type === "link") { element_embed = embed_link(urls[j]); }
    else if (embed_type === "image") { element_embed = embed_image(urls[j]); }
    else if (embed_type === "imgur") {
      imgur_id = urls[j].split(".com/")[1];
      img_link = "https://i.imgur.com/" + imgur_id + ".gif";
      element_embed = embed_image(img_link);
    }
    item_i.parentElement.insertBefore(element_embed, item_i);
    var br = document.createElement("br");
    item_i.parentElement.insertBefore(br, item_i);
  }
}

var extensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"];

var items_codes = document.querySelectorAll(".bbCodeCode");
var items_quote = document.querySelectorAll(".bbCodeBlock--quote > .bbCodeBlock-content")

if (items_codes) {
  for(var i = 0; i < items_codes.length; i++) {
    var parent = items_codes[i].closest(".bbCodeBlock--code")
    if (items_codes[i].innerText.startsWith("aHR0c")) {
      decoded = atob(items_codes[i].innerText.split("\n")[0]);
      embed_general(decoded, parent, "link");
    }
    else if (items_codes[i].innerText.startsWith("http")) {
      if (endsWith2(extensions, items_codes[i].innerText)) {
        embed_general(items_codes[i].innerText, parent, "image");
      }
      else if (items_codes[i].innerText.startsWith("https://imgur.com") && !items_codes[i].innerText.startsWith("https://imgur.com/a/")) {
        embed_general(items_codes[i].innerText, parent, "imgur");
      }
      else {
        embed_general(items_codes[i].innerText, parent, "link");
      }
    }
  }
}

if (items_quote) {
  for(var i = 0; i < items_quote.length; i++) {
    if (items_quote[i].innerText.startsWith("aHR0c")) {
      var parent = items_quote[i].closest(".bbCodeBlock--quote")
      decoded = atob(items_quote[i].innerText.split("\n")[0]);
      embed_general(decoded, parent, "link");
    }
  }
}

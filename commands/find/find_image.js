const commando = require('discord.js-commando');
const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
var he = require('he');
var functions = require('../../functions.js');
require('@gouch/to-title-case')
var urlencode = require('urlencode');


class FindImage extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'image',
		aliases: ['images', 'img', 'i'],
            group: 'find',
            memberName: 'image',
            description: 'find images of an unit',
		examples: ['&image quill'],
        args: [{
		    key: 'text',
			prompt: 'What unit do you want to know about?',
		    type: 'string'
		}]
        });
    }

    async run(message, { text }) {
        var unit = functions.nameChange(text)
        var link = "https://aigis.fandom.com/wiki/" + urlencode(unit);
        request(link, function(err, resp, html) {
  if (!err) {
    const $ = cheerio.load(html);
    var check = false;
    var img;
    var pages = [];
    var page = 1;
    img = ($('.BaseGallery div:nth-child(2) a img').attr('data-src'));
    if (img) {
      let nam =($('.BaseGallery div:nth-child(2) a img').attr('alt'));
      nam = nam.split(" Render")[0]
      check = true
      let embed = new Discord.RichEmbed()
      img = img.split("/scale-to-width-down/")[0]
      embed.setTitle(nam)
      embed.setImage(img)
      pages.push(embed)
    }
	  img = ($('.\\_toggle.Normalskill div:nth-child(2) a img').attr('data-src'));
    if (img) {
      let nam =($('.\\_toggle.Normalskill div:nth-child(2) a img').attr('alt'));
      nam = nam.split(" Render")[0]
      check = true
      let embed = new Discord.RichEmbed()
      img = img.split("/scale-to-width-down/")[0]
      embed.setTitle(nam)
      embed.setImage(img)
      pages.push(embed)
    }
    img = ($('.AWGallery div:nth-child(2) a img').attr('data-src'));
    if (img) {
      let nam =($('.AWGallery div:nth-child(2) a img').attr('alt'));
      nam = nam.split(" Render")[0]
      check = true
      let embed = new Discord.RichEmbed()
      img = img.split("/scale-to-width-down/")[0]
      embed.setTitle(nam)
      embed.setImage(img)
      pages.push(embed)
    }
	  img = ($('.\\_toggle.AWskill div:nth-child(2) a img').attr('data-src'));
    if (img) {
      let nam =($('.\\_toggle.AWskill div:nth-child(2) a img').attr('alt'));
      nam = nam.split(" Render")[0]
      check = true
      let embed = new Discord.RichEmbed()
      img = img.split("/scale-to-width-down/")[0]
      embed.setTitle(nam)
      embed.setImage(img)
      pages.push(embed)
    }
    img = ($('.AW2Gallery div:nth-child(2) a img').attr('data-src'));
    if (img) {
      let nam =($('.AW2Gallery div:nth-child(2) a img').attr('alt'));
      nam = nam.split(" Render")[0]
      check = true
      let embed = new Discord.RichEmbed()
      img = img.split("/scale-to-width-down/")[0]
      embed.setTitle(nam)
      embed.setImage(img)
      pages.push(embed)
    }
	  img = ($('.\\_toggle.AW2skill div:nth-child(2) a img').attr('data-src'));
    if (img) {
      let nam =($('.\\_toggle.AW2skill div:nth-child(2) a img').attr('alt'));
      nam = nam.split(" Render")[0]
      check = true
      let embed = new Discord.RichEmbed()
      img = img.split("/scale-to-width-down/")[0]
      embed.setTitle(nam)
      embed.setImage(img)
      pages.push(embed)
    }
    img = ($('.AW2v1Gallery div:nth-child(2) a img').attr('data-src'));
    if (img) {
      let nam =($('.AW2v1Gallery div:nth-child(2) a img').attr('alt'));
      nam = nam.split(" Render")[0]
      check = true
      let embed = new Discord.RichEmbed()
      img = img.split("/scale-to-width-down/")[0]
      embed.setTitle(nam)
      embed.setImage(img)
      pages.push(embed)
    }
	  img = ($('.\\_toggle.AW2v1skill div:nth-child(2) a img').attr('data-src'));
    if (img) {
      let nam =($('.\\_toggle.AW2v1skill div:nth-child(2) a img').attr('alt'));
      nam = nam.split(" Render")[0]
      check = true
      let embed = new Discord.RichEmbed()
      img = img.split("/scale-to-width-down/")[0]
      embed.setTitle(nam)
      embed.setImage(img)
      pages.push(embed)
    }
    img = ($('.AW2v2Gallery div:nth-child(2) a img').attr('data-src'));
    if (img) {
      let nam =($('.AW2v2Gallery div:nth-child(2) a img').attr('alt'));
      nam = nam.split(" Render")[0]
      check = true
      let embed = new Discord.RichEmbed()
      img = img.split("/scale-to-width-down/")[0]
      embed.setTitle(nam)
      embed.setImage(img)
      pages.push(embed)
    }
	  img = ($('.\\_toggle.AW2v2skill div:nth-child(2) a img').attr('data-src'));
    if (img) {
      let nam =($('.\\_toggle.AW2v2skill div:nth-child(2) a img').attr('alt'));
      nam = nam.split(" Render")[0]
      check = true
      let embed = new Discord.RichEmbed()
      img = img.split("/scale-to-width-down/")[0]
      embed.setTitle(nam)
      embed.setImage(img)
      pages.push(embed)
    }
    for (var i = 1; i < 5; i++) {
      img = ($('.AVer\\.Gallery div:nth-child(' + i + ') a img').attr('data-src'));
      if (img) {
        let nam =($('.AVer\\.Gallery div:nth-child(' + i + ') a img').attr('alt'));
        nam = nam.split(" Render")[0]
        check = true
        let embed = new Discord.RichEmbed()
        img = img.split("/scale-to-width-down/")[0]
        embed.setTitle(nam)
        embed.setImage(img)
        pages.push(embed)
      }
    }
	  for (var i = 1; i < 5; i++) {
      img = ($('.\\_toggle.AAskill div:nth-child(' + i + ') a img').attr('data-src'));
      if (img) {
        let nam =($('.\\_toggle.AAskill div:nth-child(' + i + ') a img').attr('alt'));
        nam = nam.split(" Render")[0]
        check = true
        let embed = new Discord.RichEmbed()
        img = img.split("/scale-to-width-down/")[0]
        embed.setTitle(nam)
        embed.setImage(img)
        pages.push(embed)
      }
    }
	  if (pages.length == 0) {
      ($('.image.lightbox')).each(function(i, elem) {
        img = $(this).find('img').attr('data-src')
        let nam = $(this).find('img').attr('alt')
        let pa = nam.split(" Render")
        if (pa.length > 1) {
          nam = pa[0]
          check = true
          let embed = new Discord.RichEmbed()
          img = img.split("/scale-to-width-down/")[0]
          embed.setTitle(nam)
          embed.setImage(img)
          pages.push(embed)
        }
      });
    }
		if (check) {
		var embed = pages[0];
		embed.setFooter('Page ' + page + ' of ' + pages.length);
		message.channel.send(embed).then(msg => {

		msg.react('⬅').then( r => {
        msg.react('➡')

        // Filters
        const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && !user.bot;
        const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && !user.bot;

        const backwards = msg.createReactionCollector(backwardsFilter, {timer: 6000});
        const forwards = msg.createReactionCollector(forwardsFilter, {timer: 6000});

        backwards.on('collect', r => {
		r.remove(r.users.filter(u => !u.bot).first());
        	if (page === 1) return;
         	page--;
            	embed = pages[page-1];
            	embed.setFooter('Page ' + page + ' of ' + pages.length);
            	msg.edit(embed)
        })

        forwards.on('collect', r => {
		r.remove(r.users.filter(u => !u.bot).first());
            	if (page === pages.length) return;
            	page++;
            	embed = pages[page-1];
            	embed.setFooter('Page ' + page + ' of ' + pages.length);
            	msg.edit(embed)
        })
    })
})
	    }
                if (!check) {message.channel.send("No Data")};
            }
        });
    }
}
module.exports = FindImage;

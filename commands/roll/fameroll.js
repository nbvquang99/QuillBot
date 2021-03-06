const commando = require('discord.js-commando');
const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
var he = require('he');
const random = require('random')
var black = require('../../roll/black.js').black;
var plat = require('../../roll/plat.js').plat;
var gold = require('../../roll/gold.js').gold;
var chibi = require('../../roll/chibi.js').chibi;
var urlencode = require('urlencode');
const Keyv = require('keyv');
var moment = require('moment')
const humanizeDuration = require('humanize-duration')
require('@keyv/mysql')
require('@keyv/mongo')

class RanRoll extends commando.Command {
    constructor(client) {
        super(client, {
            	name: 'fameroll',
		aliases: ['famepull', 'famegacha', 'famedraw'],
            	group: 'roll',
            	memberName: 'fameroll',
            	description: 'fame gacha stimulator(usable once per week, reset Thursday each week)',
		examples: ['&fameroll'],
        });
    }

    async run(message, input) {
		var daynum = {
		  "Mon": 3,
		  "Tue": 2,
		  "Wed": 1,
		  "Thu": 7,
		  "Fri": 6,
		  "Sat": 5,
		  "Sun": 4,
		}
		var now = new Date()
		var m = moment(now).add(9, 'hours')
		var mm = m.format('ddd MMM DD YYYY HH mm ss')
		var words = mm.split(' ')
		var date = words[0]
		var month = words[1]
		var day = words[2]
		var year = words[3]
	    const lastroll = new Keyv(process.env.MONGODB_URI, { namespace: 'lastroll' });
	    lastroll.on('error', err => console.error('Keyv connection error:', err));
		const fame = new Keyv(process.env.MONGODB_URI, { namespace: 'fame' });
	    fame.on('error', err => console.error('Keyv connection error:', err));
		var ufame = await fame.get(message.author.id)
		var lr = []
		var m2 = moment(year + " " +  month + " " + day, 'YYYY MMM DD').add(daynum[date], 'days')
		var mm2 = m2.toString()
		var nwords = mm2.split(' ')
		var nmonth = nwords[1]
		var nday = nwords[2]
		var nyear = nwords[3]
		var nfame = [nday, nmonth, nyear]
		if (ufame == undefined) {
			var rar = random.int(1, 100)
			var embed = new Discord.RichEmbed()
			embed.setTitle("Fame Gacha Roll Result")
			if (rar < 6) {
				var ind = random.int(1, size_dict(black))
				var unit = black[ind]
				embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*)")
				embed.setColor([95, 64, 0])
			}
			else if (rar < 22) {
				var ind = random.int(1, size_dict(plat))
				var unit = plat[ind]
				embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (5*)")
				embed.setColor('GREEN')
			}
			else if (rar < 59) {
				var ind = random.int(1, size_dict(gold))
				var unit = gold[ind]
				embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (4*)")
				embed.setColor('GOLD')
			}
			else if (rar < 99){
				var ind = random.int(0, chibi.length - 1)
				var unit = chibi[ind]
				embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (4*)")
				embed.setColor('GOLD')
			}
			else {
				var unit = "Happy"
				embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*)")
				embed.setColor([95, 64, 0])
			}
			lr.push(unit)
			send1(message, unit, embed)
		}
		else {
			var fday = ufame[0]
			var fmonth = ufame[1]
			var fyear = ufame[2]
			var fm = moment(fyear + " " +  fmonth + " " + fday, 'YYYY MMM DD')
			if (fm.isBefore(m)) {
				var rar = random.int(1, 100)
				var embed = new Discord.RichEmbed()
				embed.setTitle("Fame Gacha Roll Result")
				if (rar < 6) {
					var ind = random.int(1, size_dict(black))
					var unit = black[ind]
					embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*)")
					embed.setColor([95, 64, 0])
				}
				else if (rar < 22) {
					var ind = random.int(1, size_dict(plat))
					var unit = plat[ind]
					embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (5*)")
					embed.setColor('GREEN')
				}
				else if (rar < 59) {
					var ind = random.int(1, size_dict(gold))
					var unit = gold[ind]
					embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (4*)")
					embed.setColor('GOLD')
				}
				else if (rar < 99){
					var ind = random.int(0, chibi.length - 1)
					var unit = chibi[ind]
					embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (4*)")
					embed.setColor('GOLD')
				}
				else {
					var unit = "Happy"
					embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*)")
					embed.setColor([95, 64, 0])
				}
				lr.push(unit)
				send1(message, unit, embed)
			}
			else {
				var dif1 = fm.diff(m)
				var diff1 = humanizeDuration(dif1, { units: ['d', 'h', 'm', 's'] , round: true })
				message.channel.send("You have already used this week fame summon.\nTime until next fame summon: " + diff1)
				var nfame = ufame
				lr = await lastroll.get(message.author.id)
			}
		}
	    	await lastroll.set(message.author.id, lr)
		await fame.set(message.author.id, nfame)
	}
}
function size_dict(d){
	c=0; 
	for (i in d) ++c;
	return c
}
async function send1(message, unit, embed) {
	var link = "https://aigis.fandom.com/wiki/" + urlencode(unit);
	request(link, function(err, resp, html) {
		if (!err) {
			const $ = cheerio.load(html);
			img = ($('.BaseGallery div:nth-child(1) a img').attr('data-src'));
			if (img) {
				let nam =($('.BaseGallery div:nth-child(1) a img').attr('alt'));
				let pa = nam.split(" Icon")
				if (pa.length > 1) {
					img = img.split("/scale-to-width-down/")[0]
				}
			}
			if (!img) {
				img = $('.image.lightbox img').attr('data-src')
					if (img) {
					let nam =($('.image.lightbox img').attr('alt'));
					let pa = nam.split(" Icon")
					if (pa.length > 1) {
						img = img.split("/scale-to-width-down/")[0]
					}
				}
			}
			embed.setImage(img)
			message.channel.send(embed)
		}
	})
}
module.exports = RanRoll;

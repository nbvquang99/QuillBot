const commando = require('discord.js-commando');
const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
var he = require('he');
const random = require('random')
var black = require('../../roll/black.js').black;
var plat = require('../../roll/plat.js').plat;
var gold = require('../../roll/gold.js').gold;
var sil = require('../../roll/sil.js').sil;
var iblack = require('../../roll/iblack.js').iblack;
var iplat = require('../../roll/iplat.js').iplat;
var igold = require('../../roll/igold.js').igold;
var isil = require('../../roll/isil.js').isil;
var pugblack = require('../../roll/pugblack.js').pugblack;
var pugplat = require('../../roll/pugplat.js').pugplat;
var bannerblack = require('../../roll/bannerblack.js').bannerblack;
var bannerplat = require('../../roll/bannerplat.js').bannerplat;
var bannergold = require('../../roll/bannergold.js').bannergold;
var bannersil = require('../../roll/bannersil.js').bannersil;
var eventblack = require('../../roll/eventblack.js').eventblack;
var eventplat = require('../../roll/eventplat.js').eventplat;
var eventgold = require('../../roll/eventgold.js').eventgold;
var b1fb = require('../../roll/b1fb.js').b1fb;
var b1fp = require('../../roll/b1fp.js').b1fp;
var b1fg = []
var b2fb = require('../../roll/b2fb.js').b2fb;
var b2fp = require('../../roll/b2fp.js').b2fp;
var b2fg = []
var s1fb = require('../../roll/s1fb.js').s1fb;
var s1fp = require('../../roll/s1fp.js').s1fp;
var s1fg = require('../../roll/s1fg.js').s1fg;
var s2fb = require('../../roll/s2fb.js').s2fb;
var s2fp = require('../../roll/s2fp.js').s2fp;
var s2fg = require('../../roll/s2fg.js').s2fg;
var i1fb = require('../../roll/i1fb.js').i1fb;
var i1fp = require('../../roll/i1fp.js').i1fp;
var i1fg = require('../../roll/i1fg.js').i1fg;
var i2fb = require('../../roll/i2fb.js').i2fb;
var i2fp = require('../../roll/i2fp.js').i2fp;
var i2fg = require('../../roll/i2fg.js').i2fg;
var hero1 = require('../../roll/hero1.js').hero1;
var hero2 = require('../../roll/hero2.js').hero2;
var gachalist = require('../../roll/gachalist.js').gachalist
var urlencode = require('urlencode');
const Keyv = require('keyv');
require('@keyv/mysql')
require('@keyv/mongo')
const Canvas = require('canvas');
var fs = require('fs');

const xy = [ [ 0, 0 ], [ 105, 0 ], [ 210, 0 ], [ 315, 0 ], [ 420, 0 ], [ 0, 105 ], [ 105, 105 ], [ 210, 105 ], [ 315, 105 ], [ 420, 105 ] ]






class RanRoll extends commando.Command {
    constructor(client) {
        super(client, {
            	name: 'roll',
		aliases: ['pull', 'gacha', 'draw'],
            	group: 'roll',
            	memberName: 'roll',
            	description: 'gacha stimulator',
		examples: ['&roll'],
		args: [{
		    key: 'text',
			prompt: 'What pool do you want to pull from?',
		    type: 'string',
		default: "default"
		}]
        });
    }

    async run(message, { text }) {
	    	const user = new Keyv(process.env.MONGODB_URI, { namespace: 'user' });
	    user.on('error', err => console.error('Keyv connection error:', err));
	    const lastroll = new Keyv(process.env.MONGODB_URI, { namespace: 'lastroll' });
	    lastroll.on('error', err => console.error('Keyv connection error:', err));
      var uuser = await user.get(message.author.id)
      var lr = []
      if (uuser == undefined) {uuser = [150, 10, 33]}
	    var usc = uuser[0]
	    var upp = uuser[1]
	    var upb = uuser[2]
		var pool = text.toLowerCase();
		var r10 = false;
	    var scu = 5;
		if (pool == "10" || pool == "10x" || pool == "x10") {
			r10 = true;
			pool = "default"
			scu = 50;
		}
		else if (pool.substr(pool.length - 2) == "10") {
			r10 = true;
			pool = pool.slice(0, -2).trim()
			scu = 50;
		}
	    	else if (pool.substr(pool.length - 3) == "x10" || pool.substr(pool.length - 3) == "10x") {
			r10 = true;
			pool = pool.slice(0, -3).trim()
			scu = 50
		}
		var embed = new Discord.RichEmbed()
		const canvas = Canvas.createCanvas(525, 210);
		const ctx = canvas.getContext('2d');
		if (pool == "event" || pool == "ev") { scu = scu * 4 / 5}
		if (usc < scu) {message.reply("You need " + scu + " SC\nYou only have " + usc + " SC")}
		else if (pool == "default") {
			usc = usc - scu;
			embed.setTitle("Gacha Roll Result")
			gacha(message, embed, user, lastroll, canvas, ctx, black, plat, gold, sil, [], [], [], r10, upb, upp, usc)
		}
	    	else if (pool == "event" || pool == "ev") {
			usc = usc - scu;
			embed.setTitle("Event Gacha Roll Result")
			gacha(message, embed, user, lastroll, canvas, ctx, eventblack, eventplat, eventgold, sil, [], [], [], r10, upb, upp, usc)
		}
	    	else if (pool == "imperial" || pool == "white empire" || pool == "we") {
		    	usc = usc - scu;
			embed.setTitle("Imperial Gacha Roll Result")
			gacha(message, embed, user, lastroll, canvas, ctx, iblack, iplat, igold, isil, [], [], [], r10, upb, upp, usc)
		}
		else if (pool == "pug" || pool == "pick-up" || pool == "pickup") {
			if (gachalist["pugopen"] == true) {
				usc = usc - scu;
				embed.setTitle("Pick-Up Gacha Roll Result")
				if (pugplat.length > 0) {
					gacha(message, embed, user, lastroll, canvas, ctx, pugblack, pugplat, gold, sil, [], [], [], r10, upb, upp, usc)
				}
				else {
					gacha(message, embed, user, lastroll, canvas, ctx, pugblack, plat, gold, sil, [], [], [], r10, upb, upp, usc)
				}
			}
			else {message.channel.send("PUG is not available")}
		}
		else if (pool == "banner 1" || pool == "b1" || pool == "banner1" || pool == "preminum 1") {
			if (gachalist["b1open"] == true) {
				usc = usc - scu;
				embed.setTitle("Banner 1 Gacha Roll Result")
				gacha(message, embed, user, lastroll, canvas, ctx, bannerblack, bannerplat, bannergold, bannersil, b1fb, b1fp, b1fg, r10, upb, upp, usc)
			}
			else {message.channel.send("Banner 1 is not available")}
		}
	    	else if (pool == "banner 2" || pool == "b2" || pool == "banner2" || pool == "preminum 2") {
			if (gachalist["b2open"] == true) {
				usc = usc - scu;
				embed.setTitle("Banner 2 Gacha Roll Result")
				gacha(message, embed, user, lastroll, canvas, ctx, bannerblack, bannerplat, bannergold, bannersil, b2fb, b2fp, b2fg, r10, upb, upp, usc)
			}
			else {message.channel.send("Banner 2 is not available")}
		}
	    	else if (pool == "seasonal 1" || pool == "seasonal1" || pool == "s1") {
			if (gachalist["s1open"] == true) {
				usc = usc - scu;
				embed.setTitle("Seasonal 1 Gacha Roll Result")
				gacha(message, embed, user, lastroll, canvas, ctx, bannerblack, bannerplat, bannergold, bannersil, s1fb, s1fp, s1fg, r10, upb, upp, usc)
			}
			else {message.channel.send("Seasonal 1 is not available")}
		}
		else if (pool == "seasonal 2" || pool == "seasonal2" || pool == "s2") {
			if (gachalist["s2open"] == true) {
				usc = usc - scu;
				embed.setTitle("Seasonal 2 Gacha Roll Result")
				gacha(message, embed, user, lastroll, canvas, ctx, bannerblack, bannerplat, bannergold, bannersil, s2fb, s2fp, s2fg, r10, upb, upp, usc)
			}
			else {message.channel.send("Seasonal 2 is not available")}
		}
	    	else if (pool == "imperial 1" || pool == "imperial1" || pool == "i1" || pool == "we1") {
			if (gachalist["i1open"] == true) {
				usc = usc - scu;
				embed.setTitle("Seasonal 1 Gacha Roll Result")
				gacha(message, embed, user, lastroll, canvas, ctx, iblack, iplat, igold, isil, i1fb, i1fp, i1fg, r10, upb, upp, usc)
			}
			else {message.channel.send("Imperial 1 is not available")}
		}
	    	else if (pool == "imperial 2" || pool == "imperial2" || pool == "i2" || pool == "we2") {
			if (gachalist["i1open"] == true) {
				usc = usc - scu;
				embed.setTitle("Imperial 2 Gacha Roll Result")
				gacha(message, embed, user, lastroll, canvas, ctx, iblack, iplat, igold, isil, i2fb, i2fp, i2fg, r10, upb, upp, usc)
			}
			else {message.channel.send("Imperial 2 is not available")}
		}
	    else if (pool == "hero 1" || pool == "hero1" || pool == "h1") {
			if (gachalist["h1open"] == true) {
				usc = usc - scu;
				embed.setTitle("Hero 1 Gacha Roll Result")
				var bl = bannerblack.concat(hero1, hero2)
				gacha(message, embed, user, lastroll, canvas, ctx, bl, bannerplat, bannergold, bannersil, hero1, [], [], r10, upb, upp, usc)
			}
			else {message.channel.send("Hero 1 is not available")}
		}
		else if (pool == "hero 2" || pool == "hero2" || pool == "h2") {
			if (gachalist["h2open"] == true) {
				usc = usc - scu;
				embed.setTitle("Hero 2 Gacha Roll Result")
				var bl = bannerblack.concat(hero1, hero2)
				gacha(message, embed, user, lastroll, canvas, ctx, bl, bannerplat, bannergold, bannersil, hero2, [], [], r10, upb, upp, usc)
			}
			else {message.channel.send("Hero 2 is not available")}
		}
		else {
			message.channel.send("Wrong Input")
		}
	}
}
async function send10(message, lr, embed, ind, canvas, ctx) {
	if (ind < 10) {
		var unit = lr[ind]
		console.log(unit)
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
				var options = {
					uri: img,
					method: "get",
					encoding: null
				};
				request(options, function (error, response, body) {
					if (error) {
					} 
					else {
						var img = new Canvas.Image();
						img.src = body;
						ctx.drawImage(img, xy[ind][0], xy[ind][1])
						send10(message, lr, embed, ind + 1, canvas, ctx)
					}
				})
			}
		})
	}
	else {
		const attachment = new Discord.Attachment(canvas.toBuffer(), 'unknown.png');
		embed.attachFile(attachment)
		embed.setImage('attachment://unknown.png');
		message.channel.send(embed);
	}
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
async function gacha(message, embed, user, lastroll, canvas, ctx, black, plat, gold, sil, fblack, fplat, fgold, r10, upb, upp, usc) {
	lr = []
	if (!r10) {
		if (upb == 1) {
			var fea = random.int(1, 10 + 7*fblack.length)
				if (fea < 11) {
					var ind = random.int(1, black.length) - 1
					var unit = black[ind]
				}
				else {
					var ind = random.int(1, fblack.length) - 1
					var unit = fblack[ind]
				}
			embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*) (Pity Black)")
			embed.setColor([95, 64, 0])
			if (upp > 1) { upp = upp -1}
			upb = 33
		}
		else if (upp == 1) {
			var rar = random.int(1, 100)
			if (rar < 4) {
				var fea = random.int(1, 10 + 7*fblack.length)
				if (fea < 11) {
					var ind = random.int(1, black.length) - 1
					var unit = black[ind]
				}
				else {
					var ind = random.int(1, fblack.length) - 1
					var unit = fblack[ind]
				}
				embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*)")
				embed.setColor([95, 64, 0])
				if (upp > 1) { upp = upp -1}
				upb = 33
			}
			else {
				var fea = random.int(1, 10 + 7*fplat.length)
				if (fea < 11) {
					var ind = random.int(1, plat.length) - 1
					var unit = plat[ind]
				}
				else {
					var ind = random.int(1, fplat.length) - 1
					var unit = fplat[ind]
				}
				embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (5*) (Pity Plat)")
				embed.setColor('GREEN')
				upp = 10
				upb = upb - 1;
			}
		}
		else {
			var rar = random.int(1, 100)
			if (rar < 4) {
				var fea = random.int(1, 10 + 7*fblack.length)
				if (fea < 11) {
					var ind = random.int(1, black.length) - 1
					var unit = black[ind]
				}
				else {
					var ind = random.int(1, fblack.length) - 1
					var unit = fblack[ind]
				}
				embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*)")
				embed.setColor([95, 64, 0])
				if (upp > 1) { upp = upp -1}
				upb = 33
			}
			else if (rar < 14) {
				var fea = random.int(1, 10 + 7*fplat.length)
				if (fea < 11) {
					var ind = random.int(1, plat.length) - 1
					var unit = plat[ind]
				}
				else {
					var ind = random.int(1, fplat.length) - 1
					var unit = fplat[ind]
				}
				embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (5*)")
				embed.setColor('GREEN')
				upp = 10
				upb = upb - 1;
			}
			else if (rar < 64) {
				var fea = random.int(1, 10 + 7*fgold.length)
				if (fea < 11) {
					var ind = random.int(1, gold.length) - 1
					var unit = gold[ind]
				}
				else {
					var ind = random.int(1, fgold.length) - 1
					var unit = fgold[ind]
				}
				embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (4*)")
				embed.setColor('GOLD')
				upb = upb - 1;
				upp = upp -1;
			}
			else {
				var ind = random.int(1, sil.length) - 1
				var unit = sil[ind]
				embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (3*)")
				embed.setColor('WHITE')
				upb = upb - 1;
				upp = upp -1;
			}
		}
		lr.push(unit)
		embed.setFooter('Pity Plat: ' + upp + ' Pity Black: ' + upb + "\nYou have " + usc + " SC left")
		send1(message, unit, embed)
	}
	if (r10) {
		embed.setColor([95, 64, 0])
		var rar 
		embed.setDescription("<@" + message.author.id + "> You rolled ")
		for (var i = 1; i < 11; i++) {
			if (upb == 1) {
				var fea = random.int(1, 10 + 7*fblack.length)
					if (fea < 11) {
						var ind = random.int(1, black.length) - 1
						var unit = black[ind]
					}
					else {
						var ind = random.int(1, fblack.length) - 1
						var unit = fblack[ind]
					}
				embed.addField("Roll " + i, unit + " (6*) (Pity)", true)
				if (upp > 1) { upp = upp -1}
				upb = 33
			}
			else if (upp == 1) {
				var rar = random.int(1, 100)
				if (rar < 4) {
					var fea = random.int(1, 10 + 7*fblack.length)
					if (fea < 11) {
						var ind = random.int(1, black.length) - 1
						var unit = black[ind]
					}
					else {
						var ind = random.int(1, fblack.length) - 1
						var unit = fblack[ind]
					}
					embed.addField("Roll " + i, unit + " (6*)", true)
					if (upp > 1) { upp = upp -1}
					upb = 33
				}
				else {
					var fea = random.int(1, 10 + 7*fplat.length)
					if (fea < 11) {
						var ind = random.int(1, plat.length) - 1
						var unit = plat[ind]
					}
					else {
						var ind = random.int(1, fplat.length) - 1
						var unit = fplat[ind]
					}
					embed.addField("Roll " + i, unit + " (5*) (Pity)", true)
					upp = 10
					upb = upb - 1;
				}
			}
			else {
				rar = random.int(1, 100)
				if (rar < 4) {
					var fea = random.int(1, 10 + 7*fblack.length)
					if (fea < 11) {
						var ind = random.int(1, black.length) - 1
						var unit = black[ind]
					}
					else {
						var ind = random.int(1, fblack.length) - 1
						var unit = fblack[ind]
					}
					embed.addField("Roll " + i, unit + " (6*)", true)
					if (upp > 1) { upp = upp -1}
				upb = 33
				}
				else if (rar < 14) {
					var fea = random.int(1, 10 + 7*fplat.length)
					if (fea < 11) {
						var ind = random.int(1, plat.length) - 1
						var unit = plat[ind]
					}
					else {
						var ind = random.int(1, fplat.length) - 1
						var unit = fplat[ind]
					}
					embed.addField("Roll " + i, unit + " (5*)", true)
					upp = 10
				upb = upb - 1;
				}
				else if (rar < 64) {
					var fea = random.int(1, 10 + 7*fgold.length)
					if (fea < 11) {
						var ind = random.int(1, gold.length) - 1
						var unit = gold[ind]
					}
					else {
						var ind = random.int(1, fgold.length) - 1
						var unit = fgold[ind]
					}
					embed.addField("Roll " + i, unit + " (4*)", true)
					upb = upb - 1;
				upp = upp -1;
				}
				else {
					var ind = random.int(1, sil.length) - 1
					var unit = sil[ind]
					embed.addField("Roll " + i, unit + " (3*)", true)
					upb = upb - 1;
				upp = upp -1;
				}
			}
			lr.push(unit)
		}
		embed.setFooter('Pity Plat: ' + upp + ' Pity Black: ' + upb + "\nYou have " + usc + " SC left");
		send10(message, lr, embed, 0, canvas, ctx)
	}
	if (lr.length == 0) {
		lr = await lastroll.get(message.author.id)
	}
	uuser = [usc, upp, upb]
	await user.set(message.author.id, uuser)
	await lastroll.set(message.author.id, lr)
}
module.exports = RanRoll;

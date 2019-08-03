const commando = require('discord.js-commando');
const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
var he = require('he');
const random = require('random')
var black = require('../../library/black.js').black;
var plat = require('../../library/plat.js').plat;
var gold = require('../../library/gold.js').gold;
var sil = require('../../library/sil.js').sil;
var iblack = require('../../library/iblack.js').iblack;
var iplat = require('../../library/iplat.js').iplat;
var igold = require('../../library/igold.js').igold;
var isil = require('../../library/isil.js').isil;
var pugblack = require('../../library/pugblack.js').pugblack;
var pugplat = require('../../library/pugplat.js').pugplat;
var bannerblack = require('../../library/bannerblack.js').bannerblack;
var bannerplat = require('../../library/bannerplat.js').bannerplat;
var bannergold = require('../../library/bannergold.js').bannergold;
var bannersil = require('../../library/bannersil.js').bannersil;
var urlencode = require('urlencode');
const Keyv = require('keyv');
require('@keyv/mysql')
require('@keyv/mongo')





var b1fb = ['Sousou' , 'Ryofu'];
var b1fp = ['Bachou'];
var b1fg = [];
var b2fb = ['Dina' , 'Miyabi'];
var b2fp = ['Shelt'];
var b2fg = [];


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
		if (usc < scu) {message.reply("You need " + scu + " SC\nYou only have " + usc + " SC")}
		else if (pool == "default") {
			usc = usc - scu;
			embed.setTitle("Gacha Roll Result")
			if (!r10) {
				if (upb == 1) {
					var ind = random.int(1, size_dict(black))
					var unit = black[ind]
					embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*) (Pity Black)")
					embed.setColor([95, 64, 0])
					if (upp > 1) { upp = upp -1}
					upb = 33
				}
				else if (upp == 1) {
					var rar = random.int(1, 100)
					if (rar < 4) {
						var ind = random.int(1, size_dict(black))
						var unit = black[ind]
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*)")
						embed.setColor([95, 64, 0])
						if (upp > 1) { upp = upp -1}
						upb = 33
					}
					else {
						var ind = random.int(1, size_dict(plat))
						var unit = plat[ind]
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (5*) (Pity Plat)")
						embed.setColor('GREEN')
						upp = 10
						upb = upb - 1;
					}
				}
				else {
					var rar = random.int(1, 100)
					if (rar < 4) {
						var ind = random.int(1, size_dict(black))
						var unit = black[ind]
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*)")
						embed.setColor([95, 64, 0])
						if (upp > 1) { upp = upp -1}
						upb = 33
					}
					else if (rar < 14) {
						var ind = random.int(1, size_dict(plat))
						var unit = plat[ind]
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (5*)")
						embed.setColor('GREEN')
						upp = 10
						upb = upb - 1;
					}
					else if (rar < 64) {
						var ind = random.int(1, size_dict(gold))
						var unit = gold[ind]
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (4*)")
						embed.setColor('GOLD')
						upb = upb - 1;
						upp = upp -1;
					}
					else {
						var ind = random.int(1, size_dict(sil))
						var unit = sil[ind]
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (3*)")
						embed.setColor('WHITE')
						upb = upb - 1;
						upp = upp -1;
					}
				}
				lr.push(unit)
				var img
				var link = "https://aigis.fandom.com/wiki/File:" + urlencode(unit) + "_Icon.png";
				request(link, function(err, resp, html) {
					if (!err) {
						const $ = cheerio.load(html);
						img = $('.fullImageLink a').attr('href')
						embed.setImage(img)
						embed.setFooter('Pity Plat: ' + upp + ' Pity Black: ' + upb + "\nYou have " + usc + " SC left");
						message.channel.send(embed)
					}
				})
				
			}
			if (r10) {
				embed.setColor([95, 64, 0])
				var rar 
				embed.setDescription("<@" + message.author.id + "> You rolled ")
				for (var i = 1; i < 11; i++) {
					if (upb == 1) {
						var ind = random.int(1, size_dict(black))
						var unit = black[ind]
						embed.addField("Roll " + i, unit + " (6*) (Pity)", true)
						if (upp > 1) { upp = upp -1}
						upb = 33
					}
					else if (upp == 1) {
						var rar = random.int(1, 100)
						if (rar < 4) {
							var ind = random.int(1, size_dict(black))
							var unit = black[ind]
							embed.addField("Roll " + i, unit + " (6*)", true)
							if (upp > 1) { upp = upp -1}
							upb = 33
						}
						else {
							var ind = random.int(1, size_dict(plat))
							var unit = plat[ind]
							embed.addField("Roll " + i, unit + " (5*) (Pity)", true)
							upp = 10
							upb = upb - 1;
						}
					}
					else {
						rar = random.int(1, 100)
						if (rar < 4) {
							var ind = random.int(1, size_dict(black))
							var unit = black[ind]
							embed.addField("Roll " + i, unit + " (6*)", true)
							if (upp > 1) { upp = upp -1}
						upb = 33
						}
						else if (rar < 14) {
							var ind = random.int(1, size_dict(plat))
							var unit = plat[ind]
							embed.addField("Roll " + i, unit + " (5*)", true)
							upp = 10
						upb = upb - 1;
						}
						else if (rar < 64) {
							var ind = random.int(1, size_dict(gold))
							var unit = gold[ind]
							embed.addField("Roll " + i, unit + " (4*)", true)
							upb = upb - 1;
							upp = upp -1;
						}
						else {
							var ind = random.int(1, size_dict(sil))
							var unit = sil[ind]
							embed.addField("Roll " + i, unit + " (3*)", true)
							upb = upb - 1;
							upp = upp -1;
						}
					}
					lr.push(unit)
				}
				embed.setFooter('Pity Plat: ' + upp + ' Pity Black: ' + upb + "\nYou have " + usc + " SC left");
				message.channel.send(embed)
			}
		}
	    else if (pool == "imperial" || pool == "white empire") {
		    usc = usc - scu;
			embed.setTitle("Imperial Gacha Roll Result")
			if (!r10) {
				if (upb == 1) {
					var ind = random.int(1, size_dict(iblack))
					var unit = iblack[ind]
					embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*) (Pity Black)")
					embed.setColor([95, 64, 0])
					if (upp > 1) { upp = upp -1}
					upb = 33
					lr.push(unit)
				}
				else if (upp == 1) {
					var rar = random.int(1, 100)
					if (rar < 4) {
						var ind = random.int(1, size_dict(iblack))
						var unit = iblack[ind]
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*)")
						embed.setColor([95, 64, 0])
						if (upp > 1) { upp = upp -1}
						upb = 33
					}
					else {
						var ind = random.int(1, size_dict(iplat))
						var unit = iplat[ind]
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (5*) (Pity Plat)")
						embed.setColor('GREEN')
						upp = 10
						upb = upb - 1;
					}
				}
				else {
					var rar = random.int(1, 100)
					if (rar < 4) {
						var ind = random.int(1, size_dict(iblack))
						var unit = iblack[ind]
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*)")
						embed.setColor([95, 64, 0])
						if (upp > 1) { upp = upp -1}
						upb = 33
					}
					else if (rar < 14) {
						var ind = random.int(1, size_dict(iplat))
						var unit = iplat[ind]
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (5*)")
						embed.setColor('GREEN')
						upp = 10
						upb = upb - 1;
					}
					else if (rar < 64) {
						var ind = random.int(1, size_dict(igold))
						var unit = igold[ind]
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (4*)")
						embed.setColor('GOLD')
						upb = upb - 1;
						upp = upp -1;
					}
					else {
						var ind = random.int(1, size_dict(isil))
						var unit = isil[ind]
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (3*)")
						embed.setColor('WHITE')
						upb = upb - 1;
						upp = upp -1;
					}
				}
				lr.push(unit)
				var img
				var link = "https://aigis.fandom.com/wiki/File:" + urlencode(unit) + "_Icon.png";
				request(link, function(err, resp, html) {
					if (!err) {
						const $ = cheerio.load(html);
						img = $('.fullImageLink a').attr('href')
						embed.setImage(img)
						embed.setFooter('Pity Plat: ' + upp + ' Pity Black: ' + upb + "\nYou have " + usc + " SC left");
						message.channel.send(embed)
					}
				})
			}
			if (r10) {
				embed.setColor([95, 64, 0])
				var rar 
				embed.setDescription("<@" + message.author.id + "> You rolled ")
				for (var i = 1; i < 11; i++) {
					if (upb == 1) {
						var ind = random.int(1, size_dict(iblack))
							var unit = iblack[ind]
						embed.addField("Roll " + i, unit + " (6*) (Pity)", true)
						if (upp > 1) { upp = upp -1}
						upb = 33
					}
					else if (upp == 1) {
						var rar = random.int(1, 100)
						if (rar < 4) {
							var ind = random.int(1, size_dict(iblack))
							var unit = iblack[ind]
							embed.addField("Roll " + i, unit + " (6*)", true)
							if (upp > 1) { upp = upp -1}
							upb = 33
						}
						else {
							var ind = random.int(1, size_dict(iplat))
							var unit = iplat[ind]
							embed.addField("Roll " + i, unit + " (5*) (Pity)", true)
							upp = 10
							upb = upb - 1;
						}
					}
					else {
						rar = random.int(1, 100)
						if (rar < 4) {
							var ind = random.int(1, size_dict(iblack))
							var unit = iblack[ind]
							embed.addField("Roll " + i, unit + " (6*)", true)
							if (upp > 1) { upp = upp -1}
						upb = 33
						}
						else if (rar < 14) {
							var ind = random.int(1, size_dict(iplat))
							var unit = iplat[ind]
							embed.addField("Roll " + i, unit + " (5*)", true)
							upp = 10
						upb = upb - 1;
						}
						else if (rar < 64) {
							var ind = random.int(1, size_dict(igold))
							var unit = igold[ind]
							embed.addField("Roll " + i, unit + " (4*)", true)
							upb = upb - 1;
						upp = upp -1;
						}
						else {
							var ind = random.int(1, size_dict(isil))
							var unit = isil[ind]
							embed.addField("Roll " + i, unit + " (3*)", true)
							upb = upb - 1;
						upp = upp -1;
						}
					}
					lr.push(unit)
				}
				embed.setFooter('Pity Plat: ' + upp + ' Pity Black: ' + upb + "\nYou have " + usc + " SC left");
				message.channel.send(embed)
			}
		}
		else if (pool == "pug" || pool == "pick-up" || pool == "pickup") {
			usc = usc - scu;
			embed.setTitle("Pick-Up Gacha Roll Result")
			if (!r10) {
				if (upb == 1) {
					var ind = random.int(1, size_dict(pugblack))
						var unit = pugblack[ind]
					embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*) (Pity Black)")
					embed.setColor([95, 64, 0])
					if (upp > 1) { upp = upp -1}
					upb = 33
				}
				else if (upp == 1) {
					var rar = random.int(1, 100)
					if (rar < 4) {
						var ind = random.int(1, size_dict(pugblack))
						var unit = pugblack[ind]
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*)")
						embed.setColor([95, 64, 0])
						if (upp > 1) { upp = upp -1}
						upb = 33
					}
					else {
						var ind = random.int(1, size_dict(pugplat))
						var unit = pugplat[ind]
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (5*) (Pity Plat)")
						embed.setColor('GREEN')
						upp = 10
						upb = upb - 1;
					}
				}
				else {
					var rar = random.int(1, 100)
					if (rar < 4) {
						var ind = random.int(1, size_dict(pugblack))
						var unit = pugblack[ind]
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*)")
						embed.setColor([95, 64, 0])
						if (upp > 1) { upp = upp -1}
						upb = 33
					}
					else if (rar < 14) {
						var ind = random.int(1, size_dict(pugplat))
						var unit = pugplat[ind]
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (5*)")
						embed.setColor('GREEN')
						upp = 10
						upb = upb - 1;
					}
					else if (rar < 64) {
						var ind = random.int(1, size_dict(gold))
						var unit = gold[ind]
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (4*)")
						embed.setColor('GOLD')
						upb = upb - 1;
						upp = upp -1;
					}
					else {
						var ind = random.int(1, size_dict(sil))
						var unit = sil[ind]
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (3*)")
						embed.setColor('WHITE')
						upb = upb - 1;
						upp = upp -1;
					}
				}
				lr.push(unit)
				var img
				var link = "https://aigis.fandom.com/wiki/File:" + urlencode(unit) + "_Icon.png";
				request(link, function(err, resp, html) {
					if (!err) {
						const $ = cheerio.load(html);
						img = $('.fullImageLink a').attr('href')
						embed.setImage(img)
						embed.setFooter('Pity Plat: ' + upp + ' Pity Black: ' + upb + "\nYou have " + usc + " SC left");
						message.channel.send(embed)
					}
				})
			}
			if (r10) {
				embed.setColor([95, 64, 0])
				var rar 
				embed.setDescription("<@" + message.author.id + "> You rolled ")
				for (var i = 1; i < 11; i++) {
					if (upb == 1) {
						var ind = random.int(1, size_dict(pugblack))
							var unit = pugblack[ind]
						embed.addField("Roll " + i, unit + " (6*) (Pity)", true)
						if (upp > 1) { upp = upp -1}
						upb = 33
					}
					else if (upp == 1) {
						var rar = random.int(1, 100)
						if (rar < 4) {
							var ind = random.int(1, size_dict(pugblack))
							var unit = pugblack[ind]
							embed.addField("Roll " + i, unit + " (6*)", true)
							if (upp > 1) { upp = upp -1}
							upb = 33
						}
						else {
							var ind = random.int(1, size_dict(pugplat))
							var unit = pugplat[ind]
							embed.addField("Roll " + i, unit + " (5*) (Pity)", true)
							upp = 10
							upb = upb - 1;
						}
					}
					else {
						rar = random.int(1, 100)
						if (rar < 4) {
							var ind = random.int(1, size_dict(pugblack))
							var unit = pugblack[ind]
							embed.addField("Roll " + i, unit + " (6*)", true)
							if (upp > 1) { upp = upp -1}
						upb = 33
						}
						else if (rar < 14) {
							var ind = random.int(1, size_dict(pugplat))
							var unit = pugplat[ind]
							embed.addField("Roll " + i, unit + " (5*)", true)
							upp = 10
						upb = upb - 1;
						}
						else if (rar < 64) {
							var ind = random.int(1, size_dict(gold))
							var unit = gold[ind]
							embed.addField("Roll " + i, unit + " (4*)", true)
							upb = upb - 1;
						upp = upp -1;
						}
						else {
							var ind = random.int(1, size_dict(sil))
							var unit = sil[ind]
							embed.addField("Roll " + i, unit + " (3*)", true)
							upb = upb - 1;
							upp = upp -1;
						}
					}
					lr.push(unit)
				}
				embed.setFooter('Pity Plat: ' + upp + ' Pity Black: ' + upb + "\nYou have " + usc + " SC left");
				message.channel.send(embed)
			}
		}
		else if (pool == "banner 1" || pool == "b1" || pool == "banner1" || pool == "preminum 1") {
			usc = usc - scu;
			embed.setTitle("Banner 1 Gacha Roll Result")
			if (!r10) {
				if (upb == 1) {
					var fea = random.int(1, 10 + 7*b1fb.length)
						if (fea < 11) {
							var ind = random.int(1, size_dict(bannerblack))
							var unit = bannerblack[ind]
						}
						else {
							var ind = random.int(1, b1fb.length) - 1
							var unit = b1fb[ind]
						}
					embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*) (Pity Black)")
					embed.setColor([95, 64, 0])
					if (upp > 1) { upp = upp -1}
					upb = 33
				}
				else if (upp == 1) {
					var rar = random.int(1, 100)
					if (rar < 4) {
						var fea = random.int(1, 10 + 7*b1fb.length)
						if (fea < 11) {
							var ind = random.int(1, size_dict(bannerblack))
							var unit = bannerblack[ind]
						}
						else {
							var ind = random.int(1, b1fb.length) - 1
							var unit = b1fb[ind]
						}
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*)")
						embed.setColor([95, 64, 0])
						if (upp > 1) { upp = upp -1}
						upb = 33
					}
					else {
						var fea = random.int(1, 10 + 7*b1fp.length)
						if (fea < 11) {
							var ind = random.int(1, size_dict(bannerplat))
							var unit = bannerplat[ind]
						}
						else {
							var ind = random.int(1, b1fp.length) - 1
							var unit = b1fp[ind]
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
						var fea = random.int(1, 10 + 7*b1fb.length)
						if (fea < 11) {
							var ind = random.int(1, size_dict(bannerblack))
							var unit = bannerblack[ind]
						}
						else {
							var ind = random.int(1, b1fb.length) - 1
							var unit = b1fb[ind]
						}
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*)")
						embed.setColor([95, 64, 0])
						if (upp > 1) { upp = upp -1}
						upb = 33
					}
					else if (rar < 14) {
						var fea = random.int(1, 10 + 7*b1fp.length)
						if (fea < 11) {
							var ind = random.int(1, size_dict(bannerplat))
							var unit = bannerplat[ind]
						}
						else {
							var ind = random.int(1, b1fp.length) - 1
							var unit = b1fp[ind]
						}
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (5*)")
						embed.setColor('GREEN')
						upp = 10
						upb = upb - 1;
					}
					else if (rar < 64) {
						var fea = random.int(1, 10 + 7*b1fg.length)
						if (fea < 11) {
							var ind = random.int(1, size_dict(bannergold))
							var unit = bannergold[ind]
						}
						else {
							var ind = random.int(1, b1fg.length) - 1
							var unit = b1fg[ind]
						}
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (4*)")
						embed.setColor('GOLD')
						upb = upb - 1;
						upp = upp -1;
					}
					else {
						var ind = random.int(1, size_dict(bannersil))
						var unit = bannersil[ind]
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (3*)")
						embed.setColor('WHITE')
						upb = upb - 1;
						upp = upp -1;
					}
				}
				lr.push(unit)
				var img
				var link = "https://aigis.fandom.com/wiki/File:" + urlencode(unit) + "_Icon.png";
				request(link, function(err, resp, html) {
					if (!err) {
						const $ = cheerio.load(html);
						img = $('.fullImageLink a').attr('href')
						embed.setImage(img)
						embed.setFooter('Pity Plat: ' + upp + ' Pity Black: ' + upb + "\nYou have " + usc + " SC left");
						message.channel.send(embed)
					}
				})
			}
			if (r10) {
				embed.setColor([95, 64, 0])
				var rar 
				embed.setDescription("<@" + message.author.id + "> You rolled ")
				for (var i = 1; i < 11; i++) {
					if (upb == 1) {
						var fea = random.int(1, 10 + 7*b1fb.length)
							if (fea < 11) {
								var ind = random.int(1, size_dict(bannerblack))
								var unit = bannerblack[ind]
							}
							else {
								var ind = random.int(1, b1fb.length) - 1
								var unit = b1fb[ind]
							}
						embed.addField("Roll " + i, unit + " (6*) (Pity)", true)
						if (upp > 1) { upp = upp -1}
						upb = 33
					}
					else if (upp == 1) {
						var rar = random.int(1, 100)
						if (rar < 4) {
							var fea = random.int(1, 10 + 7*b1fb.length)
							if (fea < 11) {
								var ind = random.int(1, size_dict(bannerblack))
								var unit = bannerblack[ind]
							}
							else {
								var ind = random.int(1, b1fb.length) - 1
								var unit = b1fb[ind]
							}
							embed.addField("Roll " + i, unit + " (6*)", true)
							if (upp > 1) { upp = upp -1}
							upb = 33
						}
						else {
							var fea = random.int(1, 10 + 7*b1fp.length)
							if (fea < 11) {
								var ind = random.int(1, size_dict(bannerplat))
								var unit = bannerplat[ind]
							}
							else {
								var ind = random.int(1, b1fp.length) - 1
								var unit = b1fp[ind]
							}
							embed.addField("Roll " + i, unit + " (5*) (Pity)", true)
							upp = 10
							upb = upb - 1;
						}
					}
					else {
						rar = random.int(1, 100)
						if (rar < 4) {
							var fea = random.int(1, 10 + 7*b1fb.length)
							if (fea < 11) {
								var ind = random.int(1, size_dict(bannerblack))
								var unit = bannerblack[ind]
							}
							else {
								var ind = random.int(1, b1fb.length) - 1
								var unit = b1fb[ind]
							}
							embed.addField("Roll " + i, unit + " (6*)", true)
							if (upp > 1) { upp = upp -1}
						upb = 33
						}
						else if (rar < 14) {
							var fea = random.int(1, 10 + 7*b1fp.length)
							if (fea < 11) {
								var ind = random.int(1, size_dict(bannerplat))
								var unit = bannerplat[ind]
							}
							else {
								var ind = random.int(1, b1fp.length) - 1
								var unit = b1fp[ind]
							}
							embed.addField("Roll " + i, unit + " (5*)", true)
							upp = 10
						upb = upb - 1;
						}
						else if (rar < 64) {
							var fea = random.int(1, 10 + 7*b1fg.length)
							if (fea < 11) {
								var ind = random.int(1, size_dict(bannergold))
								var unit = bannergold[ind]
							}
							else {
								var ind = random.int(1, b1fg.length) - 1
								var unit = b1fg[ind]
							}
							embed.addField("Roll " + i, unit + " (4*)", true)
							upb = upb - 1;
						upp = upp -1;
						}
						else {
							var ind = random.int(1, size_dict(bannersil))
							var unit = bannersil[ind]
							embed.addField("Roll " + i, unit + " (3*)", true)
							upb = upb - 1;
						upp = upp -1;
						}
					}
					lr.push(unit)
				}
				embed.setFooter('Pity Plat: ' + upp + ' Pity Black: ' + upb + "\nYou have " + usc + " SC left");
				message.channel.send(embed)
			}
		}
	    else if (pool == "banner 2" || pool == "b2" || pool == "banner2" || pool == "preminum 2") {
		    usc = usc - scu;
			embed.setTitle("Banner 2 Gacha Roll Result")
			if (!r10) {
				if (upb == 1) {
					var fea = random.int(1, 10 + 7*b2fb.length)
						if (fea < 11) {
							var ind = random.int(1, size_dict(bannerblack))
							var unit = bannerblack[ind]
						}
						else {
							var ind = random.int(1, b2fb.length) - 1
							var unit = b2fb[ind]
						}
					embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*) (Pity Black)")
					embed.setColor([95, 64, 0])
					if (upp > 1) { upp = upp -1}
					upb = 33
				}
				else if (upp == 1) {
					var rar = random.int(1, 100)
					if (rar < 4) {
						var fea = random.int(1, 10 + 7*b2fb.length)
						if (fea < 11) {
							var ind = random.int(1, size_dict(bannerblack))
							var unit = bannerblack[ind]
						}
						else {
							var ind = random.int(1, b2fb.length) - 1
							var unit = b2fb[ind]
						}
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*)")
						embed.setColor([95, 64, 0])
						if (upp > 1) { upp = upp -1}
						upb = 33
					}
					else {
						var fea = random.int(1, 10 + 7*b2fp.length)
						if (fea < 11) {
							var ind = random.int(1, size_dict(bannerplat))
							var unit = bannerplat[ind]
						}
						else {
							var ind = random.int(1, b2fp.length) - 1
							var unit = b2fp[ind]
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
						var fea = random.int(1, 10 + 7*b2fb.length)
						if (fea < 11) {
							var ind = random.int(1, size_dict(bannerblack))
							var unit = bannerblack[ind]
						}
						else {
							var ind = random.int(1, b2fb.length) - 1
							var unit = b2fb[ind]
						}
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (6*)")
						embed.setColor([95, 64, 0])
						if (upp > 1) { upp = upp -1}
						upb = 33
					}
					else if (rar < 14) {
						var fea = random.int(1, 10 + 7*b2fp.length)
						if (fea < 11) {
							var ind = random.int(1, size_dict(bannerplat))
							var unit = bannerplat[ind]
						}
						else {
							var ind = random.int(1, b2fp.length) - 1
							var unit = b2fp[ind]
						}
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (5*)")
						embed.setColor('GREEN')
						upp = 10
						upb = upb - 1;
					}
					else if (rar < 64) {
						var fea = random.int(1, 10 + 7*b2fg.length)
						if (fea < 11) {
							var ind = random.int(1, size_dict(bannergold))
							var unit = bannergold[ind]
						}
						else {
							var ind = random.int(1, b2fg.length) - 1
							var unit = b2fg[ind]
						}
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (4*)")
						embed.setColor('GOLD')
						upb = upb - 1;
						upp = upp -1;
					}
					else {
						var ind = random.int(1, size_dict(bannersil))
						var unit = bannersil[ind]
						embed.setDescription("<@" + message.author.id + "> You rolled " + unit + " (3*)")
						embed.setColor('WHITE')
						upb = upb - 1;
						upp = upp -1;
					}
				}
				lr.push(unit)
				var img
				var link = "https://aigis.fandom.com/wiki/File:" + urlencode(unit) + "_Icon.png";
				request(link, function(err, resp, html) {
					if (!err) {
						const $ = cheerio.load(html);
						img = $('.fullImageLink a').attr('href')
						embed.setImage(img)
						embed.setFooter('Pity Plat: ' + upp + ' Pity Black: ' + upb + "\nYou have " + usc + " SC left");
						message.channel.send(embed)
					}
				})
			}
			if (r10) {
				embed.setColor([95, 64, 0])
				var rar 
				embed.setDescription("<@" + message.author.id + "> You rolled ")
				for (var i = 1; i < 11; i++) {
					if (upb == 1) {
						var fea = random.int(1, 10 + 7*b2fb.length)
							if (fea < 11) {
								var ind = random.int(1, size_dict(bannerblack))
								var unit = bannerblack[ind]
							}
							else {
								var ind = random.int(1, b2fb.length) - 1
								var unit = b2fb[ind]
							}
						embed.addField("Roll " + i, unit + " (6*) (Pity)", true)
						if (upp > 1) { upp = upp -1}
						upb = 33
					}
					else if (upp == 1) {
						var rar = random.int(1, 100)
						if (rar < 4) {
							var fea = random.int(1, 10 + 7*b2fb.length)
							if (fea < 11) {
								var ind = random.int(1, size_dict(bannerblack))
								var unit = bannerblack[ind]
							}
							else {
								var ind = random.int(1, b2fb.length) - 1
								var unit = b2fb[ind]
							}
							embed.addField("Roll " + i, unit + " (6*)", true)
							if (upp > 1) { upp = upp -1}
							upb = 33
						}
						else {
							var fea = random.int(1, 10 + 7*b2fp.length)
							if (fea < 11) {
								var ind = random.int(1, size_dict(bannerplat))
								var unit = bannerplat[ind]
							}
							else {
								var ind = random.int(1, b2fp.length) - 1
								var unit = b2fp[ind]
							}
							embed.addField("Roll " + i, unit + " (5*) (Pity)", true)
							upp = 10
							upb = upb - 1;
						}
					}
					else {
						rar = random.int(1, 100)
						if (rar < 4) {
							var fea = random.int(1, 10 + 7*b2fb.length)
							if (fea < 11) {
								var ind = random.int(1, size_dict(bannerblack))
								var unit = bannerblack[ind]
							}
							else {
								var ind = random.int(1, b2fb.length) - 1
								var unit = b2fb[ind]
							}
							embed.addField("Roll " + i, unit + " (6*)", true)
							if (upp > 1) { upp = upp -1}
						upb = 33
						}
						else if (rar < 14) {
							var fea = random.int(1, 10 + 7*b2fp.length)
							if (fea < 11) {
								var ind = random.int(1, size_dict(bannerplat))
								var unit = bannerplat[ind]
							}
							else {
								var ind = random.int(1, b2fp.length) - 1
								var unit = b2fp[ind]
							}
							embed.addField("Roll " + i, unit + " (5*)", true)
							upp = 10
						upb = upb - 1;
						}
						else if (rar < 64) {
							var fea = random.int(1, 10 + 7*b2fg.length)
							if (fea < 11) {
								var ind = random.int(1, size_dict(bannergold))
								var unit = bannergold[ind]
							}
							else {
								var ind = random.int(1, b2fg.length) - 1
								var unit = b2fg[ind]
							}
							embed.addField("Roll " + i, unit + " (4*)", true)
							upb = upb - 1;
						upp = upp -1;
						}
						else {
							var ind = random.int(1, size_dict(bannersil))
							var unit = bannersil[ind]
							embed.addField("Roll " + i, unit + " (3*)", true)
							upb = upb - 1;
						upp = upp -1;
						}
					}
					lr.push(unit)
				}
				embed.setFooter('Pity Plat: ' + upp + ' Pity Black: ' + upb + "\nYou have " + usc + " SC left");
				message.channel.send(embed)
			}
		}
		else (message.channel.send("Wrong Input"))
	    uuser = [usc, upp, upb]
		await user.set(message.author.id, uuser)
		await lastroll.set(message.author.id, lr)
	}
}
function size_dict(d){
	c=0; 
	for (i in d) ++c;
	return c
}
module.exports = RanRoll;
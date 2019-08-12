const commando = require('discord.js-commando');
const Discord = require('discord.js');
const Keyv = require('keyv');
require('@keyv/mysql')
require('@keyv/mongo')
var request = require('request');
var cheerio = require('cheerio');
var urlencode = require('urlencode');



class RanRoll extends commando.Command {
    constructor(client) {
        super(client, {
            	name: 'setstate',
            	group: 'roll',
            	memberName: 'setstate',
            	description: 'set the state of your waifu (AA, AW)',
		examples: ['&setstate base']
        });
    }

    async run(message, input) {
		var state = input.toUpperCase()
		if (state == "AW2V1") {state = "AW2v1"}
	    	if (state == "AW2V2") {state = "AW2v2"}
		const waifu = new Keyv(process.env.MONGODB_URI, { namespace: 'waifu' });
	    waifu.on('error', err => console.error('Keyv connection error:', err));
		var uwaifu = await waifu.get(message.author.id)
		if (uwaifu == undefined) {
			var mes = "You haven't set your waifu."
			message.channel.send(mes)
		}
		else {
			var name
			var unit = uwaifu[0]
			if (state == "BASE") {
				name = unit
			}
			else {
				name = unit + " " + state
			}
			var link = "https://aigis.fandom.com/wiki/File:" + urlencode(name) + "_Render.png";
				request(link, function(err, resp, html) {
				if (!err) {
					const $ = cheerio.load(html);
					var img = $('.fullImageLink a').attr('href')
					if (img) {
						var embed = new Discord.RichEmbed()
						embed.setTitle(unit)
						embed.setImage(img)
						message.channel.send(embed);
						var uunit = [unit, state]
						waifu.set(message.author.id, uunit)
					}
					else {message.channel.send("Wrong state input")}
				}
			})
		}
	}
}
module.exports = RanRoll;
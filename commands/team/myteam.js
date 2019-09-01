const commando = require('discord.js-commando');
const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
const random = require('random')
var urlencode = require('urlencode');
const Keyv = require('keyv');
require('@keyv/mysql')
require('@keyv/mongo')
const Canvas = require('canvas');
var functions = require('../../functions.js');
var fs = require('fs');
const xy = [[20, 20], [132, 20], [244, 20], [356, 20], [468, 20], [20, 132], [132, 132], [244, 132], [356, 132], [468, 132], [20, 244], [132, 244], [244, 244], [356, 244], [468, 244]]

class RanRoll extends commando.Command {
    constructor(client) {
        super(client, {
            	name: 'myteam',
            	group: 'team',
            	memberName: 'myteam',
            	description: 'your team',
		examples: ['&myteam'],
		hidden: true
        });
    }

    async run(message, input) {
	    const team = new Keyv(process.env.MONGODB_URI, { namespace: 'team' });
	          team.on('error', err => console.error('Keyv connection error:', err));
            var uteam = await team.get(message.author.id)
            if (uteam == undefined) {uteam = []}
	    const canvas = Canvas.createCanvas(583, 426);
	    const ctx = canvas.getContext('2d');
      const background = await Canvas.loadImage(__dirname + '/../../image/unknown.png');
	    ctx.drawImage(background, 0, 0)
	    addimg(uteam, message, 0, canvas, ctx)
	}
}
async function addimg(uteam, message, i, canvas, ctx) {
	if (!(i < uteam.length)) {
		const attachment = new Discord.Attachment(canvas.toBuffer(), 'unknown.png');
	    message.channel.send(attachment);
	}
	var options = {
	    url: uteam[i],
	    method: "get",
	    encoding: null
	  };
	  request(options, function (error, response, body) {
	    if (error) {
	      console.error('error:', error);
	    } 
	    else {
	    var img = new Canvas.Image();
		img.src = body;
	    ctx.drawImage(img, xy[i][0], xy[i][1])
		addimg(uteam, message, i + 1, canvas, ctx)
	    }
	  })
}
module.exports = RanRoll;

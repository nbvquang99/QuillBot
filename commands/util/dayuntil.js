const commando = require('discord.js-commando');
const Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
var he = require('he');
var moment = require('moment');
var printf = require('printf');
var name = require('../../library/lib.js').name;
var suffix = require('../../library/suf.js').suffix;
require('@gouch/to-title-case')

class UtilDaily extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'dayuntil',
		aliases: ['du'],
            group: 'util2',
            memberName: 'dayuntil',
            description: 'find the number of days until the daily revival of a unit',
		examples: ['~dayuntil lin'],
        });
    }

    async run(message, input) {
        var unit = input.toLowerCase().toTitleCase();
          var np = unit.split(' ');
          var npl = np.length;
          if (npl >= 2) {
            if (suffix[np[npl-1]]) {np[npl-1] = suffix[np[npl-1]]}
            if (np[npl-1] == 'Year' && np[npl-2] == 'New') {
          np[npl-1] = 'Year\'s)';
          np[npl-2] = '(New';
        }
            if (np[npl-1] == 'Year)' && np[npl-2] == '(New') {
          np[npl-1] = 'Year\'s)';
          np[npl-2] = '(New';
        }
          }
          unit = np.join(' ')
            if (name[unit]) unit = name[unit];
        var link = "https://wikiwiki.jp/aigiszuki/"
        var link2 = "https://aigis.fandom.com/wiki/Daily_Revivals"
        var japname = {
          "魔女を救え！": "Cloris",
          "魔女の娘": "Belinda",
          "闇の忍者軍団": "Azami",
          "鬼を宿す剣士": "Momiji",
          "聖戦士の挑戦": "Maribel",
          "影の狙撃手": "Rita",
          "魔人の宿命": "Fran",
          "戦乙女の契約": "Emilia",
          "暗黒騎士団の脅威": "Yurina",
          "暗黒舞踏会": "Waltz",
          "魔術の秘法": "Odette",
          "アンナと雪の美女": "Eliza",
          "山賊王への道": "Rorone",
          "竜騎士の誓い": "Lucille",
          "錬金術士と賢者の石": "Corin",
          "モンクの修行場": "Lin",
          "聖鎚闘士の挑戦": "Miranda",
          "鬼招きの巫女": "Shiho",
          "砲科学校の訓練生": "Kanon",
          "囚われの魔法剣士": "Charlotte",
          "死霊の船と提督の決意": "Reanbell",
          "帝国の天馬騎士": "Isabelle",
          "暗黒騎士団と狙われた癒し手": "Yuno",
          "獣人の誇り": "Ada",
          "白の帝国と偽りの都市": "Lieselotte",
          "堕天使の封印": "Chloe",
          "暗黒騎士団と聖夜の贈り物": "Sarasa",
          "古代の機甲兵": "Rikka",
          "呪術師と妖魔の女王" :"Revy",
          "私掠船長と魔の海域": "Sabrina",
          "ヴァンパイアと聖なる復讐者": "Rumaria",
          "妖魔の女王と戦術の天才": "Helena",
          "魔界蟻と囚われた男達": "Jake / Oscar",
          "天使たちの陰謀": "Sereina",
          "魔蝿の森と呪われた番人": "Aida",
          "失われた竜の島": "Ignis",
          "帝国神官の帰還": "Lucia",
          "闇の組織と狙われた王子": "Seven",
          "オーク格闘家の王子軍入門": "Bestla",
          "王子軍の夏祭り": "Phyllis (Yukata)",
          "カリオペと恐怖の夜": "Calliope (Dress)",
          "夢現のダークプリースト": "Psyche",
          "魔王軍の胎動": "Linaria",
          "彷徨える守護の盾": "Saris",
          "渚に咲きし水着騎兵": "Carrie (Swimsuit)",
          "カボチャの国の魔法使い": "Candy",
          "星に祈りし聖夜の癒し手": "Camilla (Christmas)",
          "学園騎兵科の新入生": "Mischa (School)",
          "白き獣人と闇の組織": "Fluffy",
          "砂浜を駆ける魔術師": "Maya (Swimsuit)"
        }
        var unum = {
          "Cloris": 1,
          "Belinda": 2,
          "Azami": 3,
          "Momiji": 4,
          "Maribel": 5,
          "Rita": 6,
          "Fran": 7,
          "Emilia": 8,
          "Yurina": 9,
          "Waltz": 10,
          "Odette": 11,
          "Eliza": 12,
          "Rorone": 13,
          "Lucille": 14,
          "Corin": 15,
          "Lin": 16,
          "Miranda": 17,
          "Shiho": 18,
          "Kanon": 19,
          "Charlotte": 20,
          "Reanbell": 21,
          "Isabelle": 22,
          "Yuno" : 23,
          "Ada": 24,
          "Lieselotte": 25,
          "Chloe": 26,
          "Sarasa": 27,
          "Rikka": 28,
          "Revy": 29,
          "Sabrina": 30,
          "Rumaria": 31,
          "Helena": 32,
          "Jake / Oscar": 33,
          "Oscar": 33,
          "Jake": 33,
          "Sereina":34,
          "Aida": 35,
          "Ignis": 36,
          "Lucia": 37,
          "Seven": 38,
          "Bestla": 39,
          "Phyllis (Yukata)": 40,
          "Calliope (Dress)": 41,
          "Psyche": 42,
          "Linaria": 43,
          "Saris": 44,
          "Carrie (Swimsuit)": 45,
          "Candy" : 46,
          "Camilla (Christmas)": 47,
          "Mischa (School)": 48,
          "Fluffy": 49,
          "Maya (Swimsuit)": 50
        }
        if (unum[unit]){
          request(link, function(err, resp, html) {
            if (!err) {
              var now = new Date()
              var m = moment(now).add(9, 'hours')
              var mm = m.format('ddd MMM DD YYYY HH mm ss')
              var words = mm.split(' ')
              var date = words[0]
              var check = false;
              var pages = [];
              var page = 1;
              const $ = cheerio.load(html);
              var output = na($('.style_table').html())
              var tname;
              var names = output.split(' ')
              if (date == "Mon") {
                tname = names[1]
              }
              else if (date == "Tue") {
                tname = names[3]
              }
              else if (date == "Wed") {
                tname = names[5]
              }
              else if (date == "Thu") {
                tname = names[7]
              }
              else if (date == "Fri") {
                tname = names[9]
              }
              else if (date == "Sat") {
                tname = names[11]
              }
              else if (date == "Sun") {
                tname = names[13]
              }
              tname = japname[tname];
              var num1 = unum[tname];
              var num2 = unum[unit];
              if (num1 == num2) {message.channel.send('Today!')}
              else{
                if (num2 < num1) {
                  num2 = num2 + unum.length - 5
                }
                let diff = num2 - num1
                message.channel.send('Approximately ' + diff + ' day(s)' )
              }
            }
          })
        }
        else(message.channel.send('No Data'))
    }
}
function na(output) {
  output = output.replace(/<[^>]*>/g, "\n");
  output = output.replace(/\n+ /g, "\n");
  output = he.decode(output);
  output = output.trim();
  var arr = output.split('\n');
  var filtered = arr.filter(function(el) {
    return el != null && el != '';
  });
  var na = filtered[0];
  let i = 1;
  while (i < filtered.length) {
    na = na + " " + filtered[i];
    i++;
  }
  return na;
}
module.exports = UtilDaily;
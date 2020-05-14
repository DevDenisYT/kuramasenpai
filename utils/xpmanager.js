const fs = require('fs');
const index = require('../index.js');
const logger = require('./logger.js')
var xpFileRaw = fs.readFileSync('xp.json', {encoding: 'utf8', flag: 'a+'});
var xpFile = JSON.parse(xpFileRaw);
var onlineUsers = [];

function giveXP(userid, type) {
    if(type == 'text') {
        var wonxp = Math.floor(Math.random() * 20) + 1;
        var woncoins = Math.floor(Math.random() * 9) + 1;
    } else {
        var wonxp = Math.floor(Math.random() * 10) + 1;
        var woncoins = Math.floor(Math.random() * 4) + 1;
    }
    var fetchedUser = index.client.users.get(userid); 
    if(!xpFile[userid]) {
        xpFile[userid] = {
            xp: 0,
            level: 1,
            coins: 50
        }
    }
    var user = xpFile[userid];
    var nextLvL = user.level * index.config.xpvalue;
    
    user.xp += wonxp;
    user.coins += woncoins;
    

    if(nextLvL <= user.xp) {
        user.level++;

        var currentXP = user.xp;
        var currentLvL = user.level;
        nextLvL = user.level * index.config.xpvalue;
        var difference = nextLvL - currentXP;
        const embed = {
            color: 0xff0000,
            title: fetchedUser.tag,
            author: {
                name: 'KuramaXP',
                icon_url: 'http://devdenis.bplaced.net/sharingan.png'
            },
            thumbnail: {
                url: fetchedUser.avatarURL
            },
            timestamp: new Date(),
            fields:
            [
                {name: 'LevelUp!', value: 'Du bischt in 1 neuz levelz!'},
                {name: 'Level: ', value: currentLvL},
                {name: 'Coins: ', value: user.coins},
                {name: 'Erforderliche XP bis zum nächsten Level', value: difference}
            ]
        };

        if(type == 'voice') {
            embed = {
                color: 0xff0000,
                title: fetchedUser.tag,
                author: {
                    name: 'KuramaXP',
                    icon_url: 'http://devdenis.bplaced.net/sharingan.png'
                },
                thumbnail: {
                    url: fetchedUser.avatarURL
                },
                timestamp: new Date(),
                fields:
                [
                    {name: 'LevelUp!', value: 'Du bischt in 1 neuz levelz! Durch chillen im VoiceChat!'},
                    {name: 'Level: ', value: currentLvL},
                    {name: 'Coins: ', value: user.coins},
                    {name: 'Erforderliche XP bis zum nächsten Level', value: difference}
                ]
            };
        }

        index.client.channels.get(index.config.xpchannel).send({embed: embed});
        if(type == 'text') {
            logger.xplvlup(fetchedUser.tag + ' levelup! Level: ' + currentLvL);
        } else {
            logger.xplvlupVoice(fetchedUser.tag + ' levelup! Level: ' + currentLvL);
        }
    }
    if(type == 'text') {
        logger.xp(fetchedUser.tag + ' got ' + wonxp + ' xp!');
        logger.coins(fetchedUser.tag + ' got ' + woncoins + ' coins!');
    } else {
        logger.xpVoice(fetchedUser.tag + ' got ' + wonxp + ' xp!');
        logger.coinsVoice(fetchedUser.tag + ' got ' + woncoins + ' coins!');
    }

    saveFile();
}

function saveFile() {
    fs.writeFileSync('xp.json', JSON.stringify(xpFile), 'utf8', function(err) {
        if(err) logger.err('XP file saving failed! ' + err);
    });
}

function countdownVoiceXP() {
    for (let i = 0; i < onlineUsers.length; i++) {
        if(i == 0 && onlineUsers.length > 0) {
            logger.xpVoice('Online users in voice: ' + onlineUsers.length)
        }
        giveXP(onlineUsers[i], 'voice');
    }
}

exports.giveXP = giveXP;
exports.onlineUsers = onlineUsers;
exports.countdownVoiceXP = countdownVoiceXP;
exports.xpFile = xpFile;
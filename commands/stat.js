const logger = require('../utils/logger.js');
const xpManager = require('../utils/xpmanager.js')
const index = require('../index.js')
const shopManager = require('../utils/shopmanager.js')
module.exports = {
	name: 'stats',
	description: 'Zeigt dir deine Statistiken!',
	args: false,
	usage: '+stats',
	guildOnly: true,
	aliases: ['xp', 'coins'],
	needsPerm: false,
	execute(message, args) {
        var answer = 'Du musst erstmal xp bekommen um sie abzufragen!';
        if(xpManager.xpFile[message.author.id] != undefined) {
            const embed = {
                color: 0xff0000,
                title: message.author.tag,
                author: {
                    name: 'KuramaXP',
                    icon_url: 'http://devdenis.bplaced.net/sharingan.png'
                },
                thumbnail: {
                    url: message.author.avatarURL()
                },
                timestamp: new Date(),
                fields:
                [
                    {name: 'Level: ', value: xpManager.xpFile[message.author.id].level},
                    {name: 'Coins: ', value: xpManager.xpFile[message.author.id].coins},
                    {name: 'Erforderliche XP bis zum nächsten Level', value: parseInt(xpManager.getNextLvLUp(xpManager.xpFile[message.author.id]) - xpManager.xpFile[message.author.id].xp)},
                    {name: 'Items:', value: shopManager.getUserItemsAsString(message.author.id)}
                ]
            };
            answer = {embed: embed};
        }

		message.channel.send(answer);
		logger.command(message.author.username, message.toString(), answer);

	},
};
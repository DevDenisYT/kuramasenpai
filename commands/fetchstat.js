const logger = require('../utils/logger.js');
const xpManager = require('../utils/xpmanager.js')
const index = require('../index.js')
const shopManager = require('../utils/shopmanager.js');

module.exports = {
	name: 'getstat',
	description: 'Zeigt dir die Statistik eines anderen Users!',
	args: true,
	usage: '+getstat @user',
	guildOnly: true,
	aliases: ['getxp', 'getcoins'],
	needsPerm: false,
	execute(message, args) {
        var answer = 'Du musst erstmal xp bekommen um sie abzufragen!';
        var id = args[0].toString().replace('<@','').toString().replace('>','').replace('!','').toString();
        var fetchedUser = index.client.users.get(id);
        if (args.length == 1) {
            if(xpManager.xpFile[id] != undefined) {
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
                        {name: 'Level: ', value: xpManager.xpFile[id].level},
                        {name: 'Coins: ', value: xpManager.xpFile[id].coins},
                        {name: 'Erforderliche XP bis zum nächsten Level', value: ((xpManager.xpFile[id].level * index.config.xpvalue) - xpManager.xpFile[id].xp)},
                        {name: 'Items:', value: shopManager.getUserItemsAsString(id)},
                        {name: 'Angefordert von: ', value: message.author.tag}
                    ]
                };
                answer = {embed: embed};
            }

        }

		message.channel.send(answer);
		logger.command(message.author.username, message, answer);

	},
};
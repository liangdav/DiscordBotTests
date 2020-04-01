/*jshint esversion: 8 */
module.exports.run = async (bot, message, con, cfg) => {
	let target = message.member;
	let role = message.guild.roles.find(r => r.name === cfg.tempBanRole);
	if(!role) {
		console.log("The temp ban role "+cfg.tempBanRole+" doesn't exist.")
	}
	try {
    var unbanDate = new Date();
    unbanDate.setSeconds(unbanDate.getSeconds() + 15);
		if(unbanDate) {
			con.run("INSERT INTO mutes (snowflake, guild, unmutedAt) VALUES (?, ?, ?)", target.id, message.guild.id, unbanDate, (err) => {
				if(err) throw err;
			});
		}
		await target.addRole(role);
		return message.channel.send("See you in 15 seconds, <@" + message.author.id + ">!");
	} catch(e) {
    if(['DiscordAPIError: Missing Access', 'DiscordAPIError: Missing Permissions'].some(e => e == err)){
      message.channel.send(`Error: I'm not powerful enought to tempban `+message.author.id+`!`);
    }
    else{
		  message.channel.send(`Error: ${e.message}`);
    }
	}
}

module.exports.help = {
	name: "tempBanMePls"
}

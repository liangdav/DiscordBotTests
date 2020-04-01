/*jshint esversion: 8 */
module.exports.run = async (bot, message, con, cfg) => {
	let target = message.member;
	let roleNames = ['Mallards', 'Canvasbacks', 'Wood Ducks', 'Hooded Mergansers',
                  'Buffleheads', 'Northern Shovelers', 'Ring Necked Ducks',
								  'Gadwalls', 'Ruddy Shelducks', 'Call Ducks', 'Muscovies',
								  'Long Tailed Ducks']
  let roleLinks = ['https://www.allaboutbirds.org/guide/Mallard/',
                  'https://www.allaboutbirds.org/guide/Canvasback/',
									'https://www.allaboutbirds.org/guide/Wood_Duck/',
								  'https://www.allaboutbirds.org/guide/Hooded_Merganser/',
								  'https://www.allaboutbirds.org/guide/Bufflehead/',
									'https://www.allaboutbirds.org/guide/Northern_Shoveler/',
									'https://www.allaboutbirds.org/guide/Ring-necked_Duck/',
									'https://www.allaboutbirds.org/guide/Gadwall/',
									'https://www.allaboutbirds.org/guide/Ruddy_Duck/',
									'https://www.beautyofbirds.com/callducks.html/',
								  'https://www.allaboutbirds.org/guide/Muscovy_Duck/',
								  'https://www.allaboutbirds.org/guide/Long-tailed_Duck/']
	// let role = message.guild.roles.find(r => r.name === cfg.tempBanRole);
	// if(!role) {
	// 	console.log("The temp ban role "+cfg.tempBanRole+" doesn't exist.")
	// }
	try {
		const duckPeek = bot.emojis.find(emoji => emoji.name === "duckPeek");
		// Random between 1 and 598435839
		let userId = message.author.id % 100000 + 51;
		let houseAssignmentId = userId % (roleNames.length);
		let houseAssignmentRole = roleNames[houseAssignmentId];
		let houseAssignmentLink = roleLinks[houseAssignmentId];
    let role = message.guild.roles.find(r => r.name === houseAssignmentRole);
		if(message.member.roles.has(role.id)){
			message.channel.send(`You have been judged already... check your role!`);
		}
		else{

			message.channel.send(`You are now being judged by the council... `+duckPeek);
			// con.run("INSERT INTO mutes (snowflake, guild, unmutedAt) VALUES (?, ?, ?)", target.id, message.guild.id, unbanDate, (err) => {
			// 	if(err) throw err;
			// });
			message.channel.send(`<@` + message.author.id + `>, your quack identifier is `+ userId + `, which means you have been deemed a part of the `+ houseAssignmentRole+ `!\n\nCheck out your new role!`);

			message.channel.send(`You can learn more about the `+ houseAssignmentRole +` here: ` + houseAssignmentLink);

			console.log("Role: "+role)
			await message.member.addRole(role);
		}
	} catch(e) {
		  console.log(`Error: ${e.message}`);
	}
}

module.exports.help = {
	name: "judge"
}

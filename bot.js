/*jshint esversion: 8 */
const Discord = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection()

const cfg = require("./config.json");
const auth = require('./auth.json');
const con = require("./sql.js");
fs = require("fs");

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // client.channels.get("367802557286055937").send("mom I'm sleepy");
  //   client.setInterval(() => {
  //     con.all("SELECT * FROM mutes", (err, rows) => {
	// 		if(err) throw err;
  //
	// 		rows.forEach(r => {
	// 			let guild = client.guilds.get(r.guild);
	// 			if(!guild) return;
	// 			let member = guild.members.get(r.snowflake);
	// 			if(!member) return;
  //
	// 			if(Date.now() > r.unmutedAt) {
	// 				let role = member.roles.find(r => r.name === cfg.tempBanRole);
	// 				if(role) member.removeRole(role.id).catch(()=>{});
  //
	// 				con.run("DELETE FROM mutes WHERE id = ?", r.id, (err) => {
	// 					if(err) throw err;
	// 					console.log(`Unmuted ${member.id} (${r.id}).`);
	// 				});
	// 			}
	// 		});
	// 	});
	// }, 1000);   // 1000 = 1 second
});

client.login(auth.token);

client.on("ready", async () => {
  console.log("Async branch");
  client.user.setActivity("with the council", {type: "PLAYING"});
});

client.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong');
  } else {
    console.log("Message content: "+message.content);
    let name = message.content.slice(cfg.prefix.length);
    let command = client.commands.get(name);
		if(command){
      console.log("Got a command! "+command);
      command.run(client, message, con, cfg);
    }
  }
});

//Command loader
let cmds = fs.readdirSync("./commands/");
cmds = cmds.filter(cmd=>cmd.split(".").pop() === "js");

cmds.forEach(cmd => {
  console.log("Command found: "+cmd)
	let props = require(`./commands/${cmd}`);
	client.commands.set(props.help.name, props)
});

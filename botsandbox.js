/*jshint esversion: 8 */
const Discord = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection()

const cfg = require("./config.json");
const auth = require('./auth.json');
const con = require("./sql.js");
const compareUrls = require('compare-urls');
const getUrls = require('get-urls');
fs = require("fs");

function isSubset(set, subset) {
    for (let elem of subset) {
        if (!set.has(elem)) {
            return false
        }
    }
    return true
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.setInterval(() => {
      con.all("SELECT * FROM mutes", (err, rows) => {
			if(err) throw err;

			rows.forEach(r => {
				let guild = client.guilds.get(r.guild);
				if(!guild) return;
				let member = guild.members.get(r.snowflake);
				if(!member) return;

				if(Date.now() > r.unmutedAt) {
					let role = member.roles.find(r => r.name === cfg.tempBanRole);
					if(role) member.removeRole(role.id).catch(()=>{});

					con.run("DELETE FROM mutes WHERE id = ?", r.id, (err) => {
						if(err) throw err;
						console.log(`Unmuted ${member.id} (${r.id}).`);
					});
				}
			});
		});
	}, 1000);   // 1000 = 1 second
});

client.login(auth.token);

client.on("ready", async () => {
  console.log("Async branch");
  client.user.setActivity("with my master, theluigiguy", {type: "PLAYING"});
});

client.on('message', message => {
  let channel = message.channel;
  if (message.content === 'ping') {
    message.reply('pong');
  } else if (message.content === '!avatarURL') {
    // Send the user's avatar URL
    message.reply(message.author.avatarURL);
  } else {
    console.log("Message content: "+message.content);
    let name = message.content.slice(cfg.prefix.length);
    let command = client.commands.get(name);
		if(command){
      console.log("Got a command! "+command);
      command.run(client, message, con, cfg);
    }
    else{
      // Check for a link
      let urls = getUrls(message.content);
      if(urls && urls.size > 0){
        console.log("Got URLs:");
        urls.forEach(element => {
          console.log(typeof element);
        });
        // Grab the last 50 messages in the current channels
        // TODO: We should do a category search next
        channel.fetchMessages({ limit: 20 })
          .then(channel_messages => {
            console.log(channel_messages.size);
            for(let [k, v] of  channel_messages){
              if(v.id !== message.id){
                let urls2 = getUrls(v.content);
                // URLs are normaized out of getUrls
                // console.log("URLs in message: "+Array.from(urls).join(' '));
                // console.log("URLs in recent message: "+Array.from(urls2).join(' '));
                // console.log(isSubsetOf(urls, urls2));
                if(urls2.size > 0 && isSubset(urls2, urls)){
                  console.log("This was seen recently!");
                  message.delete()
                   .then(msg => console.log(`Deleted message from ${msg.author.username}`))
                   .catch(console.error);
                  message.channel.send("<deleted one message>\nWhoa, someone recently posted that link, <@" + message.author.id + ">! Scroll up and see if someone posted this next time!");
                  break;
                }
              }
            }
          }, exception => {
            console.error("Exception when fetching messages: ");
            console.error(exception);
          });
      }
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

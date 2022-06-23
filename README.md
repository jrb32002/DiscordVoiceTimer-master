# DiscordVoiceTimer-master

Welcome to the **Discord Voice Timer Bot** github! Below you can read more about the bot, like what it does, and how to set it up!

## Initial Set up

1. Head to [Discord Developer Portal](https://discord.com/developers/applications)
2. Sign into your discord account
3. If not already, go to the _**Applications**_ tab at the top left
4. Click the _**New Application**_ button
5. Enter a name for your bot
6. Goto the _**Bot**_ section
7. Click the _**Add Bot**_ button
8. Click the _**Reset Token**_ button then _**Copy Token**_ button
9. Scroll down throw the toggle switches and turn on the following:
   - Presence Intent
   - Server Members Intent
10. Add bot to server 
    - Goto _**OAuth2**_ tab
    - Click the dropdown box for _**Default Authorization Link**_
    - Click the _**bot, administrator**_ checkboxes
    - Save your changes
    - Goto _**URL Generator**_ section of _**OAuth2**_
    - Click the _**bot, administrator**_ checkboxes once again
    - Copy the generated link at the bottom of the page
    - Paste link into browser and follow prompts to add to desired server (Must be an administrator or an owner of the server)

## Downloading and starting

#### Recommended

1. Download the release from [here](https://github.com/jrb32002/DiscordVoiceTimer-master/releases)
2. Extract the files to your desired location on your computer
3. Navigate to [./src/Data/config.json](src/Data/config.json)
4. Paste your bot token you got from [Discord Developer Portal](https://discord.com/developers/applications) where it says *discord bot token*
5. Define a prefix or keep the default prefix
6. Copy an id of a channel in your discord for the call logs to go where it says *log channel id* [How do I find my channels id?](https://docs.statbot.net/docs/faq/general/how-find-id/)
7. Run [install.bat](install.bat) or your bot will not work
8. Start your bot by running the [start.bat](start.bat) file


## Commands
NOTE: All commands must have your set prefix before each command
```
settime Mmm DD YYYY HH:MM. (time is 24 hour clock) Ex. :settime Jun 23 2022 15:30
``` 
More coming soon

#### Months for settime command 
```
Jan
Feb
Mar
Apr
May
Jun
Jul
Aug
Sep
Oct
Nov
Dec
```

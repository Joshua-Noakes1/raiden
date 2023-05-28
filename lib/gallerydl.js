// starts a subprocess to use gallery-dl to download pictures if yt-dlp fails to find anything uses the json output
const { exec } = require('child_process');
const path = require('path');

async function getGalleryDL(url) {
    await exec(`gallery-dl -E -c ${path.join(__dirname, "../", "config", "gallerydl-Config.json")} -j -q ${url}`, (error, stdout, stderr) => {
        try {
            if (error) {
                console.log(`error: ${error.message}`);
                return {
                    success: false
                };
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return {
                    success: false
                };
            }

            var data = JSON.parse(stdout);
            if (JSON.stringify(data).toString().includes("gallery-dl oauth:") && JSON.stringify(data).toString().includes("AuthenticationError")) {
                // This should return the site required and ask the user to login on Discord
                console.log(`Site requires OAuth login, Run ${data[0][1].toString().split("Run ")[1]}`);
                return {
                    success: false
                }
            }
            console.log(`stdout: ${JSON.stringify(data)}`);
        } catch (err) {
            console.log(err);
            return {
                success: false
            };
        }
    });
}

getGalleryDL("https://www.pixiv.net/en/artworks/98925098");

module.exports = getGalleryDL;

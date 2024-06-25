const request = require('request');
const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "avt",
        version: "1.0",
        author: "@haohanxabo",
        countDown: 2,
        role: 0,
        shortDescription: {
            vi: "Lấy avatar từ Facebook.",
            en: "Get avatar from Facebook."
        },
        description: {
            vi: "Lấy avatar của người gửi hoặc của người dùng khác từ Facebook.",
            en: "Get avatar of the sender or another user from Facebook."
        },
        category: "box chat",
        guide: {
            vi: "Sử dụng `-avt` để lấy avatar của người gửi lệnh. Sử dụng `-avt <user_id>` để lấy avatar của người dùng có user_id. ",
            en: "Use `-avt` to get the avatar of the sender. Use `-avt <user_id>` to get the avatar of the user with user_id. "
        }
    },

    onStart: async function ({ api, args, message, event }) {
        let user_id = event.senderID; 
        if (args.length === 1) {
            user_id = args[0];
        } 
        const url = `https://graph.facebook.com/${user_id}/picture?access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662&type=large&width=1000`;
    
        request.get({ url, encoding: 'binary' }, (error, response, body) => {
            if (error) {
                console.error(`Lỗi: ${error}`);
                api.sendMessage({
                    body: "Lỗi ❌",
                }, event.threadID);
                return;
            }
    
            if (response.statusCode === 200) {
                const file_name = `${user_id}_profile.jpg`;
                const save_path = path.join(__dirname, file_name);
    
                fs.writeFile(save_path, body, 'binary', (err) => {
                    if (err) {
                        console.error(`Lỗi: ${err}`);
                        api.sendMessage({
                            body: "Lỗi ❌",
                        }, event.threadID);
                        return;
                    }
                    api.sendMessage({
                        attachment: fs.createReadStream(save_path)
                    }, event.threadID, (err) => {
                        if (err) {
                            console.error(`Lỗi: ${err}`);
                        } else {
                            console.log(`Gửi: ${user_id}`);
                        }
                        fs.unlink(save_path, (err) => {
                            if (err) {
                                console.error(`Lỗi: ${err}`);
                                return;
                            }
                            console.log(`Xoá: ${save_path}`);
                        });
                    });
                });
            } else {
                console.error(`Lỗi: ${response.statusCode}`);
                api.sendMessage({
                    body: "Lỗi ❌",
                }, event.threadID);
            }
        });
    }
    
};

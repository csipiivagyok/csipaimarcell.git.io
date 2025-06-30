const mineflayer = require('mineflayer');
const navigatePlugin = require('mineflayer-navigate')(mineflayer);

const password = 'king01';
const host = 'play.rivalsnetwork.hu';
const version = '1.20.1';
const timeout = 90000;

const accounts = ['Zysu6', 'Zysu7', 'Zysu8', 'Zysu9', 'Zysu10', 'Zysu11', 'Zysu12'];
const bots = [];

function createBot(username) {
  if (bots.find(b => b.username === username)) {
    console.log(`⚠️ ${username} már aktív.`);
    return;
  }

  console.log(`🔍 Bot indítása: ${username}`);

  const bot = mineflayer.createBot({
    host,
    username,
    version,
    timeout
  });

  navigatePlugin(bot);

  bot.once('spawn', () => {
    console.log(`✅ ${username} belépett!`);
    bot.chat(`/login ${password}`);
    setTimeout(() => bot.chat('/joinq lobby2'), 1500);
  });

  bot.on('end', () => {
    console.log(`⚠️ ${username} lecsatlakozott. Újrapróbálkozás 5 mp múlva...`);
    const index = bots.indexOf(bot);
    if (index !== -1) bots.splice(index, 1);
    setTimeout(() => createBot(username), 5000);
  });

  bot.on('error', (err) => {
    console.error(`❌ Hiba (${username}):`, err.message);
  });

  bot.on('message', (jsonMsg) => {
    const msg = jsonMsg.toString();
    console.log(`[${bot.username}] 💬 Üzenet: ${msg}`);

    if (msg.includes('⇨')) {
      const content = msg.split('⇨')[1]?.trim();

      if (content === 'rc') {
        bots.forEach((b, i) => {
          setTimeout(() => {
            b.chat('/rc');
          }, i * 1000);
        });
      }

      if (content === 'reward') {
        bots.forEach((b, i) => {
          setTimeout(() => {
            b.chat('/reward');

            const rewardTimeout = setTimeout(() => {
              if (!b.currentWindow) {
                console.log(`⚠️ ${b.username}: Reward ablak nem nyílt meg.`);
              }
            }, 5000);

            b.once('windowOpen', (window) => {
              clearTimeout(rewardTimeout);
              console.log(`📦 ${b.username}: Reward ablak megnyílt.`);

              const midRowStart = 9;
              const midRowEnd = 17;

              for (let i = midRowStart + 1; i < midRowEnd - 1; i++) {
                const item = window.slots[i];
                if (item && item.name) {
                  setTimeout(() => {
                    b.clickWindow(i, 0, 0);
                    console.log(`✅ ${b.username}: claim slot ${i}`);
                  }, (i - midRowStart) * 750);
                }
              }

              setTimeout(() => {
                try {
                  b.closeWindow(window);
                  console.log(`🔒 ${b.username}: Reward ablak bezárva.`);
                } catch (e) {
                  console.log(`⚠️ ${b.username}: Nem sikerült bezárni az ablakot.`);
                }
              }, 6000);
            });
          }, i * 3000);
        });
      }

      if (content === 'tpzz') {
        bots.forEach((b, i) => {
          setTimeout(() => {
            b.chat('/tpa Zysahh');
          }, i * 2000);
        });
      }

      if (content === 'drop') {
        bots.forEach((b, i) => {
          setTimeout(() => {
            b.inventory.slots.forEach(item => {
              if (item) b.tossStack(item);
            });
          }, i * 1000);
        });
      }

      if (content === 'join') {
        bots.forEach(b => b.chat('/join asdasdasdacsk'));
      }

      if (content === 'leave') {
        bots.forEach(b => b.chat('/k leave'));
      }

      if (content.startsWith('/k invite')) {
        bots.forEach((b, i) => {
          setTimeout(() => {
            b.chat(content);
          }, i * 3000);
        });
      }

      if (content === 'stop') {
        bots.forEach(b => b.quit());
        process.exit();
      }
    }
  });

  bots.push(bot);
}

accounts.forEach((username, index) => {
  setTimeout(() => createBot(username), index * 3000);
});

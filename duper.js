const fs = require("fs");
const path = require("path");
const mineflayer = require("mineflayer");
const { Vec3 } = require("vec3");
const colors = require("colors");

const OPTIONS = {
  username: "King_Hades_",
  host: "testingserverss.minekeep.gg",
  port: 25565,
};

function initBot() {
  const bot = mineflayer.createBot(OPTIONS);

  bot.once("spawn", async () => {
    await bot.waitForChunksToLoad();
    const bookID = bot.registry.itemsByName["written_book"].id;

    async function spreadBooks() {
      const chestPos = new Vec3(893, 4, 2094);
      const chestBlock = bot.blockAt(chestPos);

      if (!chestBlock) {
        console.error("Chest block not found at", chestPos);
        return;
      }

      const chest = await bot.openContainer(chestBlock);
      await chest.withdraw(bookID, 0, 16);
      await chest.withdraw(bookID, 0, 11);

      bot.simpleClick.leftMouse(28);
      for (let i = 0; i < 20 - 1; i++) {
        await bot.simpleClick.rightMouse(i);
      }

      bot.simpleClick.rightMouse(11);
      bot.simpleClick.leftMouse(27);
      for (let i = 11; i < 28 - 1; i++) {
        await bot.simpleClick.rightMouse(i);
      }

      chest.close();
      console.log(`[${new Date().toLocaleTimeString().cyan}] ${`Books have been spread`.white}`, colors.yellow(`(1/3)`));
    }

    await spreadBooks();

    const blocks = [
      [891, 4, 2094],
      [890, 4, 2094],
    ];

    async function breakRedstone(block) {
      bot.dig(block, "ignore").catch(() => {});
    }

    blocks.forEach((coords) => {
      const repeater = bot.blockAt(new Vec3(...coords));
      breakRedstone(repeater);
    });

    console.log(`[${new Date().toLocaleTimeString().cyan}] ${`Repeaters have been broken`.white}`, colors.yellow(`(2/3)`));
    console.log(`[${new Date().toLocaleTimeString().cyan}] ${`Waiting for the items to leave the chunk`.grey}`, colors.yellow(`(40 seconds)`));

    setTimeout(() => {
      console.log(`[${new Date().toLocaleTimeString().cyan}] ${`Items from the chests have been removed`.white}`, colors.yellow(`leaving... (3/3)\n`));
      bot.quit();
    }, 40 * 1000);
  });

  bot.on("end", function () {
    setTimeout(() => {
      initBot();
    }, 10 * 1000);
  });
}

initBot();

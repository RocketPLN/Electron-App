// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { ipcRenderer } = require("electron");

async function getDirectory() {
  return new Promise((resolve) => {
    ipcRenderer.once("selectedDirectory", (_, directory) => {
      resolve(directory);
    });
    ipcRenderer.send("dir");
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const selectDir = document.getElementById("selectDir");
  const nav = [
    document.getElementById("downloadButton"),
    document.getElementById("settingButton"),
    document.getElementById("themeButton"),
  ];
  const installPath = document.getElementById("path");
  const buttons = [
    (firefoxBtn = document.getElementById("🦊")),
    (codeBtn = document.getElementById("📝")),
    (nodeBtn = document.getElementById("🟨")),
    (spotifyBtn = document.getElementById("🎵")),
    (discordBtn = document.getElementById("✉")),
    (terminalBtn = document.getElementById("⬛")),
  ];
  const commands = [
    "Mozilla.Firefox.DeveloperEdition",
    "Microsoft.VisualStudioCode",
    "OpenJS.NodeJS",
    "Spotify.Spotify",
    "Discord.Discord",
    "Microsoft.WindowsTerminal",
  ];

  if (localStorage.getItem("theme") == null) {
    body.className = "light";
    localStorage.setItem("theme", "light");
  } else {
    body.className = localStorage.getItem("theme");
    nav[2].setAttribute("name", localStorage.getItem("icon"));
  }

  if (localStorage.getItem("installPath")) {
    installPath.value = localStorage.getItem("installPath");
  }

  nav[0].addEventListener("click", () => {
    document.querySelector(".download").classList.remove("deactive");
    document.querySelector(".settings").classList.remove("deactive");
  });
  nav[1].addEventListener("click", () => {
    document.querySelector(".download").classList.add("deactive");
    document.querySelector(".settings").classList.add("deactive");
  });
  nav[2].addEventListener("click", () => {
    if (body.className === "light") {
      localStorage.setItem("theme", "dark");
      localStorage.setItem("icon", "sunny-outline");
      body.classList.replace("light", "dark");
      theme.setAttribute("name", "sunny-outline");
    } else {
      localStorage.setItem("theme", "light");
      localStorage.setItem("icon", "moon-outline");
      body.classList.replace("dark", "light");
      theme.setAttribute("name", "moon-outline");
    }
  });

  selectDir.addEventListener("click", async () => {
    const selectedDirectory = await getDirectory();
    if (selectedDirectory) {
      installPath.value = selectedDirectory;
      localStorage.setItem("installPath", selectedDirectory);
    }
  });

  document.getElementById("clear").addEventListener("click", () => {
    localStorage.clear();
    installPath.value = "";
  });

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", () => {
      ipcRenderer.send(
        "command",
        `winget install -e --id ${commands[i]}`,
        `${localStorage.getItem("installPath")}`
      );
    });
  }
});

import { ConfigModal } from "./modules/ModalConfig.js";
import { limitarEntrada } from "./modules/limitarTempo.js";
import { DarkModeConfig } from "./modules/DarkMode.js";
import { setupTooltip } from "./modules/Tooltip.js";
import { setupPomodoro } from "./modules/Pomodoro/Pomodoro.js";


limitarEntrada(); 
ConfigModal();
DarkModeConfig();
setupTooltip();
setupPomodoro();
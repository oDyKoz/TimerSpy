import { ConfigModal } from "../functions/ModalConfig.js";
import { limitarEntrada } from "../functions/limitarTempo.js";
import { DarkModeConfig } from "../functions/DarkMode.js";
import { setupTooltip } from "../functions/Tooltip.js";
import { setupPomodoro } from "../functions/Pomodoro.js";


limitarEntrada(); 
ConfigModal();
DarkModeConfig();
setupTooltip();
setupPomodoro();
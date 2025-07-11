import { ConfigModal } from "../functions/ModalConfig.js";
import { limitarEntrada } from "../functions/limitarEntrada.js";
import { PomoModal } from "../functions/ModalPomo.js";
import { DarkModeConfig } from "../functions/DarkMode.js";
import { startup } from "../functions/ColorChange.js";
import { setupTooltip } from "../functions/Tooltip.js";
import { setupPomodoro } from "../functions/Pomodoro.js";


limitarEntrada();
PomoModal();  
ConfigModal();
DarkModeConfig();
startup();
setupTooltip();
setupPomodoro();
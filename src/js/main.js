import { ConfigModal } from "../functions/ModalConfig.js"; // Corrija o caminho se necessário
import { limitarEntrada } from "../functions/limitarEntrada.js";
import { PomoModal } from "../functions/ModalPomo.js";
import { DarkModeConfig } from "../functions/DarkMode.js";
import { startup } from "../functions/ColorChange.js";

limitarEntrada();
PomoModal();  
ConfigModal();
DarkModeConfig();
startup();
import { ConfigModal } from "../functions/ModalConfig.js"; // Corrija o caminho se necessário
import { limitarEntrada } from "../functions/limitarEntrada.js";
import { PomoModal } from "../functions/ModalPomo.js";

limitarEntrada();
PomoModal();  
ConfigModal();

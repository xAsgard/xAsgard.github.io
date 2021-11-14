import { parseVariation, realId } from './itemCodes';
import { decimalToHex } from './numeric';
import ot from '../data/output_template.json'
import { isRecipe } from './items';
import { Variant } from '../items/items';
import { Recipes } from '../items/recipes';

const PLAYER_1_1_ADDRESS = 0xACDAD530
const PLAYER_1_2_ADDRESS = 0xACDAD5E8
const PLAYER_OFFSET = 0x133B78
const SLOT_OFFSET = 0x8

export function getInventoryAddres(player: number, slot: number) {
  const basePlayerAddress = slot >= 20 ? PLAYER_1_2_ADDRESS : PLAYER_1_1_ADDRESS
  const actualSlotCount = slot >= 20 ? slot - 20 : slot
  const playerAddress = basePlayerAddress + (player * PLAYER_OFFSET)
  return decimalToHex((playerAddress + (actualSlotCount * SLOT_OFFSET)))
}

type Player = keyof typeof ot

//const inventoryOffsets: Record<Player, number> = {
//  "Player 1": 0,
//  "Player 2": 1,
//  "Player 3": 2,
//  "Player 4": 3,
//  "Player 5": 4,
//  "Player 6": 5,
//  "Player 7": 6,
//  "Player 8": 7
//}

//function generateTemplate(index: number, player: Player = "Player 1"): [string, string, string, string] {
//  const inventoryPosition = getInventoryAddres(inventoryOffsets[player], index)
//  return ["08100000", inventoryPosition, "00000000", "0000FFFE"]
//}


function recipeCheat(item: Recipes): string[] {
  return [decimalToHex(realId(item)), '000016A2']
}

function itemCheat(item: Variant): string[] {
  return [item.variantId != null ? parseVariation(item.variantId) : '00000000', decimalToHex(realId(item))]
}

export function formatCheat(item: Variant | Recipes, indexAsString: string, player: Player = "Player 1") {
  //const index = parseInt(indexAsString, 10);
  //const template = generateTemplate(index, player)
  const [thirdField, fourthField] = isRecipe(item) ? recipeCheat(item) : itemCheat(item)
  return `${thirdField}${fourthField} `;
}

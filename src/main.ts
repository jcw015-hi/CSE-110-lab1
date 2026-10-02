import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { User_Inventory, DailyScenario} from './types';
import { toASCII } from 'punycode';

let day = 1;

const player: User_Inventory = {
    Asset: 10.00,
    Profit: 0.00,
    Income: 0.00,
    Expenses: 0.00,
    Glasses_made: 0.00,
    Glasses_sold: 0.00,
    Price_per_glass: 0.00

};

type Weather = 'hot' | 'normal' | 'cold';
type Supply = 'cups' | 'ice' | 'lemons' | 'sugar';
type SupplyCount = Record <Supply, number>;

const Supply_LIST: Supply[] = ['cups', 'ice', 'lemons', 'sugar'];

const RECIPE: SupplyCount = { cups: 1, ice: 2, lemons: 1, sugar: 1};

const WEATHER_MULTIPLIES: Record<Weather, number> = {hot: 1.5, normal: 1.0, cold: 0.5};

const WEATHER_MESSAGE: Record<Weather, String> = {
    hot: 'It is a Hot day, more customers are coming',
    normal: 'It is a normal day, nothing unusual',
    cold: 'It is a Cold day, less customers are coming',
};

const supplies: SupplyCount = {cups: 0, ice: 0, lemons: 0, sugar: 0
};

function New_Supply_Price(): SupplyCount {
    return {
        cups: round2(Math.random() * 0.04 + 0.02),
        ice: round2(Math.random() * 0.03 + 0.01),
        lemons: new_lemon_price(),
        sugar: round2(Math.random() * 0.07 + 0.03),
    };
}
function new_lemon_price(): number {
    return Math.round((Math.random() * 0.5 + 0.1) * 100) / 100; 
}

function purchase_lemon(game_state: User_Inventory, amount: number, price_lemon: number): void {
    const total_cost = amount * price_lemon;
    game_state.Asset -= total_cost;
    game_state.Expenses += total_cost;
    game_state.Glasses_made = amount;
}

function purchase_supply(game_state: User_Inventory, item: Supply, amount: number, price: number): void {
    const total_cost = round2(amount * price);
    game_state.Asset = round2(game_state.Asset - total_cost);
    game_state.Expenses = round2(game_state.Expenses + total_cost);
    supplies[item] += amount;
}

function cups_makeable(): number {
    return Math.min(...Supply_LIST.map(item => Math.floor(supplies[item] / RECIPE[item])));
}

function weather() Weather {
    const options: Weather[] = ['hot', 'normal', 'cold'];
    return options[Math.floor(Math.random() * options.length)];
}
function lemonade_sale(game_state: User_Inventory, amount: number, price_lemonade: number, multiplier: number): void {
    const demand = Math.round((10 + Math.floor(Math.random() * 21)) * multiplier); 
    const sale = Math.min(demand, amount);
    const revenue = sale * price_lemonade;
    game_state.Glasses_sold = sale;
    game_state.Income += revenue;
    game_state.Asset += revenue;
}

function use_supplies(sold: number): void {
    for (const item of Supply_LIST) {
        supplies[item] -= sold * RECIPE[item];
    }
}

function showSupplies(): void {
    console.log('Supplies left -> Cups: ${supplies.cups} | Ice: ${supplies.ice} | Lemons: ${supplies.lemons} | Sugar: ${supplies.sugar}');
}

async function buy_supplies(rl: readline.Interface, prices: SupplyCount): Promise<void> {
    for (const item of SUPPLY_LIST) {
        while (true) {
            const answer = await rl.question(`How many ${item} do you want to buy at $${prices[item].toFixed(2)} each? (cash: $${player.Asset.toFixed(2)}) `);
            const qty = Number(answer);

            if (!Number.isInteger(qty) || qty < 0) {
                console.log('Please enter a whole number, 0 or higher.');
                continue;
            }
            if (qty * prices[item] > player.Asset) {
                console.log("You can't afford that many.");
                continue;
            }

            purchase_supply(player, item, qty, prices[item]);
            break;
        }
    }
}

function showStats(p: User_Inventory): void {
  console.log("===== Lemonade Stand =====");
  console.log(`Assets:          $${p.Asset.toFixed(2)}`);
  console.log(`Income:          $${p.Income.toFixed(2)}`);
  console.log(`Expenses:        $${p.Expenses.toFixed(2)}`);
  console.log(`Profit:          $${p.Profit.toFixed(2)}`);
  console.log(`Price per glass: $${p.Price_per_glass.toFixed(2)}`);
  console.log(`Glasses made:    ${p.Glasses_made}`);
  console.log(`Glasses sold:    ${p.Glasses_sold}`);
  console.log("==========================");
}

function weather() {

}

async function main(): Promise<void> {
    const rl = readline.createInterface({ input, output });
    let lemon_price = new_lemon_price();

    while (true) {
        console.log(`\nOn Day ${day}, the cost per glass is $${lemon_price.toFixed(2)}.`);
        console.log(`You have $${player.Asset.toFixed(2)}.`);

        const glasses = parseInt(await rl.question('How many glasses of lemonade do you wish to make? '), 10);
        const cents = parseFloat(await rl.question('What price (in cents) do you wish to charge per glass? '));

        if (Number.isNaN(glasses) || glasses < 0 || Number.isNaN(cents) || cents < 0) {
            console.log('Please enter valid, non-negative numbers.');
            continue;
        }
        if (glasses * lemon_price > player.Asset) {
            console.log("You can't afford that many glasses.");
            continue;
        }

        const price_of_lemonade = cents / 100;

        purchase_lemon(player, glasses, lemon_price);
        lemonade_sale(player, glasses, price_of_lemonade);

        player.Price_per_glass = price_of_lemonade;
        player.Profit = player.Income - player.Expenses;

        showStats(player);

        const answer = await rl.question('Press Enter to continue, or type q to quit... ');
        if (answer.trim().toLowerCase() === 'q') break;

        day += 1;
        lemon_price = new_lemon_price();
    }

    console.log('Exiting program... Goodbye!');
    rl.close();
}

main();


import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { User_Inventory, DailyScenario} from './types';

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

function new_lemon_price(): number {
    return Math.round((Math.random() * 0.5 + 0.1) * 100) / 100; 
}

function purchase_lemon(game_state: User_Inventory, amount: number, price_lemon: number): void {
    const total_cost = amount * price_lemon;
    game_state.Asset -= total_cost;
    game_state.Expenses += total_cost;
    game_state.Glasses_made = amount;
}

function lemonade_sale(game_state: User_Inventory, amount: number, price_lemonade: number): void {
    const sale = Math.floor(Math.random() * (amount + 1));
    const revenue = sale * price_lemonade;
    game_state.Glasses_sold = sale;
    game_state.Income += revenue;
    game_state.Asset += revenue;
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

